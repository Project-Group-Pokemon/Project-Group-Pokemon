import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-200">404 - Page Not Found</h1>
      <button
        onClick={() => navigate('/')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
