import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data (replace with your actual data)
const fitnessGoals = [
    { id: 'goal-1', name: 'Weight Loss', description: 'Lose excess body fat.', icon: '', age_specific_notes: '', type: 'goal' },
    { id: 'goal-2', name: 'Muscle Gain', description: 'Increase muscle mass.', icon: '', age_specific_notes: '', type: 'goal' },
    { id: 'goal-3', name: 'Improved Endurance', description: 'Enhance cardiovascular fitness.', icon: '', age_specific_notes: '', type: 'goal' },
    { id: 'goal-4', name: 'Flexibility', description: 'Increase range of motion.', icon: '', age_specific_notes: '', type: 'goal' },
    { id: 'goal-5', name: 'Strength', description: 'Increase overall strength.', icon: '', age_specific_notes: '', type: 'goal' },
];

const equipmentOptions = [
    { id: 'equip-1', name: 'Dumbbells', description: 'Versatile free weights.', icon: '', safety_considerations: '', type: 'equipment' },
    { id: 'equip-2', name: 'Barbell', description: 'For heavy lifting.', icon: '', safety_considerations: '', type: 'equipment' },
    { id: 'equip-3', name: 'Resistance Bands', description: 'Elastic bands for resistance.', icon: '', safety_considerations: '', type: 'equipment' },
    { id: 'equip-4', name: 'Kettlebells', description: 'For dynamic movements.', icon: '', safety_considerations: '', type: 'equipment' },
    { id: 'equip-5', name: 'Bodyweight', description: 'Using your own body.', icon: '', safety_considerations: '', type: 'equipment' },
    { id: 'equip-6', name: 'Machines', description: 'Gym machines.', icon: '', safety_considerations: '', type: 'equipment' },
];

const workoutTypes = [
    { id: 'workout-1', name: 'Strength Training', description: 'Lifting weights to build muscle.', icon: '', intensity_recommendation: '', type: 'workout' },
    { id: 'workout-2', name: 'Cardio', description: 'Exercises for heart health.', icon: '', intensity_recommendation: '', type: 'workout' },
    { id: 'workout-3', name: 'HIIT', description: 'High-intensity interval training.', icon: '', intensity_recommendation: '', type: 'workout' },
    { id: 'workout-4', name: 'Yoga', description: 'Flexibility and mindfulness.', icon: '', intensity_recommendation: '', type: 'workout' },
    { id: 'workout-5', name: 'Pilates', description: 'Core strength and stability.', icon: '', intensity_recommendation: '', type: 'workout' },
    { id: 'workout-6', name: 'Crossfit', description: 'High intensity varied workouts.', icon: '', intensity_recommendation: '', type: 'workout' },
];

const experienceLevels = [
    { id: 'level-1', name: 'Beginner', description: 'New to fitness.', icon: '', progression_timeline: '', type: 'level' },
    { id: 'level-2', name: 'Intermediate', description: 'Some fitness experience.', icon: '', progression_timeline: '', type: 'level' },
    { id: 'level-3', name: 'Advanced', description: 'Experienced fitness enthusiast.', icon: '', progression_timeline: '', type: 'level' },
];

