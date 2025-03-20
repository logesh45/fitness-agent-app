import unittest
from app.utils.search import search_workout_exercises
from app.models.user_profile import UserProfile
from app import create_app, db

class TestSearchWorkoutExercises(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        cls.client = cls.app.test_client()
        with cls.app.app_context():
            db.create_all()
            # Create a mock user profile
            cls.profile = UserProfile(
                name='Test User',
                age=25,
                fitness_goal='Build Muscle',
                equipment=['Dumbbells', 'Bench'],
                workout_types=['Strength Training'],
                experience_level='beginner'
            )
            db.session.add(cls.profile)
            db.session.commit()

    @classmethod
    def tearDownClass(cls):
        with cls.app.app_context():
            db.drop_all()

    def test_search_workout_exercises(self):
        with self.app.app_context():
            # Use the existing profile directly without fetching it again
            exercises = search_workout_exercises(self.profile)
            self.assertIsInstance(exercises, list)  # Check if the result is a list
            self.assertGreater(len(exercises), 0)  # Ensure we get some exercises

if __name__ == '__main__':
    unittest.main()
