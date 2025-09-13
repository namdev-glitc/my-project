import React from 'react';
import { X, Share2, Download, QrCode, Mail, Calendar, Clock, MapPin, Users, Crown } from 'lucide-react';

interface ViewInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

const ViewInvitationModal: React.FC<ViewInvitationModalProps> = ({
  isOpen,
  onClose,
  template,
  customization,
  event,
  guest
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Xem thiệp mời</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Share2 size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Download size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <QrCode size={18} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="flex justify-center">
              <div 
                className="w-full max-w-2xl aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
                style={{
                  backgroundColor: customization.secondaryColor,
                  color: customization.primaryColor,
                  fontFamily: customization.fontFamily,
                  fontSize: `${customization.fontSize}px`,
                  ...getBackgroundPattern()
                }}
              >
                {/* Invitation Content */}
                <div className="w-full h-full p-8 flex flex-col justify-center items-center text-center relative">
                  {/* Logo Section */}
                  <div className="mb-8">
                    {customization.logo ? (
                      <img 
                        src={customization.logo} 
                        alt="Logo" 
                        className="w-20 h-20 mx-auto mb-4 object-contain"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Crown className="text-white" size={28} />
                      </div>
                    )}
                  </div>

                  {/* Main Title */}
                  <div className="mb-8">
                    <h1 
                      className="text-5xl font-bold mb-3"
                      style={{ 
                        fontSize: `${customization.fontSize * 3}px`,
                        color: customization.primaryColor 
                      }}
                    >
                      {event?.name || 'Lễ kỷ niệm 15 năm'}
                    </h1>
                    <h2 
                      className="text-3xl font-semibold mb-4"
                      style={{ 
                        fontSize: `${customization.fontSize * 1.8}px`,
                        color: customization.primaryColor 
                      }}
                    >
                      {event?.organization || 'EXP Technology'}
                    </h2>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center space-x-4">
                      <Calendar 
                        className="text-current" 
                        size={24} 
                        style={{ color: customization.primaryColor }}
                      />
                      <span style={{ fontSize: `${customization.fontSize * 1.3}px` }}>
                        {event ? formatDate(event.event_date) : 'Thứ Bảy, 15 tháng 11, 2025'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <Clock 
                        className="text-current" 
                        size={24} 
                        style={{ color: customization.primaryColor }}
                      />
                      <span style={{ fontSize: `${customization.fontSize * 1.3}px` }}>
                        {event?.event_time || '18:00'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <MapPin 
                        className="text-current" 
                        size={24} 
                        style={{ color: customization.primaryColor }}
                      />
                      <span style={{ fontSize: `${customization.fontSize * 1.3}px` }}>
                        {event?.location || 'Trung tâm Hội nghị Quốc gia'}
                      </span>
                    </div>
                  </div>

                  {/* Guest Information */}
                  {guest && (
                    <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: customization.accentColor }}>
                      <h3 
                        className="font-semibold mb-3"
                        style={{ fontSize: `${customization.fontSize * 1.4}px` }}
                      >
                        Kính mời
                      </h3>
                      <p 
                        className="font-bold"
                        style={{ fontSize: `${customization.fontSize * 1.6}px` }}
                      >
                        {guest.name}
                      </p>
                      {guest.organization && (
                        <p 
                          className="text-sm opacity-80 mt-2"
                          style={{ fontSize: `${customization.fontSize * 1.1}px` }}
                        >
                          {guest.organization}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-8 max-w-lg">
                    <p 
                      className="text-sm opacity-80 leading-relaxed"
                      style={{ fontSize: `${customization.fontSize * 1.1}px` }}
                    >
                      {event?.description || 'Trân trọng kính mời quý khách tham dự Lễ kỷ niệm 15 năm thành lập công ty'}
                    </p>
                  </div>

                  {/* RSVP Section */}
                  <div className="mb-8">
                    <div 
                      className="inline-flex items-center space-x-3 px-8 py-4 rounded-full border-2"
                      style={{ 
                        borderColor: customization.primaryColor,
                        backgroundColor: `${customization.primaryColor}10`
                      }}
                    >
                      <Users 
                        className="text-current" 
                        size={20} 
                        style={{ color: customization.primaryColor }}
                      />
                      <span 
                        className="font-semibold"
                        style={{ fontSize: `${customization.fontSize * 1.3}px` }}
                      >
                        RSVP: {event?.max_guests || 'Không giới hạn'} khách
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-8 border-t border-current border-opacity-20">
                    <p 
                      className="text-xs opacity-60"
                      style={{ fontSize: `${customization.fontSize * 0.9}px` }}
                    >
                      Vui lòng xác nhận tham dự trước ngày 10/11/2025
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 left-6 w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
                  <div className="absolute top-6 right-6 w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
                  <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
                  <div className="absolute bottom-6 right-6 w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: customization.primaryColor }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200">
                <Mail size={16} />
                <span>Gửi email</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200">
                <Download size={16} />
                <span>Tải PDF</span>
              </button>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvitationModal;



