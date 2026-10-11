import React, { useEffect, useRef, useState } from 'react';

interface PortraitCanvasProps {
  src: string;
  alt: string;
  className?: string;
}

export const PortraitCanvas: React.FC<PortraitCanvasProps> = ({
  src,
  alt,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (isCancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // High-res retina canvas
      const targetSize = 600;
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Fill pure white backdrop
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);

      // Frame the subject nicely: scale to 1.18x and position so his head and lanyard fit the circle
      const scale = 1.18;
      const drawWidth = targetSize * scale;
      const drawHeight = targetSize * scale;
      const drawX = (targetSize - drawWidth) / 2;
      const drawY = (targetSize - drawHeight) / 2 - 8;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      try {
        const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
        const data = imgData.data;
        const width = targetSize;
        const height = targetSize;

        // 4x4 Bayer matrix for ordered stipple dithering
        const bayer = [
          [ 0,  8,  2, 10],
          [12,  4, 14,  6],
          [ 3, 11,  1,  9],
          [15,  7, 13,  5]
        ];

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Clean background noise: if pixel is nearly white/neutral, enforce crisp pure white
            if (r > 238 && g > 238 && b > 238) {
              data[idx] = 255;
              data[idx + 1] = 255;
              data[idx + 2] = 255;
              continue;
            }

            // Bayer threshold (-0.5 to +0.5)
            const threshold = (bayer[y % 4][x % 4] / 16 - 0.5) * 24;

            // Apply subtle stipple modulation to preserve natural skin tones while adding texture
            const newR = Math.min(255, Math.max(0, r + threshold));
            const newG = Math.min(255, Math.max(0, g + threshold));
            const newB = Math.min(255, Math.max(0, b + threshold));

            data[idx] = newR;
            data[idx + 1] = newG;
            data[idx + 2] = newB;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsLoaded(true);
      } catch {
        setIsLoaded(true);
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [src]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-white ${className}`}>
      {/* Crisp fallback image while canvas initializes */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover object-[center_12%] scale-110 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* Dithered Portrait Canvas */}
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className={`w-full h-full object-cover select-none transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Tactile Halftone Screen & Stipple Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full ring-1 ring-black/15 mix-blend-multiply opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.7) 0.85px, transparent 0.85px)',
          backgroundSize: '2.8px 2.8px',
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default PortraitCanvas;
