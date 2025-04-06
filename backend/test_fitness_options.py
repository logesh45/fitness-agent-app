"""
Test the FitnessOptionsAgent functionality.
"""
import json
from app.agents.fitness_options_agent import FitnessOptionsAgent
from app.models.fitness_options import FitnessOptions

def test_fitness_options_generation():
    # Initialize the agent
    agent = FitnessOptionsAgent()
    
    # Test with different age groups and selection scenarios
    test_cases = [
        {
            "age": 25,
            "selections": None,
            "description": "Initial selection with no previous choices"
        },
        {
            "age": 25,
            "selections": [
                {
                    "id": "goal-1",
                    "name": "Weight Loss",
                    "type": "goal"
                },
                {
                    "id": "equip-1",
                    "name": "Dumbbells",
                    "type": "equipment"
                }
            ],
            "description": "Selection with weight loss goal and dumbbells"
        },
        {
            "age": 25,
            "selections": [
                {
                    "id": "goal-1",
                    "name": "Weight Loss",
                    "type": "goal"
                },
                {
                    "id": "equip-1",
                    "name": "Dumbbells",
                    "type": "equipment"
                },
                {
                    "id": "workout-2",
                    "name": "Cardio",
                    "type": "workout"
                }
            ],
            "description": "Selection with weight loss, dumbbells, and cardio"
        }
    ]

    for case in test_cases:
        print(f"\nTesting fitness options for {case['description']}")
        try:
            # Generate options
            options = agent.generate_personalized_options(case['age'], case['selections'])
            
            # Validate the response structure
            assert isinstance(options, dict), "Response should be a dictionary"
            assert all(key in options for key in ['fitness_goals', 'equipment_options', 'workout_types', 'experience_levels']), \
                "Response missing required categories"
            
            # Validate that options include relevance scores and required fields
            for category_name, category in options.items():
                for option in category:
                    # Common fields for all options
                    assert 'id' in option, f"Option in {category_name} missing id"
                    assert 'name' in option, f"Option in {category_name} missing name"
                    assert 'description' in option, f"Option in {category_name} missing description"
                    assert 'icon' in option, f"Option in {category_name} missing icon"
                    assert 'relevance_score' in option, f"Option in {category_name} missing relevance score"
                    assert isinstance(option['relevance_score'], int), "Relevance score should be an integer"
                    assert 1 <= option['relevance_score'] <= 10, "Relevance score should be between 1 and 10"
                    
                    # Category-specific fields
                    if category_name == 'fitness_goals':
                        assert 'age_specific_notes' in option, "Fitness goal missing age_specific_notes"
                    elif category_name == 'equipment_options':
                        assert 'safety_considerations' in option, "Equipment option missing safety_considerations"
                    elif category_name == 'workout_types':
                        assert 'intensity_recommendation' in option, "Workout type missing intensity_recommendation"
                    elif category_name == 'experience_levels':
                        assert 'progression_timeline' in option, "Experience level missing progression_timeline"
            
            # If there were selections, verify they are included in the response
            if case['selections']:
                for selection in case['selections']:
                    category_map = {
                        'goal': 'fitness_goals',
                        'equipment': 'equipment_options',
                        'workout': 'workout_types',
                        'level': 'experience_levels'
                    }
                    category_key = category_map[selection['type']]
                    found = any(opt['id'] == selection['id'] for opt in options[category_key])
                    assert found, f"Selected option {selection['id']} not found in response"
            
            # Print the formatted response
            print(json.dumps(options, indent=2))
            
            # Validate using Pydantic model
            validated_options = FitnessOptions(**options)
            print(f"\nSuccessfully validated options for {case['description']}")
            
            # Print some statistics
            print(f"Number of fitness goals: {len(validated_options.fitness_goals)}")
            print(f"Number of equipment options: {len(validated_options.equipment_options)}")
            print(f"Number of workout types: {len(validated_options.workout_types)}")
            print(f"Number of experience levels: {len(validated_options.experience_levels)}")
            
        except Exception as e:
            print(f"Error generating options for {case['description']}: {str(e)}")
            raise

if __name__ == "__main__":
    test_fitness_options_generation()
