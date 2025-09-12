import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, User, Calendar, MapPin, Clock } from 'lucide-react';
import { checkinGuest, getGuest } from '../services/api';
import GoogleMap from '../components/GoogleMap';
import toast from 'react-hot-toast';

const CheckIn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [guest, setGuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkinResult, setCheckinResult] = useState<any>(null);

  const guestId = searchParams.get('guest_id');
  const qrId = searchParams.get('qr_id');

  useEffect(() => {
    const loadGuest = async () => {
      if (!guestId) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Đang tải khách mời ID:', guestId);
        const guestData = await getGuest(parseInt(guestId));
        console.log('✅ Dữ liệu khách mời:', guestData);
        setGuest(guestData);
      } catch (error: any) {
        console.error('❌ Lỗi tải thông tin khách mời:', error);
        console.error('❌ Chi tiết lỗi:', error.response?.data);
        toast.error('Không thể tải thông tin khách mời');
      } finally {
        setLoading(false);
      }
    };

    loadGuest();
  }, [guestId]);

  const handleCheckIn = async () => {
    if (!guestId) return;

    setCheckingIn(true);
    try {
      const result = await checkinGuest(parseInt(guestId), {
        check_in_location: 'QR Code Check-in',
        qr_id: qrId
      });

      setCheckinResult(result);
      toast.success('Check-in thành công!');
    } catch (error: any) {
      console.error('Lỗi check-in:', error);
      toast.error(error.response?.data?.detail || 'Lỗi check-in');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Không tìm thấy khách mời</h1>
          <p className="text-gray-300 mb-4">QR code không hợp lệ hoặc đã hết hạn</p>
          <button
            onClick={() => navigate('/')}
            className="btn-exp"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (checkinResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Check-in thành công!</h1>
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">{guest.title} {guest.name}</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Tổ chức:</strong> {guest.organization || 'Chưa có'}</p>
              <p><strong>Chức vụ:</strong> {guest.role || 'Chưa có'}</p>
              <p><strong>Thời gian check-in:</strong> {new Date().toLocaleString('vi-VN')}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-exp"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Check-in sự kiện</h1>
          <p className="text-gray-300">Lễ kỷ niệm 15 năm EXP Techno Logy</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="h-8 w-8 text-exp-primary mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-white">{guest.title} {guest.name}</h2>
              <p className="text-gray-300">{guest.organization || 'Chưa có tổ chức'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-exp-primary mr-3" />
              <span className="text-gray-300">15/12/2024 - 18:00</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-exp-primary mr-3" />
              <span className="text-gray-300">Trung tâm Hội nghị Quốc gia</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-exp-primary mr-3" />
              <span className="text-gray-300">Thời gian check-in: {new Date().toLocaleString('vi-VN')}</span>
            </div>
          </div>

          {/* Google Map */}
          <div className="mt-4">
            <GoogleMap 
              location="Trung tâm Hội nghị Quốc gia"
              eventName="Lễ kỷ niệm 15 năm EXP Techno Logy"
              className="w-full"
            />
          </div>
        </div>

        {guest.checked_in ? (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Đã check-in</h3>
            <p className="text-gray-300 mb-6">Bạn đã check-in vào lúc: {guest.check_in_time ? new Date(guest.check_in_time).toLocaleString('vi-VN') : 'Chưa có thông tin'}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-exp"
            >
              Về trang chủ
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="btn-exp w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingIn ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                'Xác nhận Check-in'
              )}
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Nhấn để xác nhận tham dự sự kiện
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
