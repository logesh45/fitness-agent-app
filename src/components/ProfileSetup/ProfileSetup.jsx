import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const ProfileSetup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [selections, setSelections] = useState({
        goals: [],
        equipment: [],
        workout: null,
        level: null,
    });
    const [options, setOptions] = useState({
        fitness_goals: [],
        equipment_options: [],
        workout_types: [],
        experience_levels: [],
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchOptions = useCallback(async () => {
        if (!age || age <= 0) {
            setError("Please enter a valid age.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5002/api/options', {
                age: parseInt(age),
                selections: [], // Always fetch a fresh set of options
            });
            setOptions(response.data);
            // Reset selections when new options are fetched
            setSelections({ goals: [], equipment: [], workout: null, level: null });
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching fitness options.');
        } finally {
            setIsLoading(false);
        }
    }, [age]);

    const handleSelect = useCallback((option, category) => {
        setSelections(prev => {
            const newSelections = { ...prev };
            if (category === 'level' || category === 'workout') {
                newSelections[category] = prev[category] === option.id ? null : option.id;
            } else {
                const current = prev[category];
                if (current.includes(option.id)) {
                    newSelections[category] = current.filter(id => id !== option.id);
                } else {
                    newSelections[category] = [...current, option.id];
                }
            }
            return newSelections;
        });
    }, []);

    const handleSubmit = async () => {
        const validationErrors = [];
        if (selections.goals.length < 1) validationErrors.push('Select at least 1 fitness goal.');
        if (!selections.workout) validationErrors.push('Select a workout type.');
        if (!selections.level) validationErrors.push('Select an experience level.');

        if (validationErrors.length > 0) {
            setError(validationErrors.join(' '));
            return;
        }
        
        setIsLoading(true);
        setError(null);

        try {
            const profileData = {
                name,
                age: parseInt(age),
                fitnessGoal: options.fitness_goals.find(o => o.id === selections.goals[0])?.name || '',
                equipment: options.equipment_options.filter(o => selections.equipment.includes(o.id)).map(o => o.name),
                workoutTypes: [options.workout_types.find(o => o.id === selections.workout)?.name].filter(Boolean),
                experienceLevel: options.experience_levels.find(o => o.id === selections.level)?.name || '',
            };

            // Step 1: Create Profile
            const profileResponse = await axios.post('http://localhost:5002/api/profile', profileData);
            const { session_token, profile } = profileResponse.data;

            if (!session_token) {
                throw new Error('Failed to create profile session.');
            }

            localStorage.setItem('sessionToken', session_token);
            localStorage.setItem('profile', JSON.stringify(profile));

            // Step 2: Generate Workout Plan
            const workoutResponse = await axios.post(`http://localhost:5002/api/profiles/${session_token}/workout-plan`);
            localStorage.setItem('workoutPlan', JSON.stringify(workoutResponse.data));
            
            // Step 3: Navigate to dashboard
            navigate('/dashboard');

        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const OptionChip = ({ option, isSelected, onSelect, category }) => {
        const [isHovered, setIsHovered] = useState(false);
        const popoverContent = [
            option.description,
            option.age_specific_notes && `Notes for age ${age}: ${option.age_specific_notes}`,
            option.safety_considerations && `Safety: ${option.safety_considerations}`,
            option.intensity_recommendation && `Intensity: ${option.intensity_recommendation}`,
            option.progression_timeline && `Progression: ${option.progression_timeline}`,
        ].filter(Boolean).join('\n\n');

        return (
            <motion.div
                className="relative"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <button
                    onClick={() => onSelect(option, category)}
                    className={`px-4 py-2 rounded-full transition-colors duration-300 font-medium text-sm m-1 whitespace-nowrap ${isSelected
                        ? 'bg-blue-600 text-white border-2 border-blue-600/50 shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:scale-105'} truncate`}
                >
                    {option.name}
                </button>
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full mb-2 w-72 p-3 bg-white text-gray-800 text-sm rounded-lg shadow-xl border border-gray-200 z-50"
                            style={{ left: '50%', transform: 'translateX(-50%)', whiteSpace: 'pre-wrap' }}
                        >
                            {popoverContent}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    const OptionsSection = ({ title, options, selection, onSelect, category, selectionRule }) => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-sm text-gray-500 mb-4">{selectionRule}</p>
            <div className="flex flex-wrap p-4 rounded-lg bg-gray-200/50 min-h-[60px] items-start -m-1">
                {options && options.length > 0 ? options.map(option => (
                    <OptionChip
                        key={option.id}
                        option={option}
                        isSelected={category === 'level' || category === 'workout' ? selection === option.id : selection.includes(option.id)}
                        onSelect={onSelect}
                        category={category}
                    />
                )) : <p className="text-gray-500 p-1">Please enter your age and fetch options.</p>}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10 pb-10">
            <div className="w-full max-w-3xl px-4">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
                    Fitness Profile Setup
                </h1>

                {/* Name and Age Inputs */}
                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-600 text-sm font-bold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="age" className="block text-gray-600 text-sm font-bold mb-2">
                        Age
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                            placeholder="Enter your age to get options"
                            className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
                        />
                        <button
                            onClick={handleFetchOptions}
                            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
                            disabled={!age || age <= 0 || isLoading}
                            aria-label="Fetch options"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Sections for options */}
                <OptionsSection
                    title="Fitness Goals"
                    options={options.fitness_goals}
                    selection={selections.goals}
                    onSelect={handleSelect}
                    category="goals"
                    selectionRule="Select at least 1"
                />
                <OptionsSection
                    title="Equipment Options"
                    options={options.equipment_options}
                    selection={selections.equipment}
                    onSelect={handleSelect}
                    category="equipment"
                    selectionRule="Select any equipment you have. (Optional)"
                />
                <OptionsSection
                    title="Workout Type"
                    options={options.workout_types}
                    selection={selections.workout}
                    onSelect={handleSelect}
                    category="workout"
                    selectionRule="Select 1"
                />
                <OptionsSection
                    title="Experience Level"
                    options={options.experience_levels}
                    selection={selections.level}
                    onSelect={handleSelect}
                    category="level"
                    selectionRule="Select 1"
                />

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Your Plan...
                        </>
                    ) : (
                        'Create My Plan'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProfileSetup;
