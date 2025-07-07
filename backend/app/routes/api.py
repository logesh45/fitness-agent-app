from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from ..agents.fitness_profile_agent import FitnessProfileAgent
from ..agents.workout_generator_agent import WorkoutGeneratorAgent
from ..agents.fitness_options_agent import FitnessOptionsAgent
from ..utils.fitness_options import get_fitness_options
import json

api = Blueprint('api', __name__)

# Initialize agents
fitness_options_agent = FitnessOptionsAgent()
fitness_profile_agent = FitnessProfileAgent()
workout_generator = WorkoutGeneratorAgent()

@api.route('/profiles', methods=['POST'])
def create_profile():
    try:
        profile_data = request.get_json()
        profile = fitness_profile_agent.create_profile(profile_data)
        return jsonify(profile), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<uuid:profile_id>', methods=['GET'])
def get_profile(profile_id):
    try:
        profile = fitness_profile_agent.get_profile(str(profile_id))
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<uuid:profile_id>', methods=['PUT'])
def update_profile(profile_id):
    try:
        profile_data = request.get_json()
        profile = fitness_profile_agent.update_profile(str(profile_id), profile_data)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<uuid:profile_id>/workout-plan', methods=['POST'])
def generate_workout_plan(profile_id):
    try:
        workout_plan = workout_generator.generate_workout_plan(str(profile_id))
        return jsonify(workout_plan), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<uuid:profile_id>/workout-plan', methods=['GET'])
def get_latest_workout_plan(profile_id):
    try:
        from ..models.user_profile import UserProfile
        from ..models.workout_plan import WorkoutPlan

        profile = UserProfile.query.filter_by(uuid=str(profile_id)).first()
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        plan = WorkoutPlan.query.filter_by(user_profile_id=profile.id).order_by(WorkoutPlan.created_at.desc()).first()
        if not plan:
            return jsonify({'error': 'No workout plan found'}), 404
        return jsonify(plan.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@api.route('/profile', methods=['POST'])
def create_user_profile():
    """
    Create a new user profile and return a session token.
    """
    try:
        profile_data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'age', 'fitnessGoal', 'equipment', 'workoutTypes', 'experienceLevel']
        if not all(field in profile_data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Create profile and get UUID
        profile = fitness_profile_agent.create_profile(profile_data)
        
        return jsonify({
            'session_token': profile['uuid'],
            'profile': profile
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/profile/<uuid:session_token>', methods=['GET'])
def get_user_profile(session_token: str):
    """
    Retrieve user profile using session token.
    """
    try:
        profile = fitness_profile_agent.get_profile(session_token)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/profile/<uuid:session_token>', methods=['PUT'])
def update_user_profile(session_token: str):
    """
    Update user profile using session token.
    """
    try:
        profile_data = request.get_json()
        profile = fitness_profile_agent.update_profile(session_token, profile_data)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/options', methods=['POST'])
def get_dynamic_fitness_options():
    """
    Returns personalized fitness options based on user's age and previous selections,
    sent via a POST request.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON body'}), 400

        user_age = data.get('age')
        if not user_age:
            return jsonify({'error': 'Age parameter is required'}), 400
            
        user_selections = data.get('selections', [])
        
        # Generate personalized options using the agent
        options = fitness_options_agent.generate_personalized_options(user_age, user_selections)
        return jsonify(options)
        
    except ValidationError as e:
        # Handle Pydantic validation errors from the agent
        return jsonify({
            'error': 'Invalid data structure from AI model',
            'details': str(e)
        }), 500
    except Exception as e:
        # Handle other potential errors
        print(f"Error in /options endpoint: {str(e)}")
        return jsonify({
            'error': 'Failed to generate fitness options',
            'details': str(e)
        }), 500
