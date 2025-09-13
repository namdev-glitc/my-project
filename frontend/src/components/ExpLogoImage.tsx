import React from 'react';

interface ExpLogoImageProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const ExpLogoImage: React.FC<ExpLogoImageProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-12 h-12',  // 48x48px (nhỏ hơn)
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Logo Image - Full size */}
      <div className={`${sizeClasses[size]} relative`}>
        <img 
          src="/logo.png" 
          alt="EXP Technology Logo" 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
  );
};

export default ExpLogoImage;
