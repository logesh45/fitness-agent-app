import { useState, useEffect } from 'react';
import axios from 'axios';

const FitnessOptionsSelector = ({ onSelectionChange }) => {
  const [options, setOptions] = useState({
    fitness_goals: [],
    equipment_options: [],
    workout_types: [],
    experience_levels: []
  });
  
  const [selectedOptions, setSelectedOptions] = useState({
    fitness_goals: [],
    equipment_options: [],
    workout_types: [],
    experience_level: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - change this to match your backend server
  const API_BASE_URL = 'http://localhost:5002/api';

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        console.log('Fetching fitness options from:', `${API_BASE_URL}/fitness-options`);
        const response = await axios.get(`${API_BASE_URL}/fitness-options`);
        console.log('Received options:', response.data);
        setOptions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fitness options:', err);
        // Use mock data if API fails
        setOptions({
          fitness_goals: [
            { id: 'lose_weight', name: 'Lose Weight' },
            { id: 'build_muscle', name: 'Build Muscle' },
            { id: 'improve_endurance', name: 'Improve Endurance' },
            { id: 'general_fitness', name: 'General Fitness' }
          ],
          equipment_options: [
            { id: 'dumbbells', name: 'Dumbbells' },
            { id: 'resistance_bands', name: 'Resistance Bands' },
            { id: 'yoga_mat', name: 'Yoga Mat' },
            { id: 'treadmill', name: 'Treadmill' }
          ],
          workout_types: [
            { id: 'strength_training', name: 'Strength Training' },
            { id: 'hiit', name: 'HIIT' },
            { id: 'cardio', name: 'Cardio' },
            { id: 'yoga', name: 'Yoga' }
          ],
          experience_levels: [
            { id: 'beginner', name: 'Beginner' },
            { id: 'intermediate', name: 'Intermediate' },
            { id: 'advanced', name: 'Advanced' }
          ]
        });
        setError(`Failed to load fitness options: ${err.message}`);
        setLoading(false);
      }
    };

    fetchOptions();
  }, [API_BASE_URL]);

  useEffect(() => {
    // Notify parent component when selections change
    if (onSelectionChange) {
      onSelectionChange(selectedOptions);
    }
  }, [selectedOptions, onSelectionChange]);

  const toggleOption = (category, item) => {
    if (category === 'experience_level') {
      // For experience level, we only allow one selection
      setSelectedOptions(prev => ({
        ...prev,
        experience_level: item.id
      }));
    } else {
      // For other categories, we allow multiple selections
      setSelectedOptions(prev => {
        const currentSelections = [...prev[category]];
        const index = currentSelections.indexOf(item.id);
        
        if (index === -1) {
          // Add item if not already selected
          return {
            ...prev,
            [category]: [...currentSelections, item.id]
          };
        } else {
          // Remove item if already selected
          currentSelections.splice(index, 1);
          return {
            ...prev,
            [category]: currentSelections
          };
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Fitness Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">What's your fitness goal?</h2>
        <div className="flex flex-wrap gap-3">
          {options.fitness_goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleOption('fitness_goals', goal)}
              className={`
                relative px-4 py-2 rounded-full transition-all duration-300 ease-in-out
                ${selectedOptions.fitness_goals.includes(goal.id) 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
              `}
            >
              <span>{goal.name}</span>
              {selectedOptions.fitness_goals.includes(goal.id) && (
                <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div>
        <h2 className="text-xl font-semibold mb-4">What equipment do you have?</h2>
        <div className="flex flex-wrap gap-3">
          {options.equipment_options.map((equipment) => (
            <button
              key={equipment.id}
              onClick={() => toggleOption('equipment_options', equipment)}
              className={`
                relative px-4 py-2 rounded-full transition-all duration-300 ease-in-out
                ${selectedOptions.equipment_options.includes(equipment.id) 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
              `}
            >
              <span>{equipment.name}</span>
              {selectedOptions.equipment_options.includes(equipment.id) && (
                <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Types */}
      <div>
        <h2 className="text-xl font-semibold mb-4">What workout types do you prefer?</h2>
        <div className="flex flex-wrap gap-3">
          {options.workout_types.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleOption('workout_types', type)}
              className={`
                relative px-4 py-2 rounded-full transition-all duration-300 ease-in-out
                ${selectedOptions.workout_types.includes(type.id) 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
              `}
            >
              <span>{type.name}</span>
              {selectedOptions.workout_types.includes(type.id) && (
                <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h2 className="text-xl font-semibold mb-4">What's your experience level?</h2>
        <div className="flex flex-wrap gap-3">
          {options.experience_levels.map((level) => (
            <button
              key={level.id}
              onClick={() => toggleOption('experience_level', level)}
              className={`
                relative px-4 py-2 rounded-full transition-all duration-300 ease-in-out
                ${selectedOptions.experience_level === level.id 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
              `}
            >
              <span>{level.name}</span>
              {selectedOptions.experience_level === level.id && (
                <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FitnessOptionsSelector;
