"""
Agent for generating personalized fitness options based on user age.
"""
from typing import Dict, List
from dotenv import load_dotenv
from langchain_google_vertexai import VertexAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import ValidationError
from ..models.fitness_options import FitnessOptions
import os

load_dotenv()

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "your-default-project-id")
print(f"Loaded PROJECT_ID: {PROJECT_ID}")

LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")

class FitnessOptionsAgent:
    def __init__(self):
        # Initialize Vertex AI
        self.llm = VertexAI(model_name="gemini-2.0-flash-001", location=LOCATION)
        
        # Create parser for structured output
        self.parser = JsonOutputParser(pydantic_object=FitnessOptions)
        
        # Create prompt template
        self.prompt_template = PromptTemplate(
            template="""
            Generate personalized fitness options for a {user_age} year old person.
            
            Consider factors like:
            1. Physical capabilities and limitations for this age
            2. Common fitness goals and motivations
            3. Recommended exercise types and intensity levels
            4. Safe and effective equipment choices
            5. Typical fitness experience levels
            
            For each category, provide options that are specifically relevant and beneficial for someone of this age.
            
            Return the response in a structured format with these categories:
            1. Fitness Goals (with age-specific notes)
            2. Equipment Options (with safety considerations)
            3. Workout Types (with intensity recommendations)
            4. Experience Levels (with progression timelines)
            
            Each option should include:
            - A unique ID (lowercase with underscores)
            - A clear name
            - A detailed description
            - An appropriate icon name
            - Category-specific fields (age notes, safety tips, etc.)
            
            Use appropriate icons from: activity, heart-pulse, dumbbell, running, yoga, swimming, cycling, walking, stretching, meditation
            
            Focus on safety, sustainability, and age-appropriate progression.
            
            {format_instructions}
            """,
            input_variables=["user_age"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

    def generate_personalized_options(self, user_age: int) -> Dict[str, List[Dict]]:
        """
        Generate personalized fitness options based on user's age.
        
        Args:
            user_age: The age of the user in years
            
        Returns:
            A dictionary containing personalized options for:
            - fitness_goals
            - equipment_options
            - workout_types
            - experience_levels
        """
        try:
            # Create and execute the chain
            chain = self.prompt_template | self.llm | self.parser
            response = chain.invoke({"user_age": user_age})

            print(f"Generated options: {response}")
            
            # The response from parser should be a Pydantic model, convert it to dict
            if isinstance(response, dict):
                # If it's already a dict, return it
                return response
            elif isinstance(response, FitnessOptions):
                # If it's a Pydantic model, convert to dict
                return response.dict()
            else:
                raise ValueError(f"Unexpected response type: {type(response)}")
            
        except ValidationError as e:
            print(f"Validation error in fitness options: {str(e)}")
            raise
        except Exception as e:
            print(f"Error generating fitness options: {str(e)}")
            raise
