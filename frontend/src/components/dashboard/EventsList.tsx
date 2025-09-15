import React from 'react';
import { useQuery } from 'react-query';
import { Calendar, MapPin, Clock } from 'lucide-react';

const EventsList: React.FC = () => {
  const { data: events, isLoading } = useQuery(
    'events',
    () => fetch(`${process.env.REACT_APP_API_URL || '/api'}/events/`).then(res => res.json()),
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true
    }
  );

  if (isLoading) {
    return (
      <div className="card-exp">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getEventStatus = (eventDate: string) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Đã kết thúc', color: 'bg-gray-500' };
    } else if (diffDays === 0) {
      return { text: 'Đang diễn ra', color: 'bg-green-500' };
    } else if (diffDays <= 7) {
      return { text: 'Sắp diễn ra', color: 'bg-orange-500' };
    } else {
      return { text: 'Sắp diễn ra', color: 'bg-blue-500' };
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
        Tất cả sự kiện ({events?.length || 0})
      </h3>
      
      <div className="space-y-4">
        {events?.map((event: any, index: number) => {
          const status = getEventStatus(event.event_date);
          return (
            <div 
              key={event.id || index}
              className="group relative overflow-hidden flex items-center justify-between p-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <Calendar className="text-white" size={16} />
                  </div>
                  <h4 className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors duration-300">
                    {event.name || 'Sự kiện mặc định'}
                  </h4>
                </div>
                <div className="flex items-center space-x-4 text-gray-300 text-xs group-hover:text-gray-200 transition-colors duration-300">
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-blue-400" />
                    <span>
                      {event.event_date ? new Date(event.event_date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '15/12/2024 18:00'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-green-400" />
                    <span className="truncate max-w-32">
                      {event.location || 'Trung tâm Hội nghị Quốc gia'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className={`px-4 py-2 ${status.color} text-white rounded-full text-xs font-semibold group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                  {status.text}
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            </div>
          );
        })}
        
        {(!events || events.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-orange-400" />
            </div>
            <p className="text-lg font-medium">Chưa có sự kiện nào</p>
            <p className="text-sm text-gray-500 mt-2">Tạo sự kiện đầu tiên để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
