import React, { useEffect } from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { ScanResult, ScanStatus } from '../types';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  capturedImage: string | null;
  scanStatus: ScanStatus;
  result: ScanResult | 'mismatch' | null;
  onScan: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const TestingStage: React.FC<Props> = ({ 
  videoRef, 
  stream,
  capturedImage, 
  scanStatus, 
  result, 
  onScan, 
  onNext, 
  onBack 
}) => {
  const isScanning = scanStatus === 'scanning';
  const isResult = scanStatus === 'match' || scanStatus === 'mismatch';

  useEffect(() => {
    if (videoRef.current && stream && !capturedImage) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef, capturedImage]);

  return (
    <div className="p-8 lg:p-12 text-center flex flex-col flex-grow h-full">
      <h2 className="text-2xl font-black mb-8 uppercase tracking-widest flex items-center justify-center gap-3 text-white">
        <Search className="text-cyan-400" /> Identity Search
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-8 flex-grow">
        {/* Scanner Frame */}
        <div className="w-full max-w-sm aspect-square rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-black relative">
          
          {/* Viewport content */}
          {capturedImage ? (
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          )}
          
          {/* Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
              <div className="w-full h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scan-line"></div>
              <div className="absolute top-4 left-4 font-mono text-cyan-400 text-xs">ANALYZING PIXELS...</div>
            </div>
          )}

          {/* Match Result Overlay */}
          {result && typeof result !== 'string' && (
            <div className="absolute inset-0 bg-green-500/60 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-zoom-in">
              <CheckCircle2 size={50} className="text-white mb-2" />
              <h3 className="text-xl font-black text-white uppercase">Identity Confirmed</h3>
              <div className="bg-white/20 px-4 py-1 rounded-full mt-2">
                <p className="text-white font-bold text-lg">{result.name}</p>
              </div>
              <p className="text-white/70 text-[10px] mt-1 font-mono uppercase tracking-widest">Confidence: {result.score.toFixed(1)}%</p>
            </div>
          )}

          {/* Mismatch Result Overlay */}
          {result === 'mismatch' && (
            <div className="absolute inset-0 bg-red-600/60 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-zoom-in">
              <XCircle size={50} className="text-white mb-2" />
              <h3 className="text-xl font-black text-white uppercase">Access Denied</h3>
              <p className="text-white/80 text-sm font-bold">Unknown Subject</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto w-full">
        {!isResult && !isScanning && (
          <button 
            onClick={onScan}
            className="w-full bg-cyan-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-cyan-500 shadow-xl active:scale-95 transition-all uppercase"
          >
            Scan Identity
          </button>
        )}
        
        {isResult && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <p className="text-xs text-slate-400 italic">
              {result === 'mismatch' 
                ? "No matching pixel patterns found in the database above threshold." 
                : `Highest correlation found with subject "${result.name}".`}
            </p>
            <div className="flex gap-2">
              <button onClick={onNext} className="flex-1 bg-white/10 text-white py-4 rounded-2xl text-sm font-bold hover:bg-white/20 transition-colors">
                Scan Next Subject
              </button>
              <button onClick={onBack} className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700 transition-colors">
                Database
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};