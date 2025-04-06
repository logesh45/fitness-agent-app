import { useState } from 'react';
import axios from 'axios';
import WorkoutPlan from '../WorkoutPlan/WorkoutPlan';

const EQUIPMENT_OPTIONS = [
  'Dumbbells',
  'Barbell',
  'Resistance Bands',
  'Pull-up Bar',
  'Bench',
  'Kettlebell',
  'None (Bodyweight only)'
];

const FITNESS_GOALS = [
  'Build Muscle',
  'Lose Weight',
  'Improve Endurance',
  'Increase Strength',
  'General Fitness'
];

const WORKOUT_TYPES = [
  'Strength Training',
  'HIIT',
  'Calisthenics',
  'Circuit Training',
  'Cardio'
];

const API_BASE_URL = 'http://localhost:5002/api';

const UserProfileForm = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    fitness_goal: '',
    equipment: [],
    workout_types: [],
    experience_level: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [profileId, setProfileId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/profile`, profile);
      setProfileId(response.data.id);
      setSuccess(true);
      setError('');
      setProfile(response.data.profile);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={profile.age}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="18"
            max="99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fitness Goals</label>
          <select
            id="fitness_goal"
            name="fitness_goal"
            value={profile.fitness_goal}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select a goal</option>
            {FITNESS_GOALS.map((goal) => (
              <option key={goal} value={goal.toLowerCase().replace(' ', '_')}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Available Equipment</label>
          <div className="mt-2 space-y-2">
            {EQUIPMENT_OPTIONS.map((item) => (
              <div key={item} className="flex items-center">
                <input
                  id={item}
                  name="equipment"
                  type="checkbox"
                  value={item.toLowerCase().replace(' ', '_')}
                  checked={profile.equipment.includes(item.toLowerCase().replace(' ', '_'))}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleArrayChange('equipment', 
                      profile.equipment.includes(value)
                        ? profile.equipment.filter(e => e !== value)
                        : [...profile.equipment, value]
                    );
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={item} className="ml-3 block text-sm font-medium text-gray-700">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Workout Types</label>
          <div className="mt-2 space-y-2">
            {WORKOUT_TYPES.map((item) => (
              <div key={item} className="flex items-center">
                <input
                  id={item}
                  name="workout_types"
                  type="checkbox"
                  value={item.toLowerCase().replace(' ', '_')}
                  checked={profile.workout_types.includes(item.toLowerCase().replace(' ', '_'))}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleArrayChange('workout_types', 
                      profile.workout_types.includes(value)
                        ? profile.workout_types.filter(e => e !== value)
                        : [...profile.workout_types, value]
                    );
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={item} className="ml-3 block text-sm font-medium text-gray-700">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">Experience Level</label>
          <select
            id="experience_level"
            name="experience_level"
            value={profile.experience_level}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select your level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Profile
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          Profile created successfully!
        </div>
      )}

      {profileId && <WorkoutPlan profileId={profileId} />}
    </div>
  );
};

export default UserProfileForm;
