"""
Test the FitnessOptionsAgent functionality.
"""
import json
from app.agents.fitness_options_agent import FitnessOptionsAgent
from app.models.fitness_options import FitnessOptions

def test_fitness_options_generation():
    # Initialize the agent
    agent = FitnessOptionsAgent()
    
    # Test with different age groups
    test_ages = [25, 33, 45, 65]
    
    for age in test_ages:
        print(f"\nTesting fitness options for age: {age}")
        try:
            # Generate options
            options = agent.generate_personalized_options(age)
            
            # Validate the response structure
            assert isinstance(options, dict), "Response should be a dictionary"
            assert all(key in options for key in ['fitness_goals', 'equipment_options', 'workout_types', 'experience_levels']), \
                "Response missing required categories"
            
            # Print the formatted response
            print(json.dumps(options, indent=2))
            
            # Validate using Pydantic model
            validated_options = FitnessOptions(**options)
            print(f"\nSuccessfully validated options for age {age}")
            
            # Print some statistics
            print(f"Number of fitness goals: {len(validated_options.fitness_goals)}")
            print(f"Number of equipment options: {len(validated_options.equipment_options)}")
            print(f"Number of workout types: {len(validated_options.workout_types)}")
            print(f"Number of experience levels: {len(validated_options.experience_levels)}")
            
        except Exception as e:
            print(f"Error generating options for age {age}: {str(e)}")
            raise

if __name__ == "__main__":
    test_fitness_options_generation()
