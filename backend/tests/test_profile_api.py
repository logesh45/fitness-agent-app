import pytest
import requests
import uuid

BASE_URL = 'http://127.0.0.1:5002/api'



def test_update_profile_full(new_profile):
    """Test updating all fields of a profile."""
    profile_id = new_profile['session_token']
    update_data = {
        "name": "Updated Test User",
        "age": 35,
        "fitnessGoal": "Lose Weight",
        "equipment": ["Bodyweight", "Kettlebells"],
        "workoutTypes": ["Cardio"],
        "experienceLevel": "Intermediate"
    }
    response = requests.put(f"{BASE_URL}/profiles/{profile_id}", json=update_data)
    assert response.status_code == 200
    updated_profile = response.json()['profile']
    assert updated_profile['name'] == update_data['name']
    assert updated_profile['age'] == update_data['age']
    assert updated_profile['fitness_goal'] == update_data['fitnessGoal']
    assert updated_profile['equipment'] == update_data['equipment']
    assert updated_profile['workout_types'] == update_data['workoutTypes']
    assert updated_profile['experience_level'] == update_data['experienceLevel']

def test_update_profile_partial(new_profile):
    """Test updating a single field of a profile."""
    profile_id = new_profile['session_token']
    update_data = {"age": 31}
    response = requests.put(f"{BASE_URL}/profiles/{profile_id}", json=update_data)
    assert response.status_code == 200
    updated_profile = response.json()['profile']
    assert updated_profile['age'] == 31
    # Verify other fields are unchanged
    assert updated_profile['name'] == "Updated Test User" # From previous test

def test_update_profile_not_found():
    """Test updating a profile with an invalid UUID."""
    invalid_uuid = uuid.uuid4()
    response = requests.put(f"{BASE_URL}/profiles/{invalid_uuid}", json={"name": "ghost"})
    assert response.status_code == 404
    assert response.json()['error'] == 'Profile not found'

def test_update_profile_empty_body(new_profile):
    """Test updating a profile with an empty request body."""
    profile_id = new_profile['session_token']
    response = requests.put(f"{BASE_URL}/profiles/{profile_id}", json={})
    assert response.status_code == 200 # Should not fail, just no changes
    # You could add more assertions here to check that the profile is unchanged
