import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Calendar, MapPin, Clock, Users, Edit, Trash2, ChevronDown } from 'lucide-react';
import { getEvents, createEvent, updateEvent, deleteEvent, getGuests } from '../services/api';
import EventModal from '../components/events/EventModal';
import GoogleMap from '../components/GoogleMap';
import toast from 'react-hot-toast';

interface Event {
  id: number;
  name: string;
  description?: string;
  event_date: string;
  event_time?: string;
  location?: string;
  max_guests?: number;
  is_active: boolean;
  registration_open: boolean;
  created_at?: string;
  updated_at?: string;
}

const Events: React.FC = () => {
  const { data: events, isLoading } = useQuery('events', getEvents);
  const { data: guests } = useQuery('guests', getGuests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const createEventMutation = useMutation(createEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries('events');
      toast.success('Tạo sự kiện thành công!');
    },
    onError: () => {
      toast.error('Có lỗi khi tạo sự kiện!');
    }
  });

  const updateEventMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => updateEvent(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
        toast.success('Cập nhật sự kiện thành công!');
      },
      onError: () => {
        toast.error('Có lỗi khi cập nhật sự kiện!');
      }
    }
  );

  const deleteEventMutation = useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries('events');
      toast.success('Xóa sự kiện thành công!');
    },
    onError: () => {
      toast.error('Có lỗi khi xóa sự kiện!');
    }
  });

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${event.name}"?`)) {
      deleteEventMutation.mutate(event.id);
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to check if event is past due
  const isEventPastDue = (event: any) => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    return eventDate < now;
  };

  // Helper function to get event status (considering time)
  const getEventStatus = (event: any) => {
    if (isEventPastDue(event)) {
      return 'past'; // Event has passed
    } else if (event.is_active) {
      return 'active'; // Event is active and not past due
    } else {
      return 'inactive'; // Event is manually set to inactive
    }
  };

  // Filter events based on search and filter criteria
  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    
    return events.filter((event: any) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter (considering time-based status)
      const eventStatus = getEventStatus(event);
      const matchesStatus = statusFilter === '' || 
        (statusFilter === 'active' && eventStatus === 'active') ||
        (statusFilter === 'inactive' && eventStatus === 'inactive') ||
        (statusFilter === 'past' && eventStatus === 'past');
      
      // Month filter
      const matchesMonth = monthFilter === '' || (() => {
        const eventDate = new Date(event.event_date);
        const now = new Date();
        
        switch (monthFilter) {
          case 'this-month':
            return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
          case 'next-month':
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);
            return eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear();
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [events, searchTerm, statusFilter, monthFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-600 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="card-exp animate-pulse">
              <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Particle Effects */}
        <div className="absolute top-32 left-1/2 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-64 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Sự kiện</h1>
          <p className="text-gray-400 mt-2">
            Quản lý thông tin sự kiện và chương trình
          </p>
        </div>
        <button 
          onClick={handleAddEvent}
          className="btn-exp flex items-center space-x-2"
        >
          <Calendar size={20} />
          <span>Thêm sự kiện</span>
        </button>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Events */}
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Sự kiện hoạt động</p>
              <p className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                {filteredEvents?.filter((e: any) => getEventStatus(e) === 'active').length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="text-green-400" size={24} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Sắp diễn ra</p>
              <p className="text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                {filteredEvents?.filter((e: any) => getEventStatus(e) === 'active' && new Date(e.event_date) > new Date()).length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Total Guests */}
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Tổng khách mời</p>
              <p className="text-3xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                {Array.isArray(guests) ? guests.length : guests?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Past Events */}
        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Đã kết thúc</p>
              <p className="text-3xl font-bold text-red-400 group-hover:text-red-300 transition-colors">
                {filteredEvents?.filter((e: any) => getEventStatus(e) === 'past').length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="text-red-400" size={24} />
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white/15"
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex gap-3">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[160px] hover:bg-white/15 transition-colors text-sm font-medium"
              >
                <option value="" className="bg-gray-800 text-white py-2">Tất cả trạng thái</option>
                <option value="active" className="bg-gray-800 text-white py-2">Hoạt động</option>
                <option value="inactive" className="bg-gray-800 text-white py-2">Tạm dừng</option>
                <option value="past" className="bg-gray-800 text-white py-2">Đã kết thúc</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="text-gray-400" size={16} />
              </div>
            </div>
            
            <div className="relative">
              <select 
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[160px] hover:bg-white/15 transition-colors text-sm font-medium"
              >
                <option value="" className="bg-gray-800 text-white py-2">Tất cả tháng</option>
                <option value="this-month" className="bg-gray-800 text-white py-2">Tháng này</option>
                <option value="next-month" className="bg-gray-800 text-white py-2">Tháng sau</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents?.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          {searchTerm || statusFilter || monthFilter ? (
            <>
              <p className="text-gray-400 text-lg">Không tìm thấy sự kiện phù hợp</p>
              <p className="text-gray-500 text-sm mt-2">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setMonthFilter('');
                }}
                className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
              >
                Xóa bộ lọc
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-lg">Chưa có sự kiện nào</p>
              <p className="text-gray-500 text-sm mt-2">
                Hãy tạo sự kiện đầu tiên để bắt đầu
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents?.map((event: any) => (
            <div key={event.id} className="group relative overflow-hidden backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 mb-2">
                      {event.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        getEventStatus(event) === 'active'
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30' 
                          : getEventStatus(event) === 'past'
                          ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                          : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {getEventStatus(event) === 'active' ? '🟢 Hoạt động' : 
                         getEventStatus(event) === 'past' ? '🔴 Đã kết thúc' : '🔴 Tạm dừng'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        event.registration_open 
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {event.registration_open ? '🔵 Mở đăng ký' : '🔴 Đóng đăng ký'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-white transition-all duration-200 hover:scale-110"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleViewEvent(event)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-white transition-all duration-200 hover:scale-110"
                      title="Xem chi tiết"
                    >
                      <Calendar size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-white transition-all duration-200 hover:scale-110"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Event Date & Time */}
                  <div className="flex items-start space-x-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <Clock className="text-blue-400" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium">Thời gian</p>
                      <p className="text-white text-sm font-semibold">
                        {formatDate(event.event_date)}
                      </p>
                    </div>
                  </div>

                  {/* Event Location */}
                  {event.location && (
                    <div className="flex items-start space-x-3 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                        <MapPin className="text-green-400" size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm font-medium">Địa điểm</p>
                        <button
                          onClick={() => {
                            const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                            window.open(searchUrl, '_blank');
                          }}
                          className="text-white text-sm font-semibold hover:text-green-400 transition-colors cursor-pointer underline"
                          title="Click để mở Google Maps"
                        >
                          {event.location}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Guest Count */}
                  <div className="flex items-start space-x-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <Users className="text-purple-400" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium">Khách mời</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-white text-sm font-semibold">
                          {event.max_guests ? `${guests?.filter((g: any) => g.event_id === event.id).length || 0}/${event.max_guests}` : `${guests?.filter((g: any) => g.event_id === event.id).length || 0} khách`}
                        </p>
                        {event.max_guests && (
                          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" 
                              style={{
                                width: `${Math.min(((guests?.filter((g: any) => g.event_id === event.id).length || 0) / event.max_guests) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                {event.description && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-gray-300 text-sm line-clamp-2 group-hover:text-gray-200 transition-colors">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => handleViewEvent(event)}
                      className="flex items-center space-x-2 text-blue-400 hover:text-white text-sm font-medium transition-colors duration-200 group-hover:scale-105"
                    >
                      <Calendar size={16} />
                      <span>Xem chi tiết</span>
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors" title="Chia sẻ">
                        <Calendar size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-400 transition-colors" title="Sao chép">
                        <Calendar size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onUpdate={updateEventMutation.mutate}
          onCreate={createEventMutation.mutate}
          isLoading={createEventMutation.isLoading || updateEventMutation.isLoading}
        />
      )}

      {/* Event View Modal */}
      {isViewModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-16 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={() => setIsViewModalOpen(false)}></div>

            <div className="inline-block align-top backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-top sm:max-w-2xl sm:w-full animate-in slide-in-from-bottom-4 duration-300 max-h-[80vh] overflow-y-auto">
              <div className="px-3 pt-3 pb-2 sm:p-4 sm:pb-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Chi tiết sự kiện
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <Calendar size={16} />
                  </button>
                </div>

                {/* Event Info Grid */}
                <div className="space-y-3">
                  {/* Event Name */}
                  <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                        <Calendar className="text-blue-400" size={14} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">Tên sự kiện</h4>
                    </div>
                    <p className="text-white font-bold text-base">{selectedEvent.name}</p>
                  </div>

                  {/* Event Description */}
                  {selectedEvent.description && (
                    <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                          <Calendar className="text-green-400" size={14} />
                        </div>
                        <h4 className="text-sm font-semibold text-white">Mô tả</h4>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{selectedEvent.description}</p>
                    </div>
                  )}

                  {/* Event Date & Time */}
                  <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center">
                        <Clock className="text-purple-400" size={14} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">Thời gian</h4>
                    </div>
                    <p className="text-white font-semibold text-sm">{formatDate(selectedEvent.event_date)}</p>
                    {selectedEvent.event_time && (
                      <p className="text-gray-300 text-xs">{selectedEvent.event_time}</p>
                    )}
                  </div>

                  {/* Event Location */}
                  <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center">
                        <MapPin className="text-orange-400" size={14} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">Địa điểm</h4>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedEvent.location) {
                          const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`;
                          window.open(searchUrl, '_blank');
                        }
                      }}
                      className="text-white font-semibold text-sm mb-2 hover:text-orange-400 transition-colors cursor-pointer underline"
                      title="Click để mở Google Maps"
                    >
                      {selectedEvent.location || 'Chưa cập nhật'}
                    </button>
                    
                    {/* Google Map */}
                    {selectedEvent.location && (
                      <div className="rounded overflow-hidden">
                        <GoogleMap 
                          location={selectedEvent.location}
                          eventName={selectedEvent.name}
                          className="w-full h-24"
                        />
                      </div>
                    )}
                  </div>

                  {/* Event Status */}
                  <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-indigo-500/20 rounded flex items-center justify-center">
                        <Users className="text-indigo-400" size={14} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">Trạng thái</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Trạng thái sự kiện</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          getEventStatus(selectedEvent) === 'active'
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30' 
                            : getEventStatus(selectedEvent) === 'past'
                            ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                            : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {getEventStatus(selectedEvent) === 'active' ? '🟢 Hoạt động' : 
                           getEventStatus(selectedEvent) === 'past' ? '🔴 Đã kết thúc' : '🔴 Tạm dừng'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Đăng ký</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedEvent.registration_open 
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {selectedEvent.registration_open ? '🔵 Mở đăng ký' : '🔴 Đóng đăng ký'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-pink-500/20 rounded flex items-center justify-center">
                        <Users className="text-pink-400" size={14} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">Khách mời</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Số khách tối đa</span>
                        <span className="text-white font-semibold text-sm">{selectedEvent.max_guests || 'Không giới hạn'}</span>
                      </div>
                      {!selectedEvent.max_guests && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs">Đã đăng ký</span>
                          <span className="text-white font-semibold text-sm">{guests?.filter((g: any) => g.event_id === selectedEvent.id).length || 0} khách</span>
                        </div>
                      )}
                      {selectedEvent.max_guests && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Đã đăng ký</span>
                            <span className="text-white font-semibold">{guests?.filter((g: any) => g.event_id === selectedEvent.id).length || 0}/{selectedEvent.max_guests}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" 
                              style={{
                                width: `${Math.min(((guests?.filter((g: any) => g.event_id === selectedEvent.id).length || 0) / selectedEvent.max_guests) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-3 py-2 sm:px-4 sm:py-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => {
                        setIsViewModalOpen(false);
                        handleEditEvent(selectedEvent);
                      }}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-white rounded transition-all duration-200 text-xs"
                    >
                      <Edit size={12} />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-white rounded transition-all duration-200 text-xs">
                      <Calendar size={12} />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded transition-all duration-200 font-semibold text-xs"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Events;




