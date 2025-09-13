import React, { useEffect, useRef } from 'react';

interface AnimationSystemProps {
  children: React.ReactNode;
  type?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'bounce' | 'confetti';
  delay?: number;
  duration?: number;
  trigger?: boolean;
  onComplete?: () => void;
}

const AnimationSystem: React.FC<AnimationSystemProps> = ({
  children,
  type = 'fadeIn',
  delay = 0,
  duration = 500,
  trigger = true,
  onComplete
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !elementRef.current) return;

    const element = elementRef.current;
    
    // Reset animation
    element.style.animation = 'none';
    // Trigger reflow
    void element.offsetHeight;
    
    // Apply animation
    const animationClass = getAnimationClass(type);
    element.classList.add(animationClass);
    
    // Set duration
    element.style.animationDuration = `${duration}ms`;
    element.style.animationDelay = `${delay}ms`;
    
    // Handle completion
    const handleAnimationEnd = () => {
      element.classList.remove(animationClass);
      onComplete?.();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
    
    return () => {
      element.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [trigger, type, delay, duration, onComplete]);

  const getAnimationClass = (animationType: string) => {
    switch (animationType) {
      case 'fadeIn':
        return 'animate-fade-in';
      case 'slideUp':
        return 'animate-slide-up';
      case 'scaleIn':
        return 'animate-scale-in';
      case 'bounce':
        return 'animate-bounce-in';
      case 'confetti':
        return 'animate-confetti';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div ref={elementRef} className="animation-container">
      {children}
    </div>
  );
};

// Sound Effects Hook
export const useSoundEffects = () => {
  const playSound = (soundType: 'click' | 'success' | 'error' | 'notification' | 'confetti') => {
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const frequencies = {
      click: [800, 1000],
      success: [523, 659, 784], // C-E-G chord
      error: [200, 150],
      notification: [440, 554, 659], // A-C#-E chord
      confetti: [523, 659, 784, 1047] // C-E-G-C chord
    };
    
    const duration = soundType === 'confetti' ? 0.5 : 0.2;
    const frequenciesToPlay = frequencies[soundType];
    
    frequenciesToPlay.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(audioContext.currentTime + duration + index * 0.1);
    });
  };

  return { playSound };
};

// Confetti Animation Component
export const ConfettiAnimation: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({
  trigger,
  onComplete
}) => {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !confettiRef.current) return;

    const confetti = confettiRef.current;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.width = '10px';
      piece.style.height = '10px';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = Math.random() * 100 + '%';
      piece.style.top = '-10px';
      piece.style.borderRadius = '50%';
      piece.style.pointerEvents = 'none';
      piece.style.zIndex = '1000';
      
      confetti.appendChild(piece);
      
      // Animate confetti
      const animation = piece.animate([
        { 
          transform: 'translateY(0px) rotate(0deg)',
          opacity: 1
        },
        { 
          transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
          opacity: 0
        }
      ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
      
      animation.onfinish = () => {
        piece.remove();
      };
    }
    
    // Clean up after animation
    setTimeout(() => {
      onComplete?.();
    }, 5000);
  }, [trigger, onComplete]);

  return <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />;
};

// Hover Effects Hook
export const useHoverEffects = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: `transition-all duration-300 ${isHovered ? 'scale-105 shadow-lg' : ''}`
  };
  
  return { isHovered, hoverProps };
};

// Loading Animation Component
export const LoadingAnimation: React.FC<{ 
  isLoading: boolean; 
  message?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'wave';
}> = ({ 
  isLoading, 
  message = 'Đang tải...', 
  type = 'spinner' 
}) => {
  if (!isLoading) return null;

  const getLoadingElement = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        );
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      case 'pulse':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        );
      case 'wave':
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        );
      default:
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl">
        {getLoadingElement()}
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default AnimationSystem;
