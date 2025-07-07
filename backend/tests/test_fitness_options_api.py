import requests

BASE_URL = 'http://127.0.0.1:5002/api'

def test_get_dynamic_fitness_options_with_age():
    """Test fetching dynamic fitness options with only age provided."""
    data = {"age": 30}
    response = requests.post(f"{BASE_URL}/options", json=data)
    assert response.status_code == 200
    options = response.json()
    assert isinstance(options, dict)
    assert "fitness_goals" in options
    assert "equipment_options" in options
    assert "workout_types" in options
    assert "experience_levels" in options


def test_get_dynamic_fitness_options_missing_age():
    """Test fetching dynamic fitness options without age (should fail)."""
    data = {"selections": {}}
    response = requests.post(f"{BASE_URL}/options", json=data)
    assert response.status_code == 400
    assert "error" in response.json()

def test_get_dynamic_fitness_options_empty_body():
    """Test fetching dynamic fitness options with an empty request body (should fail)."""
    response = requests.post(f"{BASE_URL}/options", json={})
    assert response.status_code == 400
    assert "error" in response.json()

