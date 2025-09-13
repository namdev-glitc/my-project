import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, Crown, Star, Heart, Sparkles, Zap, Gift, Trophy, Award, X } from 'lucide-react';

interface EnhancedInvitationPreviewProps {
  template: any;
  customization: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: number;
    logo: string | null | undefined;
    backgroundPattern: string;
  };
  event?: any;
  guest?: any;
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

const EnhancedInvitationPreview: React.FC<EnhancedInvitationPreviewProps> = ({
  template,
  customization,
  event,
  guest,
  previewMode
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number, color: string}>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 2 + 1,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: (p.y + p.speed) % 100,
        x: p.x + Math.sin(Date.now() * 0.001 + p.id) * 0.5
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPreviewSize = () => {
    switch (previewMode) {
      case 'mobile': return { width: 320, height: 480 };
      case 'tablet': return { width: 480, height: 640 };
      case 'desktop': return { width: 640, height: 800 };
      default: return { width: 480, height: 640 };
    }
  };

  const size = getPreviewSize();

  return (
    <div className="relative">
      {/* Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-30 animate-pulse"
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

      {/* Main Card Container */}
      <div
        ref={cardRef}
        className="relative perspective-1000"
        style={{ width: size.width, height: size.height }}
        onMouseMove={handleMouseMove}
      >
        {/* 3D Card */}
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transform: `rotateY(${isFlipped ? 180 : 0}deg) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateZ(${(mousePosition.x - 0.5) * 5}deg)`
          }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden">
            <div
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}15, ${customization.secondaryColor}25, ${customization.accentColor}15)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${customization.primaryColor}30`
              }}
            >
              {/* Animated Background Pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${customization.primaryColor}40 0%, transparent 50%)`,
                  animation: 'pulse 4s ease-in-out infinite'
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Header with Logo */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    {customization.logo ? (
                      <img 
                        src={customization.logo} 
                        alt="Logo" 
                        className="w-16 h-16 mx-auto rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                        style={{ 
                          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.accentColor})`,
                          boxShadow: `0 8px 32px ${customization.primaryColor}40`
                        }}
                      >
                        <Crown className="text-white" size={32} />
                      </div>
                    )}
                  </div>
                  
                  <h1 
                    className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                    style={{ fontFamily: customization.fontFamily }}
                  >
                    Thiệp mời tham dự
                  </h1>
                  <div 
                    className="w-24 h-1 mx-auto rounded-full"
                    style={{ background: `linear-gradient(90deg, ${customization.accentColor}, ${customization.primaryColor})` }}
                  />
                </div>

                {/* Event Banner */}
                <div 
                  className="rounded-2xl p-6 mb-6 relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.accentColor})`,
                    boxShadow: `0 8px 32px ${customization.primaryColor}30`
                  }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {event?.name || 'Lễ kỷ niệm 15 năm EXP Technology'}
                  </h2>
                  <p className="text-white/90 text-sm">
                    {event?.description || 'Sự kiện kỷ niệm 15 năm thành lập công ty'}
                  </p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div 
                    className="rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: `${customization.secondaryColor}20` }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar 
                        className="text-current" 
                        size={20} 
                        style={{ color: customization.primaryColor }}
                      />
                      <span className="font-semibold text-gray-800">Ngày</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {event ? formatDate(event.event_date) : 'Thứ Bảy, 15 tháng 11, 2025'}
                    </p>
                  </div>

                  <div 
                    className="rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: `${customization.secondaryColor}20` }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock 
                        className="text-current" 
                        size={20} 
                        style={{ color: customization.primaryColor }}
                      />
                      <span className="font-semibold text-gray-800">Giờ</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {event?.event_time || '18:00'}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div 
                  className="rounded-xl p-4 mb-6 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: `${customization.secondaryColor}20` }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin 
                      className="text-current" 
                      size={20} 
                      style={{ color: customization.primaryColor }}
                    />
                    <span className="font-semibold text-gray-800">Địa điểm</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {event?.location || 'Trung tâm Hội nghị Quốc gia'}
                  </p>
                  <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                    Xem trên Google Maps →
                  </button>
                </div>

                {/* Guest Greeting */}
                {guest && (
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: customization.accentColor }}
                      >
                        <Users className="text-white" size={16} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Xin chào {guest.name}!
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Bạn được mời tham dự sự kiện đặc biệt kỷ niệm 15 năm thành lập công ty. 
                      Chúng tôi rất mong được chào đón bạn!
                    </p>
                  </div>
                )}

                {/* RSVP Section */}
                <div 
                  className="rounded-xl p-4 mb-6 text-center"
                  style={{ 
                    backgroundColor: `${customization.accentColor}15`,
                    border: `2px solid ${customization.accentColor}30`
                  }}
                >
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Vui lòng xác nhận tham dự của bạn
                  </h4>
                  <p className="text-xs text-gray-600 mb-4">
                    Chúng tôi cần biết bạn có thể tham dự để chuẩn bị tốt nhất cho sự kiện
                  </p>
                  <div className="flex space-x-3 justify-center">
                    <button 
                      className="flex items-center space-x-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Heart size={16} />
                      <span className="text-sm font-medium">Đồng ý tham dự</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <X size={16} />
                      <span className="text-sm font-medium">Từ chối</span>
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-auto">
                  <div className="flex items-center space-x-2 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: customization.primaryColor }}
                    >
                      <Users className="text-white" size={12} />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Thông tin liên hệ</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="rounded-lg p-3 text-center"
                      style={{ backgroundColor: `${customization.primaryColor}10` }}
                    >
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="text-sm font-semibold text-gray-800">0901027390</p>
                    </div>
                    <div 
                      className="rounded-lg p-3 text-center"
                      style={{ backgroundColor: `${customization.primaryColor}10` }}
                    >
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="text-sm font-semibold text-gray-800">admin@exp-solution.io</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative"
              style={{
                background: `linear-gradient(135deg, ${customization.accentColor}15, ${customization.primaryColor}25, ${customization.secondaryColor}15)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${customization.accentColor}30`
              }}
            >
              <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.accentColor})`,
                    boxShadow: `0 8px 32px ${customization.primaryColor}40`
                  }}
                >
                  <Trophy className="text-white" size={40} />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Chúng tôi rất mong được gặp bạn!
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi. 
                  Chúng tôi sẵn sàng hỗ trợ bạn mọi lúc.
                </p>

                <div className="flex space-x-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flip Button */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <Sparkles className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default EnhancedInvitationPreview;
