import os
from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from dotenv import load_dotenv
from langchain_google_vertexai import VertexAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from ..models.workout_exercise import Exercise, DailyWorkout, WeeklyWorkout, WorkoutPlanData

load_dotenv()  # Load environment variables from .env file

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "your-default-project-id")
print(f"Loaded PROJECT_ID: {PROJECT_ID}")  # Debugging line to check the project ID

# Add a check for the project ID
if PROJECT_ID == "your-default-project-id":
    print("Warning: Using default project ID. Please set the GOOGLE_CLOUD_PROJECT environment variable.")

LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")  # Set your default location

model_id = "gemini-2.5-flash"

google_search_tool = Tool(
    google_search = GoogleSearch()
)

class UserProfile:
    def __init__(self, name, age, fitness_goal, equipment, workout_types, experience_level):
        self.name = name
        self.age = age
        self.fitness_goal = fitness_goal
        self.equipment = equipment
        self.workout_types = workout_types
        self.experience_level = experience_level

def search_workout_exercises(profile):
    """
    Get personalized workout recommendations using Google GenAI
    
    Args:
        profile: UserProfile object containing user preferences and details
    """
    search_text = f"""
    Find specific workout exercises suitable for a {profile.experience_level} level person 
    with the following preferences:
    - Fitness Goal: {profile.fitness_goal}
    - Available Equipment: {', '.join(profile.equipment)}
    - Preferred Workout Types: {', '.join(profile.workout_types)}
    
    Focus on exercises that are:
    1. Safe and appropriate for their experience level
    2. Achievable with their available equipment
    3. Aligned with their fitness goals
    """
    
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    response = client.models.generate_content(
        model=model_id,
        contents=search_text,
        config=GenerateContentConfig(
            tools=[google_search_tool],
            response_modalities=["TEXT"],
        )
    )

    print(f"search_workout_exercises response-----> {response}")
    
    # Extract exercise recommendations from the response
    exercises = []
    for candidate in response.candidates:
        for part in candidate.content.parts:
            exercises.append(part.text)
    
    return exercises

def generate_structured_workout_plan(profile):
    """
    Generate a structured workout plan using LangChain and Pydantic models
    
    Args:
        profile: UserProfile object containing user preferences and details
    """
    # Connect to Google Cloud resources
    llm = VertexAI(model_name="gemini-2.5-flash", location=LOCATION)
    
    # Create parser for structured output
    parser = JsonOutputParser(pydantic_object=WorkoutPlanData)
    
    # Create prompt template
    instruction = f"""
    Create a comprehensive 3-week workout plan for a {profile.experience_level} level person with the following details:
    - Age: {profile.age}
    - Fitness Goal: {profile.fitness_goal}
    - Available Equipment: {', '.join(profile.equipment)}
    - Preferred Workout Types: {', '.join(profile.workout_types)}
    
    The plan should include:
    1. 3 weeks of workouts
    2. 5 workout days per week
    3. Each day should have a specific focus
    4. Each day should include appropriate exercises with sets, reps, and instructions
    5. Rest days should be appropriately placed
    6. Exercises should be appropriate for their experience level and available equipment
    
    Make sure all exercises are safe, effective, and aligned with their fitness goals.
    """
    
    prompt = PromptTemplate(
        template="Generate a structured workout plan\n{format_instructions}\n{instruction}\n",
        input_variables=["instruction"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    # Create and execute the chain
    chain = prompt | llm | parser
    response = chain.invoke({"instruction": instruction})
    
    print(f"Generated workout plan: {response}")
    return response

# if __name__ == '__main__':
#     # Create a mock user profile for testing
#     mock_profile = UserProfile(
#         name='Test User',
#         age=25,
#         fitness_goal='Reduce Fat',
#         equipment=['Dumbbells', 'Bench', 'Running Shoes'],
#         workout_types=['Strength Training'],
#         experience_level='beginner'
#     )
    
#     # Call the search function
#     exercises = search_workout_exercises(mock_profile)
#     print('Recommended Exercises:')
#     for exercise in exercises:
#         print("Exercise: ", exercise)
        
#     # Generate structured workout plan
#     plan = generate_structured_workout_plan(mock_profile)
#     print('Structured Workout Plan:')
#     print(plan)
