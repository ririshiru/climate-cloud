import React from 'react';
import { useAppContext } from '../Context/AppContext';

const ChallengeCard = ({ data, index, onStartProject }) => {
  const { theme } = useAppContext();

  const cardClass = `p-6 rounded-xl shadow-lg border transition duration-300 
                     ${theme === 'dark' ? 'bg-[#282136] border-[#583C79] text-white' : 'bg-white border-gray-200 text-gray-800'}
                     hover:shadow-xl hover:scale-[1.01]`;

  const sdgColor = theme === 'dark' ? 'text-primary' : 'text-[#80609F]';

  // Helper to format SDGs which come as integers [4, 13] -> "SDG 4, SDG 13"
  const formatSDGs = (sdgs) => {
    if (!sdgs || !Array.isArray(sdgs)) return 'N/A';
    return sdgs.map(s => `SDG ${s}`).join(', ');
  };

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold mb-2">
          {index + 1}. {data.title}
        </h3>
        <button
          onClick={() => onStartProject(data)}
          className="ml-4 px-4 py-2 bg-[#80609F] text-white text-sm font-semibold rounded-lg hover:bg-[#6A4D85] transition duration-150 dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF]"
        >
          Start Project
        </button>
      </div>

      <p className="text-sm mb-3 dark:text-gray-300 leading-relaxed">{data.description}</p>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className={`text-xs font-bold ${sdgColor}`}>Target SDGs:</span> 
        <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {formatSDGs(data.sdgs)}
        </span>
      </div>
    </div>
  );
};

export default ChallengeCard;