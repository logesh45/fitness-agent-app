import { useState } from 'react';
import FitnessOptionsSelector from './FitnessOptionsSelector';

const FitnessOptionsPage = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleSelectionChange = (options) => {
    setSelectedOptions(options);
    console.log('Selected options:', options);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Your Fitness Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Select your preferences to get a personalized workout plan
          </p>
          
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <FitnessOptionsSelector onSelectionChange={handleSelectionChange} />
        </div>

        {/* Debug panel to show selected options */}
        {Object.keys(selectedOptions).length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Options:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(selectedOptions, null, 2)}
            </pre>
          </div>
        )}
      </div>
    
  );
};

export default FitnessOptionsPage;
