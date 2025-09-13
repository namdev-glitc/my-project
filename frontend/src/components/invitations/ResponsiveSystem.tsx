import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Sun, Moon, Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const updateActualTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setActualTheme(systemTheme);
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();
    localStorage.setItem('theme', theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateActualTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', actualTheme === 'dark');
  }, [actualTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Device Detection Hook
export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return { deviceType, screenSize };
};

// Responsive Container
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}> = ({ 
  children, 
  className = '', 
  maxWidth = 'xl',
  padding = 'md'
}) => {
  const { deviceType } = useDeviceDetection();

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-xl';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-2';
      case 'md': return 'p-4';
      case 'lg': return 'p-6';
      case 'xl': return 'p-8';
      default: return 'p-4';
    }
  };

  const getResponsivePadding = () => {
    switch (deviceType) {
      case 'mobile':
        return 'px-4 py-2';
      case 'tablet':
        return 'px-6 py-4';
      case 'desktop':
        return 'px-8 py-6';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <div className={`
      mx-auto w-full
      ${getMaxWidthClass()}
      ${getResponsivePadding()}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Responsive Grid
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: { mobile: number; tablet: number; desktop: number };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}) => {
  const getGapClass = () => {
    switch (gap) {
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      case 'xl': return 'gap-8';
      default: return 'gap-4';
    }
  };

  return (
    <div className={`
      grid
      grid-cols-${cols.mobile}
      md:grid-cols-${cols.tablet}
      lg:grid-cols-${cols.desktop}
      ${getGapClass()}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Theme Toggle Component
export const ThemeToggle: React.FC<{
  className?: string;
  showLabel?: boolean;
}> = ({ className = '', showLabel = true }) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      case 'system':
        return <Monitor size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Sáng';
      case 'dark':
        return 'Tối';
      case 'system':
        return 'Hệ thống';
      default:
        return 'Sáng';
    }
  };

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg
        bg-gray-100 dark:bg-gray-800
        text-gray-700 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-all duration-200
        ${className}
      `}
    >
      {getIcon()}
      {showLabel && <span className="text-sm font-medium">{getLabel()}</span>}
    </button>
  );
};

// Device Indicator Component
export const DeviceIndicator: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { deviceType } = useDeviceDetection();

  const getIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone size={16} />;
      case 'tablet':
        return <Tablet size={16} />;
      case 'desktop':
        return <Laptop size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const getLabel = () => {
    switch (deviceType) {
      case 'mobile':
        return 'Mobile';
      case 'tablet':
        return 'Tablet';
      case 'desktop':
        return 'Desktop';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`
      flex items-center space-x-2 px-3 py-2 rounded-lg
      bg-blue-100 dark:bg-blue-900
      text-blue-700 dark:text-blue-300
      ${className}
    `}>
      {getIcon()}
      <span className="text-sm font-medium">{getLabel()}</span>
    </div>
  );
};

// Responsive Text Component
export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  className?: string;
}> = ({ 
  children, 
  mobile = 'text-sm',
  tablet = 'text-base',
  desktop = 'text-lg',
  className = ''
}) => {
  return (
    <div className={`
      ${mobile}
      md:${tablet}
      lg:${desktop}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Responsive Image Component
export const ResponsiveImage: React.FC<{
  src: string;
  alt: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  className?: string;
}> = ({ 
  src, 
  alt, 
  mobile = 'w-full h-32',
  tablet = 'w-full h-48',
  desktop = 'w-full h-64',
  className = ''
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`
        object-cover rounded-lg
        ${mobile}
        md:${tablet}
        lg:${desktop}
        ${className}
      `}
    />
  );
};

// Accessibility Features
export const AccessibilityFeatures: React.FC<{
  children: React.ReactNode;
  skipToContent?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
}> = ({ 
  children, 
  skipToContent = true,
  highContrast = false,
  reducedMotion = false
}) => {
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [highContrast, reducedMotion]);

  return (
    <>
      {skipToContent && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded-lg z-50"
        >
          Bỏ qua đến nội dung chính
        </a>
      )}
      <div id="main-content">
        {children}
      </div>
    </>
  );
};

// Performance Optimized Component
export const PerformanceOptimized: React.FC<{
  children: React.ReactNode;
  lazy?: boolean;
  threshold?: number;
  className?: string;
}> = ({ 
  children, 
  lazy = true,
  threshold = 0.1,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(!lazy);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [lazy, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible && children}
    </div>
  );
};

export default {
  ThemeProvider,
  useTheme,
  useDeviceDetection,
  ResponsiveContainer,
  ResponsiveGrid,
  ThemeToggle,
  DeviceIndicator,
  ResponsiveText,
  ResponsiveImage,
  AccessibilityFeatures,
  PerformanceOptimized
};
