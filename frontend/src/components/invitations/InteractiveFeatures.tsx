import React, { useState, useRef, useEffect } from 'react';
import { Heart, Star, Sparkles, Zap, Gift, Trophy, Award, Crown, Users, Calendar, MapPin, Clock } from 'lucide-react';

// 3D Card Flip Component
export const Card3DFlip: React.FC<{
  children: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}> = ({ children, backContent, isFlipped, onFlip, className = '' }) => {
  return (
    <div 
      className={`relative w-full h-full perspective-1000 ${className}`}
      onClick={onFlip}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          {children}
        </div>
        
        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  );
};

// Interactive Button with Sound & Animation
export const InteractiveButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  soundEffect?: boolean;
  animation?: 'bounce' | 'pulse' | 'shake' | 'glow' | 'scale';
  className?: string;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  soundEffect = true,
  animation = 'bounce',
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const playSound = () => {
    if (!soundEffect) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handleClick = () => {
    if (disabled) return;
    
    playSound();
    setIsAnimating(true);
    onClick();
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getAnimationStyles = () => {
    if (!isAnimating) return '';
    
    switch (animation) {
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'shake':
        return 'animate-shake';
      case 'glow':
        return 'animate-glow';
      case 'scale':
        return 'animate-scale-in';
      default:
        return 'animate-bounce';
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-200
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getAnimationStyles()}
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Ripple Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-white/20 scale-0 rounded-full transition-transform duration-300 hover:scale-100" />
      </div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>
    </button>
  );
};

// Particle System Component
export const ParticleSystem: React.FC<{
  particleCount?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  className?: string;
}> = ({ 
  particleCount = 50, 
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
  speed = 1,
  size = 4,
  className = ''
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * size + 2
      });
    }
    setParticles(newParticles);
  }, [particleCount, colors, speed, size]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + 100) % 100,
        y: (particle.y + particle.vy + 100) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-60 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.001 + particle.id) * 0.3})`
          }}
        />
      ))}
    </div>
  );
};

// Interactive Card with Hover Effects
export const InteractiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'tilt' | 'scale' | 'rotate';
  onClick?: () => void;
}> = ({ 
  children, 
  className = '', 
  hoverEffect = 'lift',
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  const getHoverEffectStyles = () => {
    if (!isHovered) return '';
    
    switch (hoverEffect) {
      case 'lift':
        return 'transform translate-y-[-8px] shadow-2xl';
      case 'glow':
        return 'shadow-2xl ring-2 ring-blue-500/50';
      case 'tilt':
        return `transform rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg)`;
      case 'scale':
        return 'transform scale-105';
      case 'rotate':
        return 'transform rotate-2';
      default:
        return 'transform translate-y-[-8px] shadow-2xl';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative transition-all duration-300 cursor-pointer
        ${getHoverEffectStyles()}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Confetti Button
export const ConfettiButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    setShowConfetti(true);
    onClick();
    
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          relative overflow-hidden px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
          text-white rounded-lg font-medium transition-all duration-200
          hover:from-purple-600 hover:to-pink-600 hover:scale-105
          ${className}
        `}
      >
        {children}
      </button>
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

// Interactive Icon with Animation
export const InteractiveIcon: React.FC<{
  icon: React.ComponentType<any>;
  size?: number;
  color?: string;
  hoverColor?: string;
  animation?: 'bounce' | 'pulse' | 'spin' | 'wiggle' | 'scale';
  onClick?: () => void;
  className?: string;
}> = ({ 
  icon: Icon, 
  size = 24, 
  color = 'currentColor',
  hoverColor = color,
  animation,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getAnimationClass = () => {
    if (!isHovered) return '';
    
    switch (animation) {
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'spin':
        return 'animate-spin';
      case 'wiggle':
        return 'animate-wiggle';
      case 'scale':
        return 'animate-scale-in';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        transition-all duration-200 cursor-pointer
        ${onClick ? 'hover:scale-110' : ''}
        ${getAnimationClass()}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Icon 
        size={size} 
        color={isHovered ? hoverColor : color}
        className="transition-colors duration-200"
      />
    </div>
  );
};

export default {
  Card3DFlip,
  InteractiveButton,
  ParticleSystem,
  InteractiveCard,
  ConfettiButton,
  InteractiveIcon
};
