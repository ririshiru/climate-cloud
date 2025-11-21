import React from 'react';
import { useAppContext } from '../Context/AppContext';

const Loading = () => {
  const { theme } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 animate-fadeIn">
      <div className="relative w-16 h-16">
        <div className={`absolute w-full h-full border-4 rounded-full border-t-transparent animate-spin ${theme === 'dark' ? 'border-primary' : 'border-[#80609F]'}`}></div>
        <div className={`absolute w-full h-full border-4 rounded-full opacity-20 ${theme === 'dark' ? 'border-white' : 'border-gray-300'}`}></div>
      </div>
      <p className={`text-lg font-medium animate-pulse ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        Analyzing data...
      </p>
    </div>
  );
};

export default Loading;