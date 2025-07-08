
import React from 'react';

interface NumberBallProps {
  number: number;
  isNew?: boolean;
  isExtracting?: boolean;
  delay?: number;
  size?: 'normal' | 'large' | 'huge';
}

export const NumberBall: React.FC<NumberBallProps> = ({ 
  number, 
  isNew = false, 
  isExtracting = false,
  delay = 0,
  size = 'normal'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'huge':
        return 'w-48 h-48 text-8xl';
      case 'large':
        return 'w-40 h-40 text-7xl';
      default:
        return 'w-36 h-36 text-7xl';
    }
  };

  return (
    <div
      className={`
        ${getSizeClasses()} rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all duration-500 border-4
        ${isExtracting 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-300 animate-bounce scale-125' 
          : isNew 
            ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-400 animate-pulse scale-110' 
            : 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400'
        }
      `}
      style={{
        animationDelay: `${delay}ms`
      }}
    >
      {number}
    </div>
  );
};
