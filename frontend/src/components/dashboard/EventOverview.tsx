import React from 'react';
import { useQuery } from 'react-query';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { getEventStats } from '../../services/api';

const EventOverview: React.FC = () => {
  const { data: eventStats, isLoading } = useQuery(
    'eventStats',
    () => getEventStats(1),
    {
      refetchInterval: 5000, // Refresh every 5 seconds
      refetchOnWindowFocus: true
    }
  );

  if (isLoading) {
    return (
      <div className="card-exp">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const event = eventStats?.event || {};

  return (
    <div className="card-exp">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Thông tin sự kiện
        </h3>
        <div className="px-3 py-1 bg-exp-primary/20 text-exp-primary rounded-full text-sm font-medium">
          Đang diễn ra
        </div>
      </div>

      <div className="space-y-4">
        {/* Event Name */}
        <div className="flex items-start space-x-3">
          <Calendar className="text-exp-primary mt-1" size={20} />
          <div>
            <h4 className="text-white font-medium">{event.name || 'Lễ kỷ niệm 15 năm EXP Techno Logy'}</h4>
            <p className="text-gray-400 text-sm mt-1">
              {event.description || 'Sự kiện kỷ niệm 15 năm thành lập công ty EXP Techno Logy'}
            </p>
          </div>
        </div>

        {/* Event Date */}
        <div className="flex items-center space-x-3">
          <Clock className="text-exp-primary" size={20} />
          <div>
            <p className="text-white font-medium">
              {event.event_date ? new Date(event.event_date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '15/12/2024 - 18:00'}
            </p>
            <p className="text-gray-400 text-sm">Thời gian diễn ra</p>
          </div>
        </div>

        {/* Event Location */}
        <div className="flex items-center space-x-3">
          <MapPin className="text-exp-primary" size={20} />
          <div>
            <p className="text-white font-medium">
              {event.location || 'Trung tâm Hội nghị Quốc gia'}
            </p>
            <p className="text-gray-400 text-sm">Địa điểm tổ chức</p>
          </div>
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="text-exp-primary" size={20} />
              <span className="text-2xl font-bold text-white">
                {eventStats?.total_guests || 0}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Tổng khách mời</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              <span className="text-2xl font-bold text-white">
                {eventStats?.checked_in || 0}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Đã check-in</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Tiến độ check-in</span>
            <span className="text-exp-primary font-medium text-sm">
              {eventStats?.check_in_rate || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-exp-primary to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${eventStats?.check_in_rate || 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOverview;



