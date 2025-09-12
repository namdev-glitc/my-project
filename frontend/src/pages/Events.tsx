import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Calendar, MapPin, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/api';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();

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
    <div className="space-y-6">
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

      {/* Events Grid */}
      {events?.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400 text-lg">Chưa có sự kiện nào</p>
          <p className="text-gray-500 text-sm mt-2">
            Hãy tạo sự kiện đầu tiên để bắt đầu
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event: any) => (
            <div key={event.id} className="card-exp group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-exp-primary transition-colors duration-200">
                  {event.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEditEvent(event)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event)}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Clock className="text-exp-primary mt-1" size={16} />
                  <div>
                    <p className="text-white text-sm font-medium">Thời gian</p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(event.event_date)}
                    </p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-exp-primary mt-1" size={16} />
                    <div>
                      <p className="text-white text-sm font-medium">Địa điểm</p>
                      <p className="text-gray-400 text-sm">{event.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Users className="text-exp-primary" size={16} />
                  <div>
                    <p className="text-white text-sm font-medium">Trạng thái</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.is_active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.registration_open 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.registration_open ? 'Mở đăng ký' : 'Đóng đăng ký'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-700">
                <button 
                  onClick={() => handleViewEvent(event)}
                  className="w-full text-exp-primary hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  Xem chi tiết →
                </button>
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
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setIsViewModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Chi tiết sự kiện
                  </h3>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tên sự kiện
                    </label>
                    <p className="text-white text-lg font-semibold">{selectedEvent.name}</p>
                  </div>

                  {selectedEvent.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mô tả
                      </label>
                      <p className="text-gray-300">{selectedEvent.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ngày sự kiện
                      </label>
                      <p className="text-white">{formatDate(selectedEvent.event_date)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Giờ sự kiện
                      </label>
                      <p className="text-white">{selectedEvent.event_time || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Địa điểm
                    </label>
                    <p className="text-white mb-3">{selectedEvent.location || 'Chưa cập nhật'}</p>
                    
                    {/* Google Map */}
                    {selectedEvent.location && (
                      <GoogleMap 
                        location={selectedEvent.location}
                        eventName={selectedEvent.name}
                        className="w-full"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Số khách tối đa
                    </label>
                    <p className="text-white">{selectedEvent.max_guests || 'Không giới hạn'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Trạng thái
                      </label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEvent.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedEvent.is_active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Đăng ký
                      </label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEvent.registration_open 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedEvent.registration_open ? 'Mở đăng ký' : 'Đóng đăng ký'}
                      </span>
                    </div>
                  </div>

                  {selectedEvent.created_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ngày tạo
                      </label>
                      <p className="text-gray-300">{new Date(selectedEvent.created_at).toLocaleString('vi-VN')}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;




