import React, { useEffect, useState } from 'react';
import { Cpu, ArrowRight } from 'lucide-react';
import { KernelView } from './KernelView';
import { SlidingWindowImage } from './SlidingWindowImage';

interface Props {
  currentName: string;
  imageData: string | null;
  onComplete: () => void;
}

export const ProcessingStage: React.FC<Props> = ({ currentName, imageData, onComplete }) => {
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
    <div className="flex flex-col items-center justify-center flex-grow w-full max-w-6xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="text-center mb-8">
        <Cpu className="animate-spin text-cyan-400 mb-4 mx-auto duration-[3s]" size={40} />
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Feature Extraction</h2>
        <p className="text-slate-400 text-sm mt-2">Convolving <b>{currentName}</b>'s facial topography...</p>
      </div>

      {/* Main Visualization Area */}
      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 w-full mb-8">

        {/* Step 1: Source + Sliding Window */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Input Layer</div>
          {imageData ? (
            <SlidingWindowImage imageSrc={imageData} />
          ) : (
            <div className="w-[300px] h-[300px] bg-slate-800 rounded-xl animate-pulse" />
          )}
        </div>

        {/* Arrow Flow */}
        <div className="hidden xl:flex flex-col items-center justify-center text-cyan-500 opacity-50">
          <ArrowRight size={32} className="animate-pulse" />
          <span className="text-[10px] font-mono mt-1">CONV2D</span>
        </div>

        {/* Step 2: Feature Maps */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Feature Maps (ReLU)</div>
          {imageData ? (
            <KernelView imageSrc={imageData} />
          ) : (
            <div className="w-[300px] h-[300px] bg-slate-800 rounded-xl animate-pulse" />
          )}
        </div>

      </div>

      {/* Controls & Progress */}
      <div className="w-full max-w-lg bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
        <div className="flex justify-between text-[10px] uppercase font-bold text-cyan-400 mb-2">
          <span>Total Progress</span>
          <span>{Math.min(100, Math.floor(progress))}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-cyan-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        {progress >= 100 && (
          <button
            onClick={onComplete}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 shadow-lg animate-pulse"
          >
            Confirm Extraction
          </button>
        )}
      </div>

    </div>
  );
};