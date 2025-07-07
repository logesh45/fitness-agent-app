import pytest
import requests

BASE_URL = 'http://127.0.0.1:5002/api'

@pytest.fixture(scope='module')
def new_profile():
    """Fixture to create a new profile for testing."""
    profile_data = {
        "name": "Test User",
        "age": 30,
        "fitnessGoal": "Build Muscle",
        "equipment": ["Dumbbells"],
        "workoutTypes": ["Strength Training"],
        "experienceLevel": "Beginner"
    }
    response = requests.post(f"{BASE_URL}/profile", json=profile_data)
    assert response.status_code == 201
    return response.json()
