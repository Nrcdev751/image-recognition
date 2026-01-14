import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

interface Props {
  currentName: string;
  onComplete: () => void;
}

export const ProcessingStage: React.FC<Props> = ({ currentName, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Randomize speed for "tech" feel
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-12 flex flex-col items-center justify-center flex-grow h-full min-h-[400px]">
      <div className="text-center mb-8">
        <Cpu className="animate-spin text-cyan-400 mb-4 mx-auto duration-[3s]" size={40} />
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Extracting Features</h2>
        <p className="text-slate-400 text-sm mt-2">Encoding facial topography for <b>{currentName}</b>...</p>
      </div>
      
      <div className="w-full max-w-sm bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
        <div className="flex justify-between text-[10px] uppercase font-bold text-cyan-400 mb-2">
          <span>Convolution Progress</span>
          <span>{Math.min(100, Math.floor(progress))}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-cyan-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        {progress >= 100 && (
          <button 
            onClick={onComplete}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 shadow-lg animate-pulse"
          >
            Confirm Save
          </button>
        )}
      </div>
    </div>
  );
};