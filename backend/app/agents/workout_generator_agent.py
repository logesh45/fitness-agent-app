from datetime import datetime, timedelta
from ..models.workout_plan import WorkoutPlan, db
from ..models.user_profile import UserProfile
from ..utils.search import generate_structured_workout_plan
import json

class WorkoutGeneratorAgent:
    @staticmethod
    def generate_workout_plan(profile_id):
        """Generate a 3-week workout plan based on user profile."""
        profile = UserProfile.query.get(profile_id)
        if not profile:
            raise ValueError("Profile not found")

        # Use the new structured approach to generate a workout plan
        plan_data = generate_structured_workout_plan(profile)

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
