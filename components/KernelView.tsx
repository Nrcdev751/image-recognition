import React, { useEffect, useState } from 'react';

interface Props {
  imageSrc: string;
}

export const KernelView: React.FC<Props> = ({ imageSrc }) => {
  const [activeKernels, setActiveKernels] = useState<number[]>([]);

  // Defining SVG filters for edge detection
  // We use feConvolveMatrix to simulate basic Sobel/Prewitt-like operators
  // order 3x3

  // NOTE: SVG filters can be tricky. We use grayscale first, then convolution.

  const kernels = [
    { name: 'Vertical Lines', filterId: 'filter-vertical' },
    { name: 'Horizontal Lines', filterId: 'filter-horizontal' },
    { name: 'Diagonal Left', filterId: 'filter-diag-1' },
    { name: 'Diagonal Right', filterId: 'filter-diag-2' },
    { name: 'Edge Enhance', filterId: 'filter-edge' },
    { name: 'Sharpen', filterId: 'filter-sharpen' },
  ];

  useEffect(() => {
    // Staggered animation for kernels appearing
    kernels.forEach((_, index) => {
      setTimeout(() => {
        setActiveKernels(prev => [...prev, index]);
      }, index * 200 + 500);
    });
  }, []);

  return (
    <>
      <svg className="hidden">
        <defs>
          {/* Grayscale helper */}
          <filter id="grayscale">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" result="gray" />
          </filter>

          {/* Vertical Edge (Sobel-ish) */}
          {/* -1 0 1
              -2 0 2
              -1 0 1 */}
          <filter id="filter-vertical">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" result="gray" />
            <feConvolveMatrix order="3,3" kernelMatrix="-1 0 1 -2 0 2 -1 0 1" divisor="1" bias="0.5" in="gray" result="edges" />
          </filter>

          {/* Horizontal Edge */}
          {/*  1  2  1
               0  0  0
              -1 -2 -1  */}
          <filter id="filter-horizontal">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" result="gray" />
            <feConvolveMatrix order="3,3" kernelMatrix="1 2 1 0 0 0 -1 -2 -1" divisor="1" bias="0.5" in="gray" result="edges" />
          </filter>

          {/* Diagonal 1 (Top-Left to Bottom-Right) */}
          <filter id="filter-diag-1">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" result="gray" />
            <feConvolveMatrix order="3,3" kernelMatrix="2 -1 -1 -1 2 -1 -1 -1 2" divisor="1" bias="0.5" in="gray" result="edges" />
          </filter>

          {/* Diagonal 2 (Top-Right to Bottom-Left) */}
          <filter id="filter-diag-2">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" result="gray" />
            <feConvolveMatrix order="3,3" kernelMatrix="-1 -1 2 -1 2 -1 2 -1 -1" divisor="1" bias="0.5" in="gray" result="edges" />
          </filter>

          {/* Generic Edge */}
          <filter id="filter-edge">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" result="gray" />
            <feConvolveMatrix order="3,3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" bias="0.5" in="gray" result="edges" />
          </filter>

          {/* Sharpen */}
          <filter id="filter-sharpen">
            <feConvolveMatrix order="3,3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" divisor="1" in="SourceGraphic" result="edges" />
          </filter>

        </defs>
      </svg>

      <div className="grid grid-cols-3 gap-2 w-full max-w-[300px] aspect-square p-2 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
        {kernels.map((kernel, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded bg-black transition-all duration-500 ease-out transform ${activeKernels.includes(index) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
          >
            <div className="w-full h-full relative">
              {/* We render the image with the specific SVG filter ID applied */}
              <img
                src={imageSrc}
                alt={kernel.name}
                className="w-full h-full object-cover"
                style={{ filter: `url(#${kernel.filterId})` }}
              />
            </div>

            {/* Overlay label */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center text-cyan-400 font-mono py-0.5 opacity-0 hover:opacity-100 transition-opacity">
              {kernel.name}
            </div>

            {/* Scanline Animation */}
            {activeKernels.includes(index) && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-full w-full animate-scan" style={{ animationDuration: `${Math.random() * 2 + 1}s` }}></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
