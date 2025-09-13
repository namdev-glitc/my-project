import React from 'react';

// Color System
export const colorSystem = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  }
};

// Typography System
export const typographySystem = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['Fira Code', 'monospace'],
    display: ['Poppins', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  }
};

// Spacing System
export const spacingSystem = {
  space: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem',    // 256px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: '0 0 #0000',
  }
};

// Icon System
export const iconSystem = {
  size: {
    xs: 12,
    sm: 16,
    base: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  variants: {
    filled: 'fill-current',
    outlined: 'stroke-current fill-none',
    twoTone: 'stroke-current fill-current',
  }
};

// Component Variants
export const componentVariants = {
  button: {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    error: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  },
  card: {
    elevated: 'bg-white shadow-lg border border-gray-200',
    flat: 'bg-white border border-gray-200',
    outlined: 'bg-transparent border border-gray-300',
    filled: 'bg-gray-50 border border-gray-200',
  },
  input: {
    default: 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
    error: 'border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200',
    success: 'border border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200',
  }
};

// Typography Components
export const Typography: React.FC<{
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'inherit';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
}> = ({ 
  variant, 
  children, 
  className = '', 
  color = 'inherit',
  weight = 'normal',
  align = 'left'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return 'text-6xl font-bold leading-tight';
      case 'h2':
        return 'text-5xl font-bold leading-tight';
      case 'h3':
        return 'text-4xl font-semibold leading-snug';
      case 'h4':
        return 'text-3xl font-semibold leading-snug';
      case 'h5':
        return 'text-2xl font-medium leading-normal';
      case 'h6':
        return 'text-xl font-medium leading-normal';
      case 'body1':
        return 'text-base leading-relaxed';
      case 'body2':
        return 'text-sm leading-relaxed';
      case 'caption':
        return 'text-xs leading-tight';
      case 'overline':
        return 'text-xs font-medium uppercase tracking-wider';
      default:
        return 'text-base leading-relaxed';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return 'text-blue-600';
      case 'secondary':
        return 'text-gray-600';
      case 'accent':
        return 'text-purple-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'inherit':
        return 'text-inherit';
      default:
        return 'text-gray-900';
    }
  };

  const getWeightStyles = () => {
    switch (weight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return 'font-normal';
    }
  };

  const getAlignStyles = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return 'text-left';
    }
  };

  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

  return (
    <Component 
      className={`
        ${getVariantStyles()}
        ${getColorStyles()}
        ${getWeightStyles()}
        ${getAlignStyles()}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

// Spacing Component
export const Spacer: React.FC<{
  size: keyof typeof spacingSystem.space;
  axis?: 'x' | 'y' | 'both';
}> = ({ size, axis = 'y' }) => {
  const space = spacingSystem.space[size];
  
  const getStyles = () => {
    switch (axis) {
      case 'x':
        return { width: space, height: '1px' };
      case 'y':
        return { width: '1px', height: space };
      case 'both':
        return { width: space, height: space };
      default:
        return { width: '1px', height: space };
    }
  };

  return <div style={getStyles()} />;
};

// Color Palette Component
export const ColorPalette: React.FC<{
  colors: string[];
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}> = ({ colors, onColorSelect, selectedColor }) => {
  return (
    <div className="flex space-x-2">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => onColorSelect(color)}
          className={`
            w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110
            ${selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'}
          `}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default {
  colorSystem,
  typographySystem,
  spacingSystem,
  iconSystem,
  componentVariants,
  Typography,
  Spacer,
  ColorPalette
};
