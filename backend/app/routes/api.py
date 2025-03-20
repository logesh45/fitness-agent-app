from flask import Blueprint, request, jsonify
from ..agents.fitness_profile_agent import FitnessProfileAgent
from ..agents.workout_generator_agent import WorkoutGeneratorAgent

api = Blueprint('api', __name__)

@api.route('/profiles', methods=['POST'])
def create_profile():
    try:
        profile_data = request.get_json()
        profile = FitnessProfileAgent.create_profile(profile_data)
        return jsonify(profile), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<int:profile_id>', methods=['GET'])
def get_profile(profile_id):
    try:
        profile = FitnessProfileAgent.get_profile(profile_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<int:profile_id>', methods=['PUT'])
def update_profile(profile_id):
    try:
        profile_data = request.get_json()
        profile = FitnessProfileAgent.update_profile(profile_id, profile_data)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<int:profile_id>/workout-plan', methods=['POST'])
def generate_workout_plan(profile_id):
    try:
        workout_plan = WorkoutGeneratorAgent.generate_workout_plan(profile_id)
        return jsonify(workout_plan), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/profiles/<int:profile_id>/workout-plan', methods=['GET'])
def get_latest_workout_plan(profile_id):
    try:
        from ..models.workout_plan import WorkoutPlan
        plan = WorkoutPlan.query.filter_by(user_profile_id=profile_id).order_by(WorkoutPlan.created_at.desc()).first()
        if not plan:
            return jsonify({'error': 'No workout plan found'}), 404
        return jsonify(plan.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 400
