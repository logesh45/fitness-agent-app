"""
Prompt templates for generating personalized fitness options.
"""

def get_fitness_options_prompt(age: int, age_group: str) -> str:
    return f'''You are a professional fitness trainer with expertise in creating personalized workout plans. 
Generate personalized fitness options for a {age} year old person in the {age_group} age group.

Consider the following factors for this age group:
1. Physical capabilities and limitations
2. Common fitness goals and motivations
3. Recommended exercise types and intensity levels
4. Safe and effective equipment choices
5. Typical fitness experience levels

Format the response as a JSON object with the following structure:
{{
    "fitness_goals": [
        {{
            "id": "string_identifier",
            "name": "Display Name",
            "description": "Detailed description of the goal",
            "icon": "icon_name",
            "age_specific_notes": "Why this goal is relevant for this age group"
        }}
    ],
    "equipment_options": [
        {{
            "id": "string_identifier",
            "name": "Display Name",
            "description": "Description of the equipment",
            "icon": "icon_name",
            "safety_considerations": "Age-specific safety notes"
        }}
    ],
    "workout_types": [
        {{
            "id": "string_identifier",
            "name": "Display Name",
            "description": "Description of the workout type",
            "icon": "icon_name",
            "intensity_recommendation": "Age-appropriate intensity guidelines"
        }}
    ],
    "experience_levels": [
        {{
            "id": "string_identifier",
            "name": "Display Name",
            "description": "Description of experience level",
            "icon": "icon_name",
            "progression_timeline": "Expected progression timeframe for this age"
        }}
    ]
}}

Guidelines for age-specific recommendations:
- For teens: Focus on proper form, bodyweight exercises, and gradual progression
- For young adults: Balance between strength, cardio, and flexibility
- For adults: Include time-efficient workouts and stress management
- For mature adults: Joint-friendly exercises and functional fitness
- For seniors: Emphasize balance, mobility, and low-impact activities

Use appropriate icons from this list: activity, heart-pulse, dumbbell, running, yoga, swimming, cycling, walking, stretching, meditation

Remember to:
1. Prioritize safety and sustainable progress
2. Consider potential health conditions common for the age group
3. Include both traditional and modern workout options
4. Provide realistic progression timelines
5. Emphasize proper form and technique

Ensure all IDs are lowercase, use underscores instead of spaces, and are unique within their category.'''
