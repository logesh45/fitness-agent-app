"""
Pydantic models for fitness options.
"""
from typing import List
from pydantic import BaseModel, Field

class FitnessOption(BaseModel):
    id: str = Field(..., description="Unique identifier for the option")
    name: str = Field(..., description="Display name")
    description: str = Field(..., description="Detailed description")
    icon: str = Field(..., description="Icon name for UI display")

class FitnessGoal(FitnessOption):
    age_specific_notes: str = Field(..., description="Why this goal is relevant for this age")

class EquipmentOption(FitnessOption):
    safety_considerations: str = Field(..., description="Age-specific safety notes")

class WorkoutType(FitnessOption):
    intensity_recommendation: str = Field(..., description="Age-appropriate intensity guidelines")

class ExperienceLevel(FitnessOption):
    progression_timeline: str = Field(..., description="Expected progression timeframe")

class FitnessOptions(BaseModel):
    fitness_goals: List[FitnessGoal] = Field(..., description="List of fitness goals")
    equipment_options: List[EquipmentOption] = Field(..., description="List of equipment options")
    workout_types: List[WorkoutType] = Field(..., description="List of workout types")
    experience_levels: List[ExperienceLevel] = Field(..., description="List of experience levels")
