
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center my-12 p-6 bg-white rounded-xl shadow-md border border-gray-200">
    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-lg font-semibold text-gray-700 text-center transition-opacity duration-500">
      {message}
    </p>
  </div>
);

export default LoadingIndicator;
