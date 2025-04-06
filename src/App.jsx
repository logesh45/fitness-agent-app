import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserProfileForm from './components/UserProfile/UserProfileForm';
import FitnessOptionsPage from './components/FitnessOptions';
import FitnessProfileSetup from './components/ProfileSetup/ProfileSetup';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/profile" element={<FitnessProfileSetup />} />
          <Route path="/dashboard" element={
            <div className="border-b border-gray-200 mb-3">
              <div className="flex justify-center mb-3">
                <button 
                  className={`py-2 px-4 ${activeTab === 0 ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded`}
                  onClick={() => handleTabChange(null, 0)}
                >
                  User Profile
                </button>
                <button 
                  className={`py-2 px-4 ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded`}
                  onClick={() => handleTabChange(null, 1)}
                >
                  Fitness Options
                </button>
              </div>
            </div>
          } />
          <Route path="/dashboard/user-profile" element={<UserProfileForm />} />
          <Route path="/dashboard/fitness-options" element={<FitnessOptionsPage />} />
          <Route path="/" element={<Navigate to="/profile" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
