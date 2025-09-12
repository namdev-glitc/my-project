import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';

interface CountdownTimerProps {
  eventDate: string;
  eventName: string;
  eventLocation?: string;
  variant?: 'dashboard' | 'invitation';
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  eventDate,
  eventName,
  eventLocation,
  variant = 'dashboard',
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isEventStarted, setIsEventStarted] = useState(false);
  const [isEventEnded, setIsEventEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      // Xử lý format datetime từ API
      const eventTime = new Date(eventDate).getTime();
      const difference = eventTime - now;
      
      // Debug: Log thông tin để kiểm tra (có thể xóa sau khi test)
      // console.log('Countdown Debug:', {
      //   eventDate,
      //   eventTime: new Date(eventDate),
      //   now: new Date(now),
      //   difference
      // });

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsEventStarted(false);
        setIsEventEnded(false);
      } else if (difference > -24 * 60 * 60 * 1000) { // Within 24 hours after event
        setIsEventStarted(true);
        setIsEventEnded(false);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsEventStarted(false);
        setIsEventEnded(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (variant === 'dashboard') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Sự kiện sắp tới</h3>
              <p className="text-blue-100">{eventName}</p>
              {eventLocation && (
                <p className="text-blue-200 text-sm flex items-center mt-1">
                  <MapPin size={14} className="mr-1" />
                  {eventLocation}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Ngày sự kiện</p>
            <p className="text-lg font-semibold">
              {new Date(eventDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        {isEventEnded ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold">Sự kiện đã kết thúc</p>
            <p className="text-blue-200">Cảm ơn bạn đã tham gia!</p>
          </div>
        ) : isEventStarted ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold">🎉 Sự kiện đang diễn ra!</p>
            <p className="text-blue-200">Hãy tham gia ngay bây giờ</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-3 mb-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold animate-pulse">{formatNumber(timeLeft.days)}</div>
              </div>
              <div className="text-sm text-blue-200">Ngày</div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-3 mb-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold animate-pulse">{formatNumber(timeLeft.hours)}</div>
              </div>
              <div className="text-sm text-blue-200">Giờ</div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-3 mb-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold animate-pulse">{formatNumber(timeLeft.minutes)}</div>
              </div>
              <div className="text-sm text-blue-200">Phút</div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-3 mb-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl font-bold animate-pulse">{formatNumber(timeLeft.seconds)}</div>
              </div>
              <div className="text-sm text-blue-200">Giây</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Invitation variant
  return (
    <div className={`bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">🎉 {eventName}</h2>
        <p className="text-pink-100 text-lg">Sự kiện bắt đầu sau</p>
      </div>

      {isEventEnded ? (
        <div className="py-8">
          <p className="text-2xl font-bold mb-2">Sự kiện đã kết thúc</p>
          <p className="text-pink-200">Cảm ơn bạn đã tham gia!</p>
        </div>
      ) : isEventStarted ? (
        <div className="py-8">
          <p className="text-2xl font-bold mb-2">🎉 Sự kiện đang diễn ra!</p>
          <p className="text-pink-200">Hãy tham gia ngay bây giờ</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-110 hover:rotate-2">
            <div className="text-3xl font-bold mb-1 animate-bounce">{formatNumber(timeLeft.days)}</div>
            <div className="text-sm text-pink-200">Ngày</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-110 hover:-rotate-2">
            <div className="text-3xl font-bold mb-1 animate-bounce" style={{ animationDelay: '0.1s' }}>{formatNumber(timeLeft.hours)}</div>
            <div className="text-sm text-pink-200">Giờ</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-110 hover:rotate-2">
            <div className="text-3xl font-bold mb-1 animate-bounce" style={{ animationDelay: '0.2s' }}>{formatNumber(timeLeft.minutes)}</div>
            <div className="text-sm text-pink-200">Phút</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-110 hover:-rotate-2">
            <div className="text-3xl font-bold mb-1 animate-bounce" style={{ animationDelay: '0.3s' }}>{formatNumber(timeLeft.seconds)}</div>
            <div className="text-sm text-pink-200">Giây</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center space-x-4 text-pink-200">
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <span>{new Date(eventDate).toLocaleDateString('vi-VN')}</span>
        </div>
        {eventLocation && (
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            <span>{eventLocation}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
