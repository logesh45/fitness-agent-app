from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from ..agents.fitness_profile_agent import FitnessProfileAgent
from ..agents.workout_generator_agent import WorkoutGeneratorAgent
from ..agents.fitness_options_agent import FitnessOptionsAgent
from ..utils.fitness_options import get_fitness_options

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
        from ..models.workout_plan import WorkoutPlan
        plan = WorkoutPlan.query.filter_by(user_profile_id=str(profile_id)).order_by(WorkoutPlan.created_at.desc()).first()
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
        required_fields = ['name', 'age', 'fitness_goal', 'equipment', 'workout_types', 'experience_level']
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

@api.route('/fitness-options', methods=['GET'])
def get_fitness_selection_options():
    """
    Returns personalized fitness options based on user's age.
    If no age is provided, returns default options.
    """
    try:
        # Get user's age from query parameters
        user_age = request.args.get('age', type=int)
        
        if not user_age:
            return jsonify({'error': 'Age parameter is required'}), 400
            
        # Generate personalized options using LLM
        options = fitness_options_agent.generate_personalized_options(user_age)
        return jsonify(options)
        
    except ValidationError as e:
        # Handle Pydantic validation errors
        return jsonify({
            'error': 'Invalid response format from AI model',
            'details': str(e)
        }), 500
    except Exception as e:
        # Handle other errors
        return jsonify({
            'error': 'Failed to generate fitness options',
            'details': str(e)
        }), 500
