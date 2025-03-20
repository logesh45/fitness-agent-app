from google import genai
from google.genai import types

client = genai.Client(vertexai=True, 
project="fitness-multiagent", location="us-central1", http_options=types.HttpOptions(api_version='v1'))
response = client.models.generate_content(
    model="gemini-2.0-flash-001",
    contents="How does AI work?",
)
print(response.text)