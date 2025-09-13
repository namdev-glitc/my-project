import React from 'react';
import { Calendar, Clock, MapPin, Users, Crown, Star, Heart, Gift } from 'lucide-react';

interface InvitationPreviewProps {
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

const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  template,
  customization,
  event,
  guest,
  previewMode
}) => {
  const getPreviewSize = () => {
    switch (previewMode) {
      case 'mobile': return 'w-80 h-[600px]';
      case 'tablet': return 'w-96 h-[700px]';
      default: return 'w-full h-[800px]';
    }
  };

  const getFontSize = () => {
    const baseSize = customization.fontSize;
    switch (previewMode) {
      case 'mobile': return baseSize * 0.8;
      case 'tablet': return baseSize * 0.9;
      default: return baseSize;
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

  const getBackgroundPattern = () => {
    switch (customization.backgroundPattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${customization.primaryColor}20 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${customization.primaryColor}10 10px, ${customization.primaryColor}10 20px)`
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${customization.primaryColor}20 1px, transparent 1px), linear-gradient(90deg, ${customization.primaryColor}20 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex justify-center">
      <div className={`${getPreviewSize()} bg-white rounded-lg shadow-2xl overflow-hidden`}>
        <div 
          className="w-full h-full p-8 flex flex-col justify-center items-center text-center relative"
          style={{
            backgroundColor: customization.secondaryColor,
            color: customization.primaryColor,
            fontFamily: customization.fontFamily,
            fontSize: `${getFontSize()}px`,
            ...getBackgroundPattern()
          }}
        >
          {/* Logo Section */}
          <div className="mb-8">
            {customization.logo ? (
              <img 
                src={customization.logo} 
                alt="Logo" 
                className="w-16 h-16 mx-auto mb-4 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Crown className="text-white" size={24} />
              </div>
            )}
          </div>

          {/* Main Title */}
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ 
                fontSize: `${getFontSize() * 2.5}px`,
                color: customization.primaryColor 
              }}
            >
              {event?.name || 'Lễ kỷ niệm 15 năm'}
            </h1>
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{ 
                fontSize: `${getFontSize() * 1.5}px`,
                color: customization.primaryColor 
              }}
            >
              {event?.organization || 'EXP Technology'}
            </h2>
          </div>

          {/* Event Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <Calendar 
                className="text-current" 
                size={20} 
                style={{ color: customization.primaryColor }}
              />
              <span style={{ fontSize: `${getFontSize() * 1.1}px` }}>
                {event ? formatDate(event.event_date) : 'Thứ Bảy, 15 tháng 11, 2025'}
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <Clock 
                className="text-current" 
                size={20} 
                style={{ color: customization.primaryColor }}
              />
              <span style={{ fontSize: `${getFontSize() * 1.1}px` }}>
                {event?.event_time || '18:00'}
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <MapPin 
                className="text-current" 
                size={20} 
                style={{ color: customization.primaryColor }}
              />
              <span style={{ fontSize: `${getFontSize() * 1.1}px` }}>
                {event?.location || 'Trung tâm Hội nghị Quốc gia'}
              </span>
            </div>
          </div>

          {/* Guest Information */}
          {guest && (
            <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: customization.accentColor }}>
              <h3 
                className="font-semibold mb-2"
                style={{ fontSize: `${getFontSize() * 1.2}px` }}
              >
                Kính mời
              </h3>
              <p 
                className="font-bold"
                style={{ fontSize: `${getFontSize() * 1.3}px` }}
              >
                {guest.name}
              </p>
              {guest.organization && (
                <p 
                  className="text-sm opacity-80"
                  style={{ fontSize: `${getFontSize() * 0.9}px` }}
                >
                  {guest.organization}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-8 max-w-md">
            <p 
              className="text-sm opacity-80 leading-relaxed"
              style={{ fontSize: `${getFontSize() * 0.9}px` }}
            >
              {event?.description || 'Trân trọng kính mời quý khách tham dự Lễ kỷ niệm 15 năm thành lập công ty'}
            </p>
          </div>

          {/* RSVP Section */}
          <div className="mb-8">
            <div 
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border-2"
              style={{ 
                borderColor: customization.primaryColor,
                backgroundColor: `${customization.primaryColor}10`
              }}
            >
              <Users 
                className="text-current" 
                size={18} 
                style={{ color: customization.primaryColor }}
              />
              <span 
                className="font-semibold"
                style={{ fontSize: `${getFontSize() * 1.1}px` }}
              >
                RSVP: {event?.max_guests || 'Không giới hạn'} khách
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t border-current border-opacity-20">
            <p 
              className="text-xs opacity-60"
              style={{ fontSize: `${getFontSize() * 0.8}px` }}
            >
              Vui lòng xác nhận tham dự trước ngày 10/11/2025
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPreview;
