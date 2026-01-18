import React, { useEffect, useState, useRef } from 'react';
import { captureFrame } from '../utils/faceLogic';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  currentName: string;
  setName: (name: string) => void;
  onCapture: () => void;
  onCancel: () => void;
  onBatchComplete: (images: string[], name: string) => void;
}

export const TrainingStage: React.FC<Props> = ({ videoRef, stream, currentName, setName, onCapture, onCancel, onBatchComplete }) => {
  const [batchImages, setBatchImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startCapturing = (e: React.SyntheticEvent) => {
    // Prevent default touch actions like scroll
    if (e.type === 'touchstart') {
      // e.preventDefault(); 
    }

    if (!currentName.trim() || !videoRef.current) return;

    // If we already have batch images, we are in "Batch Mode", so any press adds to it.
    if (batchImages.length > 0) {
      setIsCapturing(true);
      // Immediate capture for responsiveness
      const frame = captureFrame(videoRef.current);
      if (frame) setBatchImages(prev => [...prev, frame]);

      intervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const newFrame = captureFrame(videoRef.current);
          if (newFrame) setBatchImages(prev => [...prev, newFrame]);
        }
      }, 200);
      return;
    }

    // Otherwise, we wait to see if it's a hold or a click
    timeoutRef.current = setTimeout(() => {
      setIsCapturing(true);
      // Start batch mode logic
      const frame = captureFrame(videoRef.current!);
      if (frame) setBatchImages(prev => [...prev, frame]);

      intervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const newFrame = captureFrame(videoRef.current);
          if (newFrame) setBatchImages(prev => [...prev, newFrame]);
        }
      }, 200);
    }, 500); // 500ms threshold for "Hold"
  };

  const stopCapturing = () => {
    if (!currentName.trim()) return;
    // Clear the hold timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Stop interval if it was running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isCapturing) {
      // We were in hold mode, just stop
      setIsCapturing(false);
    } else {
      // We never entered hold mode, so it was a CLICK.
      // But only if we aren't already in batch mode (handled in startCapturing early exit)
      // Actually, if batchImages.length > 0, we did early exit in startCapturing setting isCapturing=true.
      // So this 'else' block only hit if batchImages.length === 0 AND we released before 500ms.
      if (batchImages.length === 0) {
        onCapture();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
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
          <span className="text-cyan-500 text-[10px] font-bold uppercase mb-1 block tracking-widest">การลงทะเบียนผู้ใช้</span>
          <h2 className="text-2xl font-bold mb-2 text-white">ลงทะเบียนใบหน้าใหม่</h2>
          <p className="text-slate-400 text-xs">ป้อนชื่อบุคคลสำหรับฐานข้อมูล</p>
        </div>

        <input
          type="text"
          placeholder="ระบุชื่อบุคคล..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 text-white mb-6 placeholder-slate-500 transition-colors"
          value={currentName}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onMouseDown={startCapturing}
          onMouseUp={stopCapturing}
          onMouseLeave={stopCapturing}
          onTouchStart={startCapturing}
          onTouchEnd={stopCapturing}
          disabled={!currentName.trim()}
          className={`relative w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 select-none active:scale-95 ${currentName.trim()
            ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl'
            : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
            }`}
        >
          {batchImages.length > 0 ? (
            <span>Hold to add more ({batchImages.length})</span>
          ) : (
            <span>Hold to Train / Click to Capture</span>
          )}

          {isCapturing && (
            <div className="absolute inset-0 rounded-3xl border-2 border-white/50 animate-ping"></div>
          )}
        </button>

        {batchImages.length > 0 && (
          <button
            onClick={() => onBatchComplete(batchImages, currentName)}
            className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-wide transition-all shadow-lg animate-pulse"
          >
            Save {batchImages.length} Images
          </button>
        )}

        <button onClick={onCancel} className="w-full mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          ยกเลิกและกลับสู่รายการ
        </button>
      </div>
    </div>
  );
};