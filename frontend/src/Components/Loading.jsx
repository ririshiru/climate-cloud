import React from 'react';

const Loading = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center p-8'>
      <div className='loader flex items-center gap-1.5 my-4'> 
          <div className='w-2 h-2 rounded-full bg-gray-500 dark:bg-primary animate-bounce' style={{ animationDelay: '0s' }}></div>
          <div className='w-2 h-2 rounded-full bg-gray-500 dark:bg-primary animate-bounce' style={{ animationDelay: '0.2s' }}></div>
          <div className='w-2 h-2 rounded-full bg-gray-500 dark:bg-primary animate-bounce' style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">
        Analyzing profile and retrieving challenges...
      </p>
    </div>
  );
};

export default Loading;