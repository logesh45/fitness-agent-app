import requests

BASE_URL = 'http://127.0.0.1:5002/api'

def test_generate_workout_plan(new_profile):
    """Test generating a workout plan."""
    profile_id = new_profile['session_token']
    response = requests.post(f"{BASE_URL}/profiles/{profile_id}/workout-plan")
    assert response.status_code == 201
    workout_plan = response.json()
    assert 'plan_data' in workout_plan

def test_get_workout_plan(new_profile):
    """Test retrieving the latest workout plan."""
    profile_id = new_profile['session_token']
    # First, generate a plan to ensure one exists
    requests.post(f"{BASE_URL}/profiles/{profile_id}/workout-plan")
    
    # Now, get the plan
    response = requests.get(f"{BASE_URL}/profiles/{profile_id}/workout-plan")
    assert response.status_code == 200
    workout_plan = response.json()
    assert 'plan_data' in workout_plan
