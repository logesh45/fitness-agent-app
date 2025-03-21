# Fitness App Backend

A Flask-based backend for a fitness application that generates personalized workout plans based on user profiles.

## Features

- **User Profile Management**: Create, retrieve, and update user fitness profiles
- **Personalized Workout Plans**: Generate 3-week workout plans tailored to user preferences
- **AI-Powered Recommendations**: Utilize Google Vertex AI for exercise recommendations
- **Structured Data**: Well-defined data models for consistent API responses

## Technology Stack

- **Flask**: Web framework
- **SQLAlchemy**: ORM for database interactions
- **Google Vertex AI**: AI model for generating workout recommendations
- **LangChain**: Framework for structured AI outputs
- **Pydantic**: Data validation and settings management

## Setup and Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up environment variables in a `.env` file:
   ```
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   ```
5. Run the application:
   ```
   python run.py
   ```

## API Endpoints

### User Profiles

- `POST /api/profiles`: Create a new user profile
- `GET /api/profiles/<profile_id>`: Get a user profile by ID
- `PUT /api/profiles/<profile_id>`: Update a user profile

### Workout Plans

- `POST /api/profiles/<profile_id>/workout-plan`: Generate a workout plan for a user
- `GET /api/profiles/<profile_id>/workout-plan`: Get the latest workout plan for a user

## Data Models

### User Profile

```json
{
  "name": "Jane Smith",
  "age": 28,
  "fitnessGoal": "Lose Weight",
  "equipment": ["Dumbbells", "Resistance Bands", "Yoga Mat"],
  "workoutTypes": ["Strength Training", "HIIT", "Cardio"],
  "experienceLevel": "intermediate"
}
```

### Workout Plan

The workout plan is structured with weeks, days, and exercises:

```json
{
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "focus": "Strength Training - Upper Body",
          "exercises": [
            {
              "name": "Dumbbell Bench Press",
              "type": "Strength Training",
              "sets": 3,
              "reps": "10-12",
              "duration": null,
              "instructions": "Lie on your back...",
              "equipment": ["Dumbbells", "Bench"]
            }
          ]
        }
      ]
    }
  ]
}
```

## Testing

Run the test scripts to verify the API functionality:

```
python test_api.py          # Test basic API endpoints
python test_structured_workout.py  # Test structured workout generation
```
