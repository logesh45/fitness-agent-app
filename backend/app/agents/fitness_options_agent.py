"""
Agent for generating personalized fitness options based on user age.
"""
from typing import Dict, List, Optional
from dotenv import load_dotenv
from langchain_google_vertexai import VertexAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import ValidationError
from ..models.fitness_options import FitnessOptions, FitnessGoal, EquipmentOption, WorkoutType, ExperienceLevel
import os
import json

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
            
            Current selections:
            {user_selections_formatted}
            
            Consider factors like:
            1. Physical capabilities and limitations for this age
            2. Common fitness goals and motivations
            3. Recommended exercise types and intensity levels
            4. Safe and effective equipment choices
            5. Typical fitness experience levels
            
            For each category, provide options that are specifically relevant and beneficial for someone of this age.
            Include options that complement their current selections.
            
            Return the response in a structured format with these categories:
            1. Fitness Goals (with age-specific notes)
            2. Equipment Options (with safety considerations)
            3. Workout Types (with intensity recommendations)
            4. Experience Levels (with progression timelines)
            
            Each option should include:
            - A unique ID
            - A clear name
            - A detailed description
            - An icon name
            - A relevance score (1-10)
            
            Use icons from: activity, heart-pulse, dumbbell, running, yoga, swimming, cycling, walking, stretching, meditation
            
            Focus on safety, sustainability, and age-appropriate progression.
            {format_instructions}
            """,
            input_variables=["user_age", "user_selections_formatted"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

        # Create the chain
        self.chain = self.prompt_template | self.llm | self.parser

    def _format_selections_for_prompt(self, selections: List[Dict]) -> str:
        """Format the user's selections into a readable string for the prompt."""
        if not selections:
            return "No current selections."
        
        formatted = []
        for selection in selections:
            category = selection.get('type', 'unknown').replace('_', ' ').title()
            name = selection.get('name', 'unknown')
            formatted.append(f"- {category}: {name}")
        
        return "\n".join(formatted)

    def _ensure_selected_options_included(self, 
                                       generated_options: Dict, 
                                       user_selections: List[Dict]) -> Dict:
        """
        Ensure that all previously selected options are included in the generated options.
        Also ensures their selected state is preserved and removes duplicates.
        """
        if not user_selections:
            return generated_options

        # Create maps for each category
        category_maps = {
            'goal': ('fitness_goals', FitnessGoal),
            'equipment': ('equipment_options', EquipmentOption),
            'workout': ('workout_types', WorkoutType),
            'level': ('experience_levels', ExperienceLevel)
        }

        # Process each user selection
        for selection in user_selections:
            selection_type = selection.get('type')
            if selection_type not in category_maps:
                continue

            category_key, model_class = category_maps[selection_type]
            category_options = generated_options[category_key]
            
            # Check if the selection is already in the generated options
            selection_exists = any(opt['id'] == selection['id'] for opt in category_options)
            
            if not selection_exists:
                # Create a new option with the selected item
                new_option = {
                    'id': selection['id'],
                    'name': selection['name'],
                    'description': selection.get('description', 'Previously selected option'),
                    'icon': selection.get('icon', 'activity'),
                    'relevance_score': 10  # High relevance for selected items
                }

                # Add category-specific fields
                if selection_type == 'goal':
                    new_option['age_specific_notes'] = 'Previously selected goal'
                elif selection_type == 'equipment':
                    new_option['safety_considerations'] = 'Review proper form and technique'
                elif selection_type == 'workout':
                    new_option['intensity_recommendation'] = 'Maintain your comfortable intensity level'
                elif selection_type == 'level':
                    new_option['progression_timeline'] = 'Continue with your current level'

                # Add the option to the appropriate category
                generated_options[category_key].insert(0, new_option)

        # Remove duplicates from each category while preserving order
        for category_key in generated_options:
            seen_ids = set()
            unique_options = []
            for option in generated_options[category_key]:
                if option['id'] not in seen_ids:
                    seen_ids.add(option['id'])
                    unique_options.append(option)
            generated_options[category_key] = unique_options

        return generated_options

    def generate_personalized_options(self, user_age: int, user_selections: List[Dict] = None) -> Dict:
        """
        Generate personalized fitness options based on user's age and previous selections.
        
        Args:
            user_age: The age of the user
            user_selections: List of previous user selections with their types
            
        Returns:
            Dict: Structured fitness options
        """
        user_selections = user_selections or []
        formatted_selections = self._format_selections_for_prompt(user_selections)
        
        try:
            # Generate options using the chain
            response = self.chain.invoke({
                "user_age": user_age,
                "user_selections_formatted": formatted_selections
            })

            # Convert response to dict if it's a Pydantic model
            if isinstance(response, FitnessOptions):
                response = response.dict()
            elif not isinstance(response, dict):
                raise ValueError(f"Unexpected response type: {type(response)}")

            # Ensure all selected options are included
            response = self._ensure_selected_options_included(response, user_selections)
            
            print(f"Generated options: {json.dumps(response, indent=2)}")
            return response
                
        except ValidationError as e:
            print(f"Validation error in fitness options: {str(e)}")
            raise
        except Exception as e:
            print(f"Error generating fitness options: {str(e)}")
            raise