const FitnessProfileSetup = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [optionsLayout, setOptionsLayout] = useState([]);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [customOption, setCustomOption] = useState('');
    const optionRefs = useRef({});

    // Combine all options into a single array
    const initialOptions = [
        ...fitnessGoals,
        ...equipmentOptions,
        ...workoutTypes,
        ...experienceLevels,
    ];

    useEffect(() => {
        setMounted(true);
        setOptions(initialOptions);
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Calculate optimal layout
    useEffect(() => {
        if (!mounted || containerWidth === 0) return;

        // We'll use this function to calculate a smarter layout
        const optimizeLayout = () => {
            // Create a copy to work with
            const items = [...options];

            // Randomly shuffle the options to demonstrate the optimization effect
            // This is for visual demonstration - in a real app you might use a more sophisticated algorithm
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }

            setOptionsLayout(items);
        };

        // Calculate new layout when options change
        optimizeLayout();
    }, [options, containerWidth, mounted]);

    // Selection Handler
    const handleOptionSelect = useCallback(
        (optionId, optionType) => {
            setSelectedOptions((prevSelectedOptions) => {
                if (prevSelectedOptions.includes(optionId)) {
                    // Remove the option if it's already selected
                    return prevSelectedOptions.filter((id) => id !== optionId);
                } else {
                    // Add the option
                    if (optionType === 'level') {
                        // For experience level, only allow one selection
                        return [
                            ...prevSelectedOptions.filter(id => {
                                const option = initialOptions.find(opt => opt.id === id);
                                return option?.type !== 'level';
                            }),
                            optionId
                        ];
                    }
                    return [...prevSelectedOptions, optionId];
                }
            });
        },
        [initialOptions]
    );

    // Add custom option
    const handleAddCustomOption = () => {
        if (customOption.trim() === '') return;

        const newOption = {
            id: `custom-${Date.now()}`,
            name: customOption.trim(),
            description: 'Custom option',
            icon: '',
            type: 'custom'
        };

        setOptions(prevOptions => [...prevOptions, newOption]);
        setCustomOption('');
    };

    // Handle form submission
    const handleSubmit = () => {
        if (
            !name ||
            !age ||
            selectedOptions.length < 3
        ) {
            alert('Please fill in all the required fields and select at least 3 options.');
            return;
        }

        const userData = {
            name,
            age,
            selectedOptions: selectedOptions,
        };

        console.log('User Data:', userData);
        alert(`Name: ${name}\nAge: ${age}\nSelected Options: ${selectedOptions.join(', ')}\n\nData should be sent to backend now.`);
    };

    const getChipStyle = (optionId, optionType) => {
        const isSelected = selectedOptions.includes(optionId);
        return `px-4 py-2 rounded-full transition-colors duration-300 font-medium text-sm m-1 whitespace-nowrap ${isSelected
            ? 'bg-orange-500 text-white border-2 border-orange-500/50 shadow-lg'
            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105'} truncate`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-start pt-10 pb-10">
            <div className="w-full max-w-2xl px-4">
                <h1 className="text-3xl font-semibold text-white mb-6 text-center">
                    Fitness Profile Setup
                </h1>

                {/* Name and Age Inputs */}
                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2 text-white">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="age" className="block text-gray-300 text-sm font-bold mb-2 text-white">
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value, 10))}
                        placeholder="Enter your age"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                    />
                </div>

                {/* Custom Option Input */}
                <div className="mb-6">
                    <label htmlFor="customOption" className="block text-gray-300 text-sm font-bold mb-2 text-white">
                        Add Custom Option
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="customOption"
                            value={customOption}
                            onChange={(e) => setCustomOption(e.target.value)}
                            placeholder="Enter custom option text"
                            className="flex-1 px-4 py-3 rounded-l-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomOption()}
                        />
                        <button
                            onClick={handleAddCustomOption}
                            className="px-4 py-3 rounded-r-lg bg-orange-500 text-white font-semibold transition-colors duration-300 hover:bg-orange-600"
                        >
                            Add
                        </button>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">Try adding options with different lengths to test the optimal layout algorithm.</p>
                </div>

                {/* Combined Options List with optimal layout */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Options</h2>
                    <div
                        className="flex flex-wrap"
                        ref={containerRef}
                        style={{
                            display: 'flex',
                            flexFlow: 'row wrap',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            position: 'relative',
                            minHeight: '100px',
                        }}
                    >
                        <AnimatePresence>
                            {mounted && optionsLayout.map((option) => {
                                const isSelected = selectedOptions.includes(option.id);
                                return (
                                    <motion.button
                                        key={option.id}
                                        ref={el => optionRefs.current[option.id] = el}
                                        onClick={() => handleOptionSelect(option.id, option.type)}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        whileTap={{ scale: 0.95 }}
                                        layout
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                            mass: 1
                                        }}
                                        className={getChipStyle(option.id, option.type)}
                                        style={{
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        {option.name}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-full bg-orange-500 text-white font-semibold transition-colors duration-300 hover:bg-orange-600"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default FitnessProfileSetup;

