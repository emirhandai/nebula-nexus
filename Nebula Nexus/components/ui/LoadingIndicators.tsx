import React from 'react';

// Default loading component
export default function LoadingIndicators() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
      <div className="text-cyan-400 text-lg font-medium">Yükleniyor...</div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
}

// Named exports for specific loading components
export const Spinner = ({ size = 'md', color = 'cyan' }: { size?: 'sm' | 'md' | 'lg'; color?: 'cyan' | 'blue' | 'purple' | 'green' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    cyan: 'border-cyan-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-700 border-t-${colorClasses[color]} rounded-full animate-spin`} />
  );
};

export const Dots = ({ count = 3, delay = 200 }: { count?: number; delay?: number }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * delay}ms`,
            animationDuration: `${delay * 2}ms`
          }}
        />
      ))}
    </div>
  );
};

export const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}: { 
  width?: string; 
  height?: string; 
  className?: string;
}) => {
  return (
    <div className={`${width} ${height} bg-gray-700 rounded animate-pulse ${className}`} />
  );
};

export const Progress = ({ 
  progress, 
  total, 
  showPercentage = true 
}: { 
  progress: number; 
  total: number; 
  showPercentage?: boolean;
}) => {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <div className="w-full">
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-400 mt-1 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}; 