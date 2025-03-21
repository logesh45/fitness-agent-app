import requests
import json

BASE_URL = 'http://127.0.0.1:5000/api'

def test_create_profile():
    """Test creating a user profile"""
    url = f"{BASE_URL}/profiles"
    
    # Sample user profile data
    profile_data = {
        "name": "Jane Smith",
        "age": 28,
        "fitnessGoal": "Lose Weight",
        "equipment": ["Dumbbells", "Resistance Bands", "Yoga Mat", "Treadmill"],
        "workoutTypes": ["Strength Training", "HIIT", "Cardio"],
        "experienceLevel": "intermediate"
    }
    
    # Send POST request to create profile
    response = requests.post(url, json=profile_data)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

def test_generate_workout_plan(profile_id):
    """Test generating a workout plan with the new structured approach"""
    url = f"{BASE_URL}/profiles/{profile_id}/workout-plan"
    
    # Send POST request to generate workout plan
    response = requests.post(url)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    if response.status_code == 201:
        # Pretty print the workout plan
        plan = response.json()
        print("\n=== Workout Plan Overview ===")
        print(f"User Profile ID: {plan['user_profile_id']}")
        print(f"Start Date: {plan['start_date']}")
        print(f"End Date: {plan['end_date']}")
        
        # Print a sample of the workout plan (first week, first day)
        if 'plan_data' in plan and 'weeks' in plan['plan_data'] and len(plan['plan_data']['weeks']) > 0:
            first_week = plan['plan_data']['weeks'][0]
            print(f"\n=== Week {first_week['week_number']} Sample ===")
            
            if 'days' in first_week and len(first_week['days']) > 0:
                first_day = first_week['days'][0]
                print(f"Day {first_day['day_number']} - Focus: {first_day.get('focus', 'General')}")
                
                if 'exercises' in first_day and len(first_day['exercises']) > 0:
                    print("\nExercises:")
                    for i, exercise in enumerate(first_day['exercises'], 1):
                        print(f"  {i}. {exercise.get('name', 'Unknown')} - {exercise.get('type', 'Unknown')}")
                        print(f"     Sets: {exercise.get('sets', 'N/A')}, Reps: {exercise.get('reps', 'N/A')}")
                        if 'instructions' in exercise and exercise['instructions']:
                            print(f"     Instructions: {exercise['instructions']}")
                else:
                    print("No exercises found for this day.")
            else:
                print("No days found in the first week.")
        else:
            print("No weeks found in the workout plan.")
        
        # Save the full workout plan to a file for inspection
        with open('workout_plan.json', 'w') as f:
            json.dump(plan, f, indent=2)
        print("\nFull workout plan saved to workout_plan.json")
    else:
        print(f"Error: {response.text}")
    
    return response.json() if response.status_code == 201 else None

if __name__ == "__main__":
    # Test creating a profile
    print("\n=== Testing Create Profile ===")
    profile = test_create_profile()
    
    if profile and 'id' in profile:
        profile_id = profile['id']
        
        # Test generating a workout plan
        print("\n=== Testing Generate Workout Plan ===")
        test_generate_workout_plan(profile_id)
    else:
        print("Failed to create profile, cannot proceed with further tests.")
