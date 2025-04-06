import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

export default function WorkoutPlan({ profileId, profile }) {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkoutPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/workout-plan`, profile);
      setWorkoutPlan(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch workout plan');
    } finally {
      setLoading(false);
    }
  };

  const generateWorkoutPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/profiles/${profileId}/workout-plan`);
      setWorkoutPlan(response.data);
      setError(null);
    } catch (error) {
      setError('Error generating workout plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchWorkoutPlan();
    }
  }, [profileId]);

  const renderWorkoutPlan = () => {
    if (!workoutPlan) return null;

    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold">Your 3-Week Workout Plan</h2>
        </div>

        <div className="text-gray-600">
          {new Date(workoutPlan.start_date).toLocaleDateString()} - {new Date(workoutPlan.end_date).toLocaleDateString()}
        </div>

        {workoutPlan.plan_data.weeks.map((week, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">Week {week.week_number}</h3>
            
            <div className="space-y-4">
              {week.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-medium mb-1">Day {day.day_number}</h4>
                  <div className="space-y-4">
                    {day.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="border-l-4 border-indigo-500 pl-4">
                        <h4 className="font-medium mb-1">{exercise.name}</h4>
                        <div className="mt-2 flex justify-between text-sm text-gray-600">
                          {exercise.sets && exercise.reps 
                            ? <span>Sets: {exercise.sets}, Reps: {exercise.reps}</span>
                            : exercise.duration 
                              ? <span>Duration: {exercise.duration}</span>
                              : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={generateWorkoutPlan}
        >
          Generate New Plan
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {workoutPlan && renderWorkoutPlan()}
    </div>
  );
}
