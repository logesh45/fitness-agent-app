from datetime import datetime
from ..models.user_profile import db

class WorkoutPlan(db.Model):
    __tablename__ = 'workout_plans'

    id = db.Column(db.Integer, primary_key=True)
    user_profile_id = db.Column(db.String(36), db.ForeignKey('user_profiles.uuid'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)
    plan_data = db.Column(db.JSON, nullable=False)  # Store the complete 3-week plan
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_profile_id': self.user_profile_id,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'plan_data': self.plan_data,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
