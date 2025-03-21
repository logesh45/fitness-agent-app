"""
Utility module for providing fitness options for user selection.
"""

# Predefined fitness goals with descriptions
FITNESS_GOALS = [
    {
        "id": "lose_weight",
        "name": "Lose Weight",
        "description": "Focus on calorie burning and fat loss through a mix of cardio and strength training.",
        "icon": "scale-down"
    },
    {
        "id": "build_muscle",
        "name": "Build Muscle",
        "description": "Emphasize resistance training with progressive overload to increase muscle mass.",
        "icon": "dumbbell"
    },
    {
        "id": "improve_endurance",
        "name": "Improve Endurance",
        "description": "Develop cardiovascular fitness and stamina through sustained activity.",
        "icon": "heart-pulse"
    },
    {
        "id": "increase_flexibility",
        "name": "Increase Flexibility",
        "description": "Enhance range of motion and prevent injury through stretching and mobility work.",
        "icon": "activity"
    },
    {
        "id": "general_fitness",
        "name": "General Fitness",
        "description": "Maintain overall health with a balanced approach to exercise.",
        "icon": "zap"
    },
    {
        "id": "tone_body",
        "name": "Tone Body",
        "description": "Define muscles and improve body composition without significant bulk.",
        "icon": "figure-standing"
    }
]

# Predefined equipment options with descriptions
EQUIPMENT_OPTIONS = [
    {
        "id": "dumbbells",
        "name": "Dumbbells",
        "description": "Versatile weights for strength training exercises.",
        "icon": "dumbbell"
    },
    {
        "id": "resistance_bands",
        "name": "Resistance Bands",
        "description": "Elastic bands that provide tension for strength training.",
        "icon": "circle-dashed"
    },
    {
        "id": "yoga_mat",
        "name": "Yoga Mat",
        "description": "Provides cushioning and grip for floor exercises.",
        "icon": "rectangle-horizontal"
    },
    {
        "id": "treadmill",
        "name": "Treadmill",
        "description": "Machine for walking or running indoors.",
        "icon": "footprints"
    },
    {
        "id": "stationary_bike",
        "name": "Stationary Bike",
        "description": "Indoor cycling equipment for cardio workouts.",
        "icon": "bike"
    },
    {
        "id": "kettlebell",
        "name": "Kettlebell",
        "description": "Weight with a handle for dynamic strength exercises.",
        "icon": "dumbbell"
    },
    {
        "id": "pull_up_bar",
        "name": "Pull-up Bar",
        "description": "Bar for upper body strength exercises.",
        "icon": "arrow-up"
    },
    {
        "id": "jump_rope",
        "name": "Jump Rope",
        "description": "Simple tool for cardio and coordination.",
        "icon": "circle-dashed"
    },
    {
        "id": "bench",
        "name": "Bench",
        "description": "Platform for various strength exercises.",
        "icon": "rectangle-horizontal"
    },
    {
        "id": "foam_roller",
        "name": "Foam Roller",
        "description": "Cylindrical tool for self-massage and myofascial release.",
        "icon": "cylinder"
    }
]

# Predefined workout types with descriptions
WORKOUT_TYPES = [
    {
        "id": "strength_training",
        "name": "Strength Training",
        "description": "Exercises that build muscle strength and endurance using resistance.",
        "icon": "dumbbell"
    },
    {
        "id": "hiit",
        "name": "HIIT",
        "description": "High-Intensity Interval Training alternates between intense bursts and recovery.",
        "icon": "timer"
    },
    {
        "id": "cardio",
        "name": "Cardio",
        "description": "Aerobic exercises that elevate heart rate and improve cardiovascular health.",
        "icon": "heart-pulse"
    },
    {
        "id": "yoga",
        "name": "Yoga",
        "description": "Practice combining physical postures, breathing techniques, and meditation.",
        "icon": "lotus"
    },
    {
        "id": "pilates",
        "name": "Pilates",
        "description": "Low-impact exercises focusing on core strength, posture, and flexibility.",
        "icon": "circle-dot"
    },
    {
        "id": "functional_training",
        "name": "Functional Training",
        "description": "Exercises that train muscles for daily activities and movements.",
        "icon": "activity"
    },
    {
        "id": "crossfit",
        "name": "CrossFit",
        "description": "High-intensity functional movements combining various exercise styles.",
        "icon": "box"
    },
    {
        "id": "calisthenics",
        "name": "Calisthenics",
        "description": "Bodyweight exercises to build strength, endurance, and flexibility.",
        "icon": "user"
    }
]

# Experience levels with descriptions
EXPERIENCE_LEVELS = [
    {
        "id": "beginner",
        "name": "Beginner",
        "description": "New to fitness or returning after a long break.",
        "icon": "baby"
    },
    {
        "id": "intermediate",
        "name": "Intermediate",
        "description": "Regular exerciser with basic knowledge of proper form.",
        "icon": "user"
    },
    {
        "id": "advanced",
        "name": "Advanced",
        "description": "Experienced with consistent training history and good technique.",
        "icon": "trophy"
    }
]

def get_fitness_options():
    """
    Returns all fitness options for user selection.
    
    Returns:
        dict: Dictionary containing fitness goals, equipment options, workout types, and experience levels
    """
    return {
        "fitness_goals": FITNESS_GOALS,
        "equipment_options": EQUIPMENT_OPTIONS,
        "workout_types": WORKOUT_TYPES,
        "experience_levels": EXPERIENCE_LEVELS
    }
