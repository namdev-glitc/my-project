import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { createEvent, updateEvent } from '../../services/api';
import toast from 'react-hot-toast';

interface EventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (data: { id: number; data: any }) => void;
  onCreate?: (data: any) => void;
  isLoading?: boolean;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onUpdate,
  onCreate,
  isLoading = false
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (event) {
      reset({
        name: event.name || '',
        description: event.description || '',
        event_date: event.event_date ? event.event_date.split('T')[0] : '',
        location: event.location || '',
        max_guests: event.max_guests || 100,
        is_active: event.is_active !== undefined ? event.is_active : true
      });
    } else {
      reset({
        name: '',
        description: '',
        event_date: '',
        location: '',
        max_guests: 100,
        is_active: true
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: any) => {
    // Prepare data according to backend schema
    const eventData = {
      name: data.name,
      description: data.description,
      event_date: data.event_date ? new Date(data.event_date).toISOString() : new Date().toISOString(),
      location: data.location,
      max_guests: parseInt(data.max_guests) || 100,
      is_active: data.is_active !== undefined ? data.is_active : true
    };



    if (event) {
      if (onUpdate) {
        onUpdate({ id: event.id, data: eventData });
      } else {
        await updateEvent(event.id, eventData);
        toast.success('Cập nhật sự kiện thành công!');
      }
    } else {
      if (onCreate) {
        onCreate(eventData);
      } else {
        await createEvent(eventData);
        toast.success('Tạo sự kiện thành công!');
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">
                  {event ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên sự kiện *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Tên sự kiện là bắt buộc' })}
                    className="w-full input-exp"
                    placeholder="Nhập tên sự kiện"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">
                      {String(errors.name?.message || 'Lỗi validation')}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full input-exp"
                    placeholder="Mô tả sự kiện..."
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ngày sự kiện *
                  </label>
                  <input
                    type="date"
                    {...register('event_date', { required: 'Ngày sự kiện là bắt buộc' })}
                    className="w-full input-exp"
                  />
                  {errors.event_date && (
                    <p className="text-red-400 text-xs mt-1">
                      {String(errors.event_date?.message || 'Lỗi validation')}
                    </p>
                  )}
                </div>

                {/* Location and Max Guests */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      {...register('location')}
                      className="w-full input-exp"
                      placeholder="Địa điểm tổ chức"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Số khách tối đa
                    </label>
                    <input
                      type="number"
                      {...register('max_guests', { min: 1 })}
                      className="w-full input-exp"
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    {...register('is_active')}
                    className="w-full input-exp"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Tạm dừng</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-exp flex items-center space-x-2 sm:ml-3 sm:w-auto w-full justify-center"
              >
                <Save size={20} />
                <span>{isLoading ? 'Đang lưu...' : 'Lưu'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

