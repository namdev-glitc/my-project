import React from 'react';
import { useQuery } from 'react-query';
import { Calendar, MapPin, Clock } from 'lucide-react';

const EventsList: React.FC = () => {
  const { data: events, isLoading } = useQuery(
    'events',
    () => fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/events/`).then(res => res.json()),
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
    <div className="card-exp">
      <h3 className="text-lg font-semibold text-white mb-4">
        Tất cả sự kiện ({events?.length || 0})
      </h3>
      
      <div className="space-y-3">
        {events?.map((event: any, index: number) => {
          const status = getEventStatus(event.event_date);
          return (
            <div 
              key={event.id || index}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="text-exp-primary" size={16} />
                  <h4 className="text-white font-medium text-sm">
                    {event.name || 'Sự kiện mặc định'}
                  </h4>
                </div>
                <div className="flex items-center space-x-4 text-gray-400 text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
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
                  <div className="flex items-center space-x-1">
                    <MapPin size={12} />
                    <span className="truncate max-w-32">
                      {event.location || 'Trung tâm Hội nghị Quốc gia'}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 ${status.color} text-white rounded-full text-xs font-medium`}>
                {status.text}
              </div>
            </div>
          );
        })}
        
        {(!events || events.length === 0) && (
          <div className="text-center py-8 text-gray-400">
            <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
            <p>Chưa có sự kiện nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
