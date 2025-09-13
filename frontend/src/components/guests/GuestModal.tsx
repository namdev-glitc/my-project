import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { createGuest, updateGuest } from '../../services/api';
import toast from 'react-hot-toast';

interface GuestModalProps {
  guest: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (data: { id: number; data: any }) => void;
  onCreate?: (data: any) => void;
  isLoading?: boolean;
}

const GuestModal: React.FC<GuestModalProps> = ({
  guest,
  isOpen,
  onClose,
  onUpdate,
  onCreate,
  isLoading = false
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (guest) {
      reset({
        title: guest.title || '',
        name: guest.name || '',
        role: guest.role || '',
        organization: guest.organization || '',
        tag: guest.tag || '',
        email: guest.email || '',
        phone: guest.phone || '',
        rsvp_status: guest.rsvp_status || 'pending',
        rsvp_notes: guest.rsvp_notes || ''
      });
    } else {
      reset({
        title: 'Mr',
        name: '',
        role: '',
        organization: '',
        tag: '',
        email: '',
        phone: '',
        rsvp_status: 'pending',
        rsvp_notes: ''
      });
    }
  }, [guest, reset]);

  // Auto scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

  const onSubmit = async (data: any) => {
    if (guest) {
      if (onUpdate) {
        onUpdate({ id: guest.id, data });
      } else {
        await updateGuest(guest.id, data);
        toast.success('Cập nhật khách mời thành công!');
      }
    } else {
      if (onCreate) {
        onCreate({ ...data, event_id: 1 });
      } else {
        await createGuest({ ...data, event_id: 1 });
        toast.success('Thêm khách mời thành công!');
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-top bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-2xl sm:w-full" style={{marginTop: '20px'}}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">
                  {guest ? 'Chỉnh sửa khách mời' : 'Thêm khách mời mới'}
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
                {/* Title and Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Danh xưng
                    </label>
                    <select
                      {...register('title')}
                      className="w-full input-exp"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof. Dr">Prof. Dr</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Họ tên là bắt buộc' })}
                      className="w-full input-exp"
                      placeholder="Nhập họ tên"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">
                        {String(errors.name?.message || 'Lỗi validation')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role and Organization */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      {...register('role')}
                      className="w-full input-exp"
                      placeholder="CEO, CTO, ..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tổ chức
                    </label>
                    <input
                      type="text"
                      {...register('organization')}
                      className="w-full input-exp"
                      placeholder="Tên công ty/tổ chức"
                    />
                  </div>
                </div>

                {/* Tag and Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tag
                    </label>
                    <input
                      type="text"
                      {...register('tag')}
                      className="w-full input-exp"
                      placeholder="Mã nhóm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full input-exp"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full input-exp"
                    placeholder="0123456789"
                  />
                </div>

                {/* RSVP Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trạng thái RSVP
                  </label>
                  <select
                    {...register('rsvp_status')}
                    className="w-full input-exp"
                  >
                    <option value="pending">Chờ phản hồi</option>
                    <option value="accepted">Chấp nhận</option>
                    <option value="declined">Từ chối</option>
                  </select>
                </div>

                {/* RSVP Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ghi chú RSVP
                  </label>
                  <textarea
                    {...register('rsvp_notes')}
                    rows={3}
                    className="w-full input-exp"
                    placeholder="Ghi chú thêm..."
                  />
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

export default GuestModal;

