import React, { useState } from 'react';
import { History } from '../types';

interface ControlsProps {
  predefinedHistories: Omit<History, 'id' | 'events'>[];
  onAddHistory: (template: Omit<History, 'id' | 'events'>) => void;
  onCreateNew: () => void;
}

const Controls: React.FC<ControlsProps> = ({ predefinedHistories, onAddHistory, onCreateNew }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
       <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Add History
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            {predefinedHistories.map(history => (
              <a
                key={history.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onAddHistory(history);
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
              >
                {history.name}
              </a>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onCreateNew}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
      >
        Create New History
      </button>
    </div>
  );
};

export default Controls;
