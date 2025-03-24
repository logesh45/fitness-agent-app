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
            "age": 33,
            "selections": None,
            "description": "Initial selection with no previous choices"
        },
        {
            "age": 33,
            "selections": ["weight_loss", "beginner"],
            "description": "Second selection with weight loss and beginner level"
        },
        {
            "age": 33,
            "selections": ["weight_loss", "beginner", "cardio"],
            "description": "Third selection with additional cardio focus"
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
            
            # Validate that options include relevance scores
            for category in options.values():
                for option in category:
                    assert 'relevance_score' in option, "Each option should have a relevance score"
                    assert isinstance(option['relevance_score'], int), "Relevance score should be an integer"
                    assert 1 <= option['relevance_score'] <= 10, "Relevance score should be between 1 and 10"
            
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
