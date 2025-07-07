from ..models.user_profile import UserProfile, db

class FitnessProfileAgent:
    @staticmethod
    def create_profile(profile_data):
        """Create a new user fitness profile."""
        try:
            profile = UserProfile.from_dict(profile_data)
            db.session.add(profile)
            db.session.commit()
            return profile.to_dict()
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def get_profile(profile_id):
        """Retrieve a user's fitness profile."""
        profile = UserProfile.query.filter_by(uuid=profile_id).first()
        return profile.to_dict() if profile else None

    @staticmethod
    def update_profile(profile_id, profile_data):
        """Update an existing user fitness profile."""
        try:
            profile = UserProfile.query.filter_by(uuid=profile_id).first()
            if not profile:
                return None

            key_map = {
                'fitnessGoal': 'fitness_goal',
                'workoutTypes': 'workout_types',
                'experienceLevel': 'experience_level'
            }

            for key, value in profile_data.items():
                db_key = key_map.get(key, key)
                if hasattr(profile, db_key):
                    setattr(profile, db_key, value)

            db.session.commit()
            return profile.to_dict()
        except Exception as e:
            db.session.rollback()
            raise e
