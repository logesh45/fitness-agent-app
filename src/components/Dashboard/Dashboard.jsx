import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Reusable Accordion Component
const Accordion = ({ title, children, defaultOpen = false, isRestDay = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const headerClasses = isRestDay
        ? "p-4 cursor-pointer flex justify-between items-center bg-emerald-50 border-b border-emerald-200"
        : "p-4 cursor-pointer flex justify-between items-center bg-gray-50 border-b border-gray-200";
    
    const titleClasses = isRestDay
        ? "text-lg font-semibold text-emerald-800"
        : "text-lg font-semibold text-gray-800";

    const iconColor = isRestDay ? "text-emerald-600" : "text-gray-600";

    return (
        <div className={`mb-4 bg-white rounded-lg shadow-md overflow-hidden border ${isRestDay ? 'border-emerald-200' : 'border-gray-200'}`}>
            <motion.header
                initial={false}
                onClick={() => setIsOpen(!isOpen)}
                className={headerClasses}
            >
                <div className="flex items-center space-x-3">
                    {isRestDay && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10 2a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zM4 10a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zM15 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.636 5.636a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM14.364 14.364a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM14.364 5.636a1 1 0 000 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 0zM5.636 14.364a1 1 0 000 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 0z" />
                        </svg>
                    )}
                    <h2 className={titleClasses}>{title}</h2>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </motion.header>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="px-4 pb-4 bg-white"
                    >
                        {children}
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};

// Exercise Card Component
const ExerciseCard = ({ exercise }) => (
    <div className="bg-gray-100 p-3 rounded-md mb-2 border border-gray-200">
        <h4 className="font-bold text-blue-600">{exercise.name}</h4>
        <p className="text-sm text-gray-600">{exercise.instructions}</p>
        <div className="mt-2 text-xs grid grid-cols-2 gap-1 text-gray-700">
            <span><strong>Sets:</strong> {exercise.sets}</span>
            <span><strong>Reps:</strong> {exercise.reps || 'N/A'}</span>
            <span><strong>Duration:</strong> {exercise.duration || 'N/A'}</span>
            <span><strong>Equipment:</strong> {exercise.equipment.join(', ')}</span>
        </div>
    </div>
);


const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [activeWeekIndex, setActiveWeekIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedProfile = localStorage.getItem('profile');
        const storedPlan = localStorage.getItem('workoutPlan');

        if (!storedProfile || !storedPlan) {
            navigate('/');
        } else {
            const parsedProfile = JSON.parse(storedProfile);
            const parsedPlan = JSON.parse(storedPlan);
            setProfile(parsedProfile);
            setWorkoutPlan(parsedPlan);
            if (!parsedPlan?.plan_data?.weeks?.length) {
                console.error("Workout plan is missing week data.");
                navigate('/');
            }
        }
    }, [navigate]);

    if (!profile || !workoutPlan || !workoutPlan.plan_data.weeks.length) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-800 text-xl">Loading your dashboard...</p>
            </div>
        );
    }

    const activeWeek = workoutPlan.plan_data.weeks[activeWeekIndex];

    const TopNavBar = ({ profile, onNavigate }) => (
    <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Welcome, {profile.name}!</h1>
            <button 
                onClick={onNavigate}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-blue-600 transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Edit Profile</span>
            </button>
        </div>
    </header>
);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <TopNavBar profile={profile} onNavigate={() => navigate('/')} />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-gray-600 mb-6">Here is your personalized workout plan.</p>

                    {/* Week Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                    {workoutPlan.plan_data.weeks.map((week, index) => (
                        <button
                            key={index}
                            className={`py-2 px-6 text-base font-medium transition-colors focus:outline-none -mb-px ${
                                activeWeekIndex === index
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-blue-500 border-b-2 border-transparent'
                            }`}
                            onClick={() => setActiveWeekIndex(index)}
                        >
                            Week {week.week_number}
                        </button>
                    ))}
                </div>

                {/* Days Accordion for the active week */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeWeekIndex}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeWeek.days.map((day, dayIndex) => {
                            const isRestDay = day.exercises.length === 0;
                            return (
                                <Accordion 
                                    key={day.day_number} 
                                    title={`Day ${day.day_number}: ${isRestDay ? 'Rest Day' : day.focus}`} 
                                    defaultOpen={dayIndex === 0}
                                    isRestDay={isRestDay}
                                >
                                    <div className="space-y-2 pt-4">
                                        {isRestDay ? (
                                            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex items-center space-x-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <h4 className="font-bold">Rest Day!</h4>
                                                    <p className="text-sm">Time to recover and grow stronger.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            day.exercises.map((ex, i) => <ExerciseCard key={i} exercise={ex} />)
                                        )}
                                    </div>
                                </Accordion>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
                            </div>
            </main>
        </div>
    );
};

export default Dashboard;
