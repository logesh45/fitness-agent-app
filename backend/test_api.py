import requests
import json

BASE_URL = 'http://127.0.0.1:5000/api'

def test_create_profile():
    """Test creating a user profile"""
    url = f"{BASE_URL}/profiles"
    
    # Sample user profile data
    profile_data = {
        "name": "John Doe",
        "age": 30,
        "fitnessGoal": "Build Muscle",
        "equipment": ["Dumbbells", "Barbell", "Bench"],
        "workoutTypes": ["Strength Training", "HIIT"],
        "experienceLevel": "intermediate"
    }
    
    # Send POST request to create profile
    response = requests.post(url, json=profile_data)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

def test_get_profile(profile_id):
    """Test retrieving a user profile"""
    url = f"{BASE_URL}/profiles/{profile_id}"
    
    # Send GET request to retrieve profile
    response = requests.get(url)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

def test_update_profile(profile_id):
    """Test updating a user profile"""
    url = f"{BASE_URL}/profiles/{profile_id}"
    
    # Updated profile data
    updated_data = {
        "name": "John Doe",
        "age": 32,  # Updated age
        "fitnessGoal": "Lose Weight",  # Updated goal
        "equipment": ["Dumbbells", "Barbell", "Bench", "Treadmill"],  # Added equipment
        "workoutTypes": ["Strength Training", "HIIT", "Cardio"],  # Added workout type
        "experienceLevel": "intermediate"
    }
    
    # Send PUT request to update profile
    response = requests.put(url, json=updated_data)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

def test_generate_workout_plan(profile_id):
    """Test generating a workout plan"""
    url = f"{BASE_URL}/profiles/{profile_id}/workout-plan"
    
    # Send POST request to generate workout plan
    response = requests.post(url)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2) if response.status_code == 201 else response.text}")
    
    return response.json() if response.status_code == 201 else None

def test_get_workout_plan(profile_id):
    """Test retrieving the latest workout plan"""
    url = f"{BASE_URL}/profiles/{profile_id}/workout-plan"
    
    # Send GET request to retrieve workout plan
    response = requests.get(url)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2) if response.status_code == 200 else response.text}")
    
    return response.json() if response.status_code == 200 else None

if __name__ == "__main__":
    # Test creating a profile
    print("\n=== Testing Create Profile ===")
    profile = test_create_profile()
    
    if profile and 'id' in profile:
        profile_id = profile['id']
        
        # Test retrieving the profile
        print("\n=== Testing Get Profile ===")
        test_get_profile(profile_id)
        
        # Test updating the profile
        print("\n=== Testing Update Profile ===")
        test_update_profile(profile_id)
        
        # Test generating a workout plan
        print("\n=== Testing Generate Workout Plan ===")
        test_generate_workout_plan(profile_id)
        
        # Test retrieving the workout plan
        print("\n=== Testing Get Workout Plan ===")
        test_get_workout_plan(profile_id)
    else:
        print("Failed to create profile, cannot proceed with further tests.")
