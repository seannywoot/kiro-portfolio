import React from 'react';

interface CropIndicatorProps {
  isVisible: boolean;
}

const CropIndicator: React.FC<CropIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5 flex items-center justify-center">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M15 3H21V9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 21H3V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3L14 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 21L10 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default CropIndicator;