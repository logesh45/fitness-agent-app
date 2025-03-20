from datetime import datetime, timedelta
from ..models.workout_plan import WorkoutPlan, db
from ..models.user_profile import UserProfile
from ..utils.search import search_workout_exercises
import json

class WorkoutGeneratorAgent:
    @staticmethod
    def generate_workout_plan(profile_id):
        """Generate a 3-week workout plan based on user profile."""


        profile = UserProfile.query.get(profile_id)
        if not profile:
            raise ValueError("Profile not found")

        # Get personalized exercise recommendations using Google GenAI
        recommended_exercises = search_workout_exercises(profile)

        # Create a structured 3-week plan
        plan_data = {
            'weeks': []
        }

        # Parse and organize the recommended exercises
        exercises_by_type = WorkoutGeneratorAgent._parse_exercise_recommendations(
            recommended_exercises,
            profile.workout_types,
            profile.experience_level
        )

        # Generate 3 weeks of workouts
        for week in range(3):
            week_data = {
                'week_number': week + 1,
                'days': []
            }

            # Generate 5 workout days per week
            for day in range(5):
                day_data = {
                    'day_number': day + 1,
                    'exercises': WorkoutGeneratorAgent._generate_daily_workout(
                        exercises_by_type,
                        profile.experience_level,
                        profile.workout_types
                    )
                }
                week_data['days'].append(day_data)

            plan_data['weeks'].append(week_data)

        # Create and save the workout plan
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(weeks=3)
        
        workout_plan = WorkoutPlan(
            user_profile_id=profile_id,
            start_date=start_date,
            end_date=end_date,
            plan_data=plan_data
        )

        try:
            db.session.add(workout_plan)
            db.session.commit()
            return workout_plan.to_dict()
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def _parse_exercise_recommendations(recommendations, workout_types, experience_level):
        """Parse and organize exercise recommendations from Google GenAI."""
        exercises_by_type = {}
        
        for workout_type in workout_types:
            exercises_by_type[workout_type] = []
            
            # Extract exercises for each workout type from recommendations
            for rec in recommendations:
                # Process the recommendation text to extract exercise details
                exercise = WorkoutGeneratorAgent._extract_exercise_details(rec, workout_type, experience_level)
                if exercise:
                    exercises_by_type[workout_type].append(exercise)
        
        return exercises_by_type

    @staticmethod
    def _extract_exercise_details(recommendation, workout_type, experience_level):
        """Extract exercise details from a recommendation string."""
        try:
            # Basic parsing of the recommendation text
            # Expecting format like: "Exercise: Push-ups, Type: Strength Training, Sets: 3, Reps: 10-12"
            parts = recommendation.split(',')
            exercise_data = {}
            
            for part in parts:
                key_value = part.strip().split(':')
                if len(key_value) == 2:
                    key, value = key_value
                    exercise_data[key.strip().lower()] = value.strip()
            
            if 'exercise' in exercise_data and 'type' in exercise_data:
                if exercise_data['type'].lower() == workout_type.lower():
                    return {
                        'name': exercise_data['exercise'],
                        'sets': exercise_data.get('sets', '3'),
                        'reps': exercise_data.get('reps', '10-12'),
                        'duration': exercise_data.get('duration', None)
                    }
        except Exception:
            pass
        return None

    @staticmethod
    def _generate_daily_workout(exercises_by_type, experience_level, workout_types):
        """Generate a single day's workout."""
        daily_exercises = []
        exercises_per_type = 3 if experience_level == 'advanced' else 2

        for workout_type in workout_types:
            if workout_type in exercises_by_type:
                type_exercises = exercises_by_type[workout_type]
                # Take a subset of exercises for this type
                for exercise in type_exercises[:exercises_per_type]:
                    if exercise:  # Only add valid exercises
                        daily_exercises.append({
                            'type': workout_type,
                            **exercise
                        })

        return daily_exercises
