import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Debounce utility function
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [fitnessGoals, setFitnessGoals] = useState([]);
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    const [workoutTypes, setWorkoutTypes] = useState([]);
    const [experienceLevels, setExperienceLevels] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [isEditingAge, setIsEditingAge] = useState(false);
    const [isNameEntered, setIsNameEntered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    // Debounce selections for API calls
    const debouncedSelections = useDebounce(selectedOptions, 3000);

    // Handle name submit
    const handleNameSubmit = () => {
        if (name.trim()) {
            setIsNameEntered(true);
        }
    };

    // Handle age change
    const handleAgeChange = (e) => {
        setAge(e.target.value);
        setIsEditingAge(true);
    };

    // Handle continue button click
    const handleContinue = async () => {
        if (!age || isNaN(age) || age < 0) {
            setError('Please enter a valid age');
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5002/api/fitness-options?age=${age}`);
            setFitnessGoals(response.data.fitness_goals);
            setEquipmentOptions(response.data.equipment_options);
            setWorkoutTypes(response.data.workout_types);
            setExperienceLevels(response.data.experience_levels);
            setShowOptions(true);
            setIsEditingAge(false);
        } catch (err) {
            setError('Failed to fetch fitness options. Please try again.');
            console.error('Error fetching options:', err);
        } finally {
            setLoading(false);
        }
    };

    // Effect for handling selection changes
    useEffect(() => {
        const fetchOptions = async () => {
            if (!showOptions || !age) return;
            
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams({
                    age: age
                });

                if (debouncedSelections.length > 0) {
                    const selectedOptionsData = debouncedSelections.map(id => {
                        const option = fitnessGoals.find(opt => opt.id === id) ||
                                     equipmentOptions.find(opt => opt.id === id) ||
                                     workoutTypes.find(opt => opt.id === id) ||
                                     experienceLevels.find(opt => opt.id === id);
                        if (option) {
                            let type = '';
                            if (fitnessGoals.find(opt => opt.id === id)) type = 'goal';
                            else if (equipmentOptions.find(opt => opt.id === id)) type = 'equipment';
                            else if (workoutTypes.find(opt => opt.id === id)) type = 'workout';
                            else if (experienceLevels.find(opt => opt.id === id)) type = 'level';

                            return {
                                id: option.id,
                                name: option.name,
                                type: type
                            };
                        }
                        return null;
                    }).filter(Boolean);

                    queryParams.append('selections', JSON.stringify(selectedOptionsData));
                }
                
                const response = await axios.get(`http://localhost:5002/api/fitness-options?${queryParams}`);
                
                setFitnessGoals(response.data.fitness_goals);
                setEquipmentOptions(response.data.equipment_options);
                setWorkoutTypes(response.data.workout_types);
                setExperienceLevels(response.data.experience_levels);
            } catch (err) {
                setError('Failed to fetch fitness options. Please try again.');
                console.error('Error fetching options:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [debouncedSelections, showOptions]);

    // Selection Handler
    const handleOptionSelect = useCallback(
        (optionId, optionType) => {
            setSelectedOptions((prevSelectedOptions) => {
                if (prevSelectedOptions.includes(optionId)) {
                    return prevSelectedOptions.filter((id) => id !== optionId);
                } else {
                    // For experience levels, remove any previously selected level
                    if (optionType === 'level') {
                        const newSelections = prevSelectedOptions.filter(id => {
                            const option = fitnessGoals.find(opt => opt.id === id) ||
                                         equipmentOptions.find(opt => opt.id === id) ||
                                         workoutTypes.find(opt => opt.id === id) ||
                                         experienceLevels.find(opt => opt.id === id);
                            return option?.type !== 'level';
                        });
                        return [...newSelections, optionId];
                    }
                    return [...prevSelectedOptions, optionId];
                }
            });
        },
        [fitnessGoals, equipmentOptions, workoutTypes, experienceLevels]
    );

    // Handle form submission
    const handleSubmit = async () => {
        if (!name || !age || selectedOptions.length < 3) {
            setError('Please fill in all the required fields and select at least 3 options.');
            return;
        }

        try {
            const profileData = {
                name,
                age: parseInt(age),
                selectedOptions: selectedOptions.map(id => {
                    const option = fitnessGoals.find(opt => opt.id === id) ||
                                 equipmentOptions.find(opt => opt.id === id) ||
                                 workoutTypes.find(opt => opt.id === id) ||
                                 experienceLevels.find(opt => opt.id === id);
                    return {
                        id: option.id,
                        name: option.name,
                        type: option.type
                    };
                })
            };

            const response = await axios.post('http://localhost:5002/api/profile', profileData);
            console.log('Profile created:', response.data);
            
            if (response.data.session_token) {
                sessionStorage.setItem('sessionToken', response.data.session_token);
                sessionStorage.setItem('profile', JSON.stringify(response.data.profile));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error creating profile. Please try again.');
        }
    };

    const getChipStyle = (optionId, optionType) => {
        const isSelected = selectedOptions.includes(optionId);
        const isExperienceLevel = optionType === 'level';
        
        // Base styles
        const baseStyles = "px-4 py-2 rounded-full transition-colors duration-300 font-medium text-sm m-1 whitespace-nowrap";
        
        // Selected styles
        const selectedStyles = "bg-orange-500 text-white border-2 border-orange-500/50 shadow-lg";
        
        // Unselected styles for experience levels (disabled if another level is selected)
        const unselectedLevelStyles = selectedOptions.some(id => {
            const option = experienceLevels.find(opt => opt.id === id);
            return option && id !== optionId;
        }) && isExperienceLevel
            ? "bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed"
            : "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105";
        
        // Unselected styles for other options
        const unselectedStyles = "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105";
        
        return `${baseStyles} ${isSelected ? selectedStyles : (isExperienceLevel ? unselectedLevelStyles : unselectedStyles)} truncate`;
    };

    const renderOptions = (options, title) => (
        <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
            <div className="flex flex-wrap">
                {options.map((option) => (
                    <motion.button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id, option.type)}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileTap={{ scale: 0.95 }}
                        className={getChipStyle(option.id, option.type)}
                    >
                        {option.name}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-start pt-10 pb-10">
            <div className="w-full max-w-2xl px-4">
                <motion.h1 
                    className="text-3xl font-semibold text-white mb-6 text-center"
                    animate={{ 
                        fontSize: showOptions ? '1.5rem' : '1.875rem',
                        marginBottom: showOptions ? '1rem' : '1.5rem'
                    }}
                    transition={{ duration: 0.5 }}
                >
                    Fitness Profile Setup
                </motion.h1>

                <motion.div 
                    className="flex flex-col items-center"
                    animate={{ 
                        marginBottom: showOptions ? '2rem' : '0',
                        alignItems: showOptions ? 'flex-start' : 'center'
                    }}
                    transition={{ duration: 0.5 }}
                >
                    {!isNameEntered ? (
                        <motion.div 
                            className="mb-6 w-full max-w-md"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2 text-white">
                                What's your name?
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                                    placeholder="Enter your name"
                                    className="flex-1 px-4 py-3 rounded-l-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleNameSubmit}
                                    className="px-4 py-3 rounded-r-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className={`flex flex-wrap gap-4 items-center ${showOptions ? 'w-full' : 'justify-center'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div 
                                className="text-white text-xl font-semibold"
                                animate={{ 
                                    fontSize: showOptions ? '1rem' : '1.25rem',
                                }}
                            >
                                Hi, {name}!
                            </motion.div>
                            <motion.div className="flex items-center gap-4">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={handleAgeChange}
                                        placeholder="Age"
                                        className="w-24 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                                    />
                                </div>
                                {(isEditingAge || !showOptions) && (
                                    <motion.button
                                        onClick={handleContinue}
                                        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        Continue
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.button>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>

                {error && (
                    <motion.div 
                        className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {loading && (
                    <div className="flex justify-center items-center w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                )}

                {showOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {renderOptions(fitnessGoals, 'Fitness Goals')}
                        {renderOptions(equipmentOptions, 'Equipment Options')}
                        {renderOptions(workoutTypes, 'Workout Types')}
                        {renderOptions(experienceLevels, 'Experience Levels')}

                        <motion.button
                            onClick={handleSubmit}
                            className="w-full py-3 rounded-full bg-orange-500 text-white font-semibold transition-colors duration-300 hover:bg-orange-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Create Profile
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProfileSetup;
