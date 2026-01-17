import React, { useMemo } from 'react';

interface Props {
  imageSrc: string;
}

export const SlidingWindowImage: React.FC<Props> = ({ imageSrc }) => {
  // Generate a fixed grid of random pixel values (0-255)
  const pixelGrid = useMemo(() => {
    return Array.from({ length: 100 }).map(() => Math.floor(Math.random() * 255));
  }, []);

  return (
    <div className="relative w-full max-w-[300px] aspect-square rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black group">
      <img
        src={imageSrc}
        alt="Source"
        className="w-full h-full object-cover opacity-60"
      />

      {/* Pixel Value Grid Overlay */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none">
        {pixelGrid.map((val, i) => (
          <div key={i} className="flex items-center justify-center border border-white/5">
            <span className="text-[8px] font-mono text-cyan-200/40 select-none">
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNIDAgMjAgTCAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-30 pointer-events-none" />

      {/* Sliding Window Box - CSS Animation Once */}
      <div className="absolute top-0 left-0 w-1/4 h-1/4 animate-slide-scan-once pointer-events-none">
        <div className="w-full h-full border-2 border-cyan-400 bg-cyan-400/10 backdrop-contrast-125 shadow-[0_0_15px_rgba(34,211,238,0.5)] relative">
          {/* Crosshairs */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-400/50"></div>
          <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-400/50"></div>

          {/* Kernel Weights */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 place-items-center">
            <span className="text-[6px] text-cyan-200 font-bold">-1</span>
            <span className="text-[6px] text-cyan-200 font-bold">0</span>
            <span className="text-[6px] text-cyan-200 font-bold">1</span>
            <span className="text-[6px] text-cyan-200 font-bold">-2</span>
            <span className="text-[6px] text-cyan-200 font-bold">0</span>
            <span className="text-[6px] text-cyan-200 font-bold">2</span>
            <span className="text-[6px] text-cyan-200 font-bold">-1</span>
            <span className="text-[6px] text-cyan-200 font-bold">0</span>
            <span className="text-[6px] text-cyan-200 font-bold">1</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/50 px-2 py-1 rounded">
        SOURCE_IMAGE_MATRIX
      </div>
    </div>
  );
};
