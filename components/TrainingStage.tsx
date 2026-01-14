import React, { useEffect } from 'react';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  currentName: string;
  setName: (name: string) => void;
  onCapture: () => void;
  onCancel: () => void;
}

export const TrainingStage: React.FC<Props> = ({ videoRef, stream, currentName, setName, onCapture, onCancel }) => {
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className="p-8 lg:p-12 grid md:grid-cols-2 gap-10 items-center flex-grow h-full">
      {/* Video Feed */}
      <div className="relative aspect-square bg-black rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover scale-x-[-1]" 
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[70%] h-[70%] border-2 border-white/20 border-dashed rounded-full animate-pulse"></div>
          <div className="absolute top-4 right-4 flex gap-1">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
             <span className="text-[10px] text-red-500 font-bold uppercase">REC</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div>
        <div className="mb-6">
          <span className="text-cyan-500 text-[10px] font-bold uppercase mb-1 block tracking-widest">User Registration</span>
          <h2 className="text-2xl font-bold mb-2 text-white">Register New Face</h2>
          <p className="text-slate-400 text-xs">Enter the name of the subject for the database.</p>
        </div>
        
        <input 
          type="text" 
          placeholder="Enter Subject Name..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 text-white mb-6 placeholder-slate-500 transition-colors"
          value={currentName}
          onChange={(e) => setName(e.target.value)}
        />

        <button 
          onClick={onCapture}
          disabled={!currentName.trim()}
          className={`w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
            currentName.trim() ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl hover:-translate-y-1' : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
          }`}
        >
          CAPTURE FACE
        </button>
        
        <button onClick={onCancel} className="w-full mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          Cancel and Return to List
        </button>
      </div>
    </div>
  );
};