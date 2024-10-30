import React from 'react';
import { Wrench } from 'lucide-react';

const DebugPanel = ({ addExp }) => {
  const handleLevelUp = (expAmount) => {
    addExp(expAmount);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-2 mb-2">
        <Wrench className="w-4 h-4" />
        <span className="font-bold text-sm">デバッグパネル</span>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => handleLevelUp(500)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          +1レベル
        </button>
        <button
          onClick={() => handleLevelUp(5000)}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          +5レベル
        </button>
        <button
          onClick={() => handleLevelUp(20000)}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
        >
          +10レベル
        </button>
      </div>
    </div>
  );
};

export default DebugPanel;