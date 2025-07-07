import os
from typing import TypedDict, Optional

import os
from typing import TypedDict, Optional

# Phoenix/OpenTelemetry Imports
import phoenix.otel

from langchain_google_vertexai import ChatVertexAI
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, END

# --- Phoenix Tracing Setup ---
# Set the PHOENIX_COLLECTOR_ENDPOINT for local tracing. Assumes Phoenix is running.
os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "http://127.0.0.1:4317"

# Configure Phoenix with auto-instrumentation. This is all that's needed.
phoenix.otel.register(
    project_name="langgraph-fitness-agent",
    auto_instrument=True,  # This will automatically trace LangChain calls
)
# --- End Phoenix Setup ---


# Set up Google Cloud environment
os.environ["GOOGLE_CLOUD_PROJECT"] = "fitness-multiagent"
os.environ["GOOGLE_CLOUD_LOCATION"] = "us-central1"

# Define the state structure for our graph
class AgentState(TypedDict):
    query: str
    response: Optional[str]
    processed_response: Optional[str]

# Initialize the LLM with streaming enabled
llm = ChatVertexAI(model="gemini-2.5-flash", streaming=True)

# Define nodes for our graph
def generate_response(state: AgentState) -> AgentState:
    """Generate a response using the LLM."""
    response = llm.invoke([HumanMessage(content=state["query"])])
    return {"response": response.content}

def process_response(state: AgentState) -> AgentState:
    """Process the generated response."""
    if not state["response"]:
        return {}
    response_text = state["response"]
    first_sentence_end = response_text.find(".") + 1
    processed = (
        response_text[:first_sentence_end].upper() + response_text[first_sentence_end:]
        if first_sentence_end > 0
        else response_text.upper()
    )
    processed_final = processed + "\n\n(Processed by LangGraph)"
    return {"processed_response": processed_final}

# Build the graph
workflow = StateGraph(AgentState)
workflow.add_node("generate", generate_response)
workflow.add_node("process", process_response)
workflow.set_entry_point("generate")
workflow.add_edge("generate", "process")
workflow.add_edge("process", END)
app = workflow.compile()

# Define initial state
initial_state = {
    "query": "How does AI work?",
}

print("--- Starting LangGraph Execution with Phoenix Tracing ---")
print("View traces at http://localhost:6006")

# Use stream_mode to get both node updates and LLM tokens
print("\nLLM Token Stream: ", end="")
for mode, chunk in app.stream(initial_state, stream_mode=["updates", "messages"]):
    if mode == "messages":
        message_chunk = chunk[0]
        if hasattr(message_chunk, 'content') and message_chunk.content:
            print(message_chunk.content, end="", flush=True)
    elif mode == "updates":
        node_name = list(chunk.keys())[0]
        if node_name != "__end__":
            print(f"\n\n--- Workflow Update from Node: '{node_name}' ---")
            print(f"State after node: {chunk[node_name]}")

print("\n\n\n--- Final Processed Response ---")
final_result = app.invoke(initial_state)
print(final_result.get("processed_response"))

print("\n--- Tracing Complete ---")