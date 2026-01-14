import React from 'react';
import { Users } from 'lucide-react';

interface Props {
  onStart: () => void;
  error: string | null;
}

export const WelcomeStage: React.FC<Props> = ({ onStart, error }) => {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center flex-grow h-full min-h-[400px]">
      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-lg group">
        <Users size={40} className="text-white group-hover:scale-110 transition-transform" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-white">Group Recognition System</h2>
      <p className="text-slate-400 mb-10 max-w-md text-sm">
        Register multiple faces into the neural database to test if the AI can correctly identify and distinguish between them.
      </p>
      
      {error && (
        <div className="mb-6 text-red-400 bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20 text-xs">
          {error}
        </div>
      )}

      <button 
        onClick={onStart}
        className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold hover:bg-cyan-400 hover:scale-105 transition-all shadow-lg active:scale-95"
      >
        Initialize Camera
      </button>
    </div>
  );
};