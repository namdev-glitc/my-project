import React from 'react';

interface ExpLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const ExpLogo: React.FC<ExpLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Circle */}
      <div className={`${sizeClasses[size]} bg-black border-2 border-white rounded-full flex items-center justify-center shadow-lg`}>
        <span className="text-white font-bold">EXP</span>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} text-white font-bold tracking-widest`}>
            TECHNO LOGY
          </h1>
        </div>
      )}
    </div>
  );
};

export default ExpLogo;
