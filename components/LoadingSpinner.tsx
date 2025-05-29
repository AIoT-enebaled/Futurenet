
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  color?: 'purple' | 'pink' | 'cyan' | 'white'; // Added color prop
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message, color = 'purple' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2', // Adjusted for smaller size
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-[5px]',
  };

  const colorClasses = {
    purple: 'border-brand-purple',
    pink: 'border-brand-pink',
    cyan: 'border-brand-cyan',
    white: 'border-white',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-live="polite"
        aria-label={message || "Loading"}
      ></div>
      {message && <p className="text-sm text-brand-text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;