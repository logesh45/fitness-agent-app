from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    fitness_goal = db.Column(db.String(50), nullable=False)
    equipment = db.Column(db.JSON, nullable=False)  # Store as JSON array
    workout_types = db.Column(db.JSON, nullable=False)  # Store as JSON array
    experience_level = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'fitness_goal': self.fitness_goal,
            'equipment': self.equipment,
            'workout_types': self.workout_types,
            'experience_level': self.experience_level,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return UserProfile(
            name=data['name'],
            age=data['age'],
            fitness_goal=data['fitnessGoal'],
            equipment=data['equipment'],
            workout_types=data['workoutTypes'],
            experience_level=data['experienceLevel']
        )
