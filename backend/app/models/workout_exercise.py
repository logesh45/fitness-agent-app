from pydantic import BaseModel, Field
from typing import List, Optional

class Exercise(BaseModel):
    """A single exercise in a workout plan"""
    name: str = Field(description="Name of the exercise")
    type: str = Field(description="Type of exercise (e.g., Strength Training, HIIT, Cardio)")
    sets: Optional[int] = Field(description="Number of sets to perform", default=3)
    reps: Optional[str] = Field(description="Number of repetitions per set (e.g., '10-12', '15')")
    duration: Optional[str] = Field(description="Duration of the exercise (for timed exercises)")
    instructions: Optional[str] = Field(description="Instructions on how to perform the exercise")
    equipment: List[str] = Field(description="Equipment needed for this exercise")

class DailyWorkout(BaseModel):
    """A daily workout consisting of multiple exercises"""
    day_number: int = Field(description="Day number in the week")
    focus: str = Field(description="Main focus of this workout (e.g., 'Upper Body', 'Cardio')")
    exercises: List[Exercise] = Field(description="List of exercises for this day")

class WeeklyWorkout(BaseModel):
    """A weekly workout plan consisting of multiple daily workouts"""
    week_number: int = Field(description="Week number in the plan")
    days: List[DailyWorkout] = Field(description="List of daily workouts for this week")

class WorkoutPlanData(BaseModel):
    """Complete workout plan data structure"""
    weeks: List[WeeklyWorkout] = Field(description="List of weekly workouts in the plan")
