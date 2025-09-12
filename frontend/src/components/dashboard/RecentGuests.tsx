import React from 'react';
import { useQuery } from 'react-query';
import { Users, CheckCircle, Clock, X } from 'lucide-react';
import { getGuests } from '../../services/api';

const RecentGuests: React.FC = () => {
  const { data: guests, isLoading } = useQuery(
    'recentGuests',
    () => getGuests({ limit: 5 })
  );

  const getStatusIcon = (status: string, checkedIn: boolean) => {
    if (checkedIn) {
      return <CheckCircle size={16} className="text-green-400" />;
    }
    
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'declined':
        return <X size={16} className="text-red-400" />;
      case 'pending':
      default:
        return <Clock size={16} className="text-yellow-400" />;
    }
  };

  const getStatusText = (status: string, checkedIn: boolean) => {
    if (checkedIn) {
      return 'Đã check-in';
    }
    
    switch (status) {
      case 'accepted':
        return 'Chấp nhận';
      case 'declined':
        return 'Từ chối';
      case 'pending':
      default:
        return 'Chờ phản hồi';
    }
  };

  const getStatusColor = (status: string, checkedIn: boolean) => {
    if (checkedIn) {
      return 'text-green-400';
    }
    
    switch (status) {
      case 'accepted':
        return 'text-green-400';
      case 'declined':
        return 'text-red-400';
      case 'pending':
      default:
        return 'text-yellow-400';
    }
  };

  if (isLoading) {
    return (
      <div className="card-exp animate-pulse">
        <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-exp">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Khách mời gần đây
        </h3>
        <div className="flex items-center space-x-2 text-exp-primary">
          <Users size={20} />
          <span className="text-sm font-medium">
            {guests?.length || 0}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {guests?.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Chưa có khách mời nào
          </p>
        ) : (
          guests?.map((guest: any) => (
            <div
              key={guest.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-exp-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {guest.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {guest.title} {guest.name}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {guest.organization || 'Chưa có tổ chức'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(guest.rsvp_status, guest.checked_in)}
                <span className={`text-sm font-medium ${getStatusColor(guest.rsvp_status, guest.checked_in)}`}>
                  {getStatusText(guest.rsvp_status, guest.checked_in)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {guests && guests.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="w-full text-exp-primary hover:text-white text-sm font-medium transition-colors duration-200">
            Xem tất cả khách mời →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentGuests;




