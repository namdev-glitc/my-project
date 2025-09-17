import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, XCircle, QrCode, Download, Share2, Mail, Phone, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getGuest, getEvent, updateGuestRSVP } from '../services/api';
import ExpLogoImage from '../components/ExpLogoImage';

interface Guest {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  rsvp_status?: 'pending' | 'accepted' | 'declined';
  qr_code?: string;
  qr_image_url?: string;
  event_id?: number;
}

interface Event {
  id: number;
  name: string;
  description?: string;
  event_date?: string;
  location?: string;
  max_guests?: number;
}

const Invitation: React.FC = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const [searchParams] = useSearchParams();
  const eventIdFromQuery = searchParams.get('event');
  
  const [guest, setGuest] = useState<Guest | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!guestId) {
          toast.error('Thiếu thông tin khách mời hoặc sự kiện');
          setLoading(false);
          return;
        }

        const guestData = await getGuest(parseInt(guestId));
        setGuest(guestData);

        const resolvedEventId = eventIdFromQuery
          ? parseInt(eventIdFromQuery)
          : (guestData?.event_id as number | undefined);

        if (resolvedEventId) {
          const eventData = await getEvent(resolvedEventId);
          setEvent(eventData);
        } else {
          toast.error('Thiếu thông tin sự kiện');
        }
      } catch (error: any) {
        console.error('Lỗi tải dữ liệu:', error);
        toast.error('Không thể tải thông tin mời');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [guestId, eventIdFromQuery]);

  const handleRSVP = async (status: 'accepted' | 'declined') => {
    if (!guest) return;

    setSubmitting(true);
    try {
      await updateGuestRSVP(guest.id, { rsvp_status: status });
      setGuest({ ...guest, rsvp_status: status });
      toast.success(status === 'accepted' ? 'Đã xác nhận tham dự!' : 'Đã từ chối lời mời');
    } catch (error: any) {
      console.error('Lỗi cập nhật RSVP:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!guest || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy thông tin</h1>
          <p className="text-gray-600">Link mời không hợp lệ hoặc đã hết hạn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_800px_at_50%_-200px,rgba(27,36,84,1)_0%,rgba(21,15,46,1)_50%,rgba(10,10,26,1)_100%)]">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-yellow-500/10 to-amber-500/0 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tr from-fuchsia-500/10 to-purple-500/0 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-[conic-gradient(from_180deg_at_50%_50%,#6d28d9_0%,#22d3ee_25%,#8b5cf6_50%,#22d3ee_75%,#6d28d9_100%)] p-[2px] animate-bounce">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.35)]">
              <ExpLogoImage size="sm" showText={false} />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Thiệp mời tham dự
          </h1>
          <div className="relative w-40 mx-auto mt-3">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/70 text-white backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-yellow-500/20">
          {/* Event Info */}
          <div className="relative bg-slate-900/80 text-white p-8 sm:p-12">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2
                  className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent"
                  style={{
                    textShadow:
                      '0 0 8px rgba(139,92,246,0.6), 0 0 16px rgba(99,102,241,0.45), 0 0 28px rgba(34,211,238,0.35)'
                  }}
                >
                  {event.name}
                </h2>
                {event.description && (
                  <p className="text-lg sm:text-xl text-gray-200/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
                <div className="flex items-center space-x-4 p-5 sm:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-purple-400/30 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-400/10 ring-2 ring-purple-400/50">
                    <Calendar className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Chủ Nhật, 15 tháng 12, 2024'}
                    </p>
                    <p className="text-gray-300/90">
                      {event.event_date ? new Date(event.event_date).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '18:00'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-5 sm:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-purple-400/30 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-fuchsia-500/20 to-purple-400/10 ring-2 ring-fuchsia-300/50">
                    <MapPin className="h-6 w-6 text-fuchsia-300" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-white">Địa điểm</p>
                    <p className="text-gray-300/90 mb-2">{event.location || 'Trung tâm Hội nghị Quốc gia'}</p>
                    <button
                      onClick={() => {
                        const location = event.location || 'Trung tâm Hội nghị Quốc gia';
                        const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
                        window.open(searchUrl, '_blank');
                      }}
                      className="text-purple-300 hover:text-purple-200 text-sm font-medium flex items-center space-x-1 transition-colors hover:bg-purple-400/10 px-2 py-1 rounded-lg"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>Xem trên Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="p-8 sm:p-12">
            <div className="text-center mb-12">
              <div className="inline-block p-[2px] rounded-2xl mb-6 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(212,175,55,0.8)_0%,rgba(255,255,255,0.8)_20%,rgba(212,175,55,0.8)_40%,rgba(184,134,11,0.8)_60%,rgba(241,230,178,0.9)_80%,rgba(212,175,55,0.8)_100%)]">
                <div className="rounded-2xl bg-slate-900/80 p-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-yellow-400/40 shadow-[0_12px_24px_rgba(0,0,0,0.3)] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {guest.name.charAt(0).toUpperCase()}
                  </span>
                  </div>
                </div>
              </div>
              <h3
                className="text-3xl sm:text-4xl font-extrabold text-white mb-3"
                style={{
                  textShadow:
                    '0 0 8px rgba(139,92,246,0.6), 0 0 16px rgba(99,102,241,0.45), 0 0 28px rgba(34,211,238,0.35)'
                }}
              >
                Xin chào {guest.name}!
              </h3>
              <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Bạn được mời tham dự sự kiện đặc biệt kỷ niệm 15 năm thành lập công ty. 
                Chúng tôi rất mong được chào đón bạn!
              </p>
            </div>

            {/* RSVP Status */}
            {guest.rsvp_status === 'pending' && (
              <div className="text-center mb-12">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8">
                  <p className="text-2xl text-white mb-6 font-medium">
                    Vui lòng xác nhận tham dự của bạn
                  </p>
                  <p className="text-gray-300 mb-8">
                    Chúng tôi cần biết bạn có thể tham dự để chuẩn bị tốt nhất cho sự kiện
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 justify-center">
                  <button
                    onClick={() => handleRSVP('accepted')}
                    disabled={submitting}
                    className="group flex items-center justify-center space-x-3 px-10 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 rounded-2xl hover:from-amber-500 hover:to-yellow-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/40"
                  >
                    <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-lg font-bold tracking-wide">Đồng ý tham dự</span>
                  </button>
                  
                  <button
                    onClick={() => handleRSVP('declined')}
                    disabled={submitting}
                    className="group flex items-center justify-center space-x-3 px-10 py-4 border-2 border-white/60 text-gray-800 bg-white rounded-2xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow"
                  >
                    <XCircle size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-lg font-semibold">Từ chối</span>
                  </button>
                </div>
              </div>
            )}

            {guest.rsvp_status === 'accepted' && (
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 px-8 py-4 bg-green-500/10 text-green-300 rounded-2xl mb-8 border border-green-400/30">
                  <CheckCircle size={24} />
                  <span className="text-xl font-bold">Đã xác nhận tham dự</span>
                </div>
                
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8">
                  <p className="text-xl text-white mb-6 font-medium">
                    🎉 Cảm ơn bạn đã xác nhận tham dự!
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Vui lòng lưu QR code bên dưới để check-in tại sự kiện. 
                    Đây là mã duy nhất của bạn và không thể thay thế.
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-slate-800/60 p-8 sm:p-10 rounded-3xl shadow-xl border border-yellow-500/20">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-white mb-2">
                      QR Code Check-in
                    </h4>
                    <p className="text-gray-300">
                      Mã QR cá nhân của bạn
                    </p>
                  </div>
                  
                  <div className="flex justify-center mb-8">
                    {guest.qr_image_url ? (
                      <div className="relative">
                        <img
                          src={`${guest.qr_image_url}`}
                          alt="QR Code"
                          className="w-64 h-64 border-4 border-yellow-400/40 rounded-2xl shadow-lg bg-white"
                          onError={(e) => {
                            console.error('Lỗi tải QR code:', e);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle size={16} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-64 h-64 bg-gray-200 rounded-2xl flex flex-col items-center justify-center">
                        <QrCode size={64} className="text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500">Đang tải QR code...</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700 font-medium">
                      📱 Đưa QR code này cho nhân viên check-in tại sự kiện
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => {
                          if (guest.qr_image_url) {
                            const link = document.createElement('a');
                            link.href = `${guest.qr_image_url}`;
                            link.download = `qr_code_${guest.name}.png`;
                            link.click();
                          }
                        }}
                        className="group flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Download size={20} />
                        <span className="font-semibold">Tải xuống QR Code</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (guest.qr_image_url) {
                            navigator.share({
                              title: `QR Code Check-in - ${guest.name}`,
                              text: `QR Code check-in cho sự kiện ${event.name}`,
                              url: `${guest.qr_image_url}`
                            }).catch(() => {
                              // Fallback nếu không hỗ trợ Web Share API
                              navigator.clipboard.writeText(`${guest.qr_image_url}`);
                              alert('Đã sao chép link QR code!');
                            });
                          }
                        }}
                        className="group flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Share2 size={20} />
                        <span className="font-semibold">Chia sẻ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {guest.rsvp_status === 'declined' && (
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 px-8 py-4 bg-red-500/10 text-red-300 rounded-2xl mb-8 border border-red-400/30">
                  <XCircle size={24} />
                  <span className="text-xl font-bold">Đã từ chối lời mời</span>
                </div>
                <div className="bg-slate-800/60 p-8 rounded-3xl border border-white/10">
                  <p className="text-xl text-white mb-4">
                    😔 Rất tiếc vì bạn không thể tham dự
                  </p>
                  <p className="text-gray-300">
                    Cảm ơn bạn đã phản hồi! Chúng tôi hy vọng có cơ hội gặp bạn trong các sự kiện tiếp theo.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-slate-800/60 p-8 rounded-3xl border border-yellow-500/20">
              <h4 className="text-2xl font-bold text-white mb-6 text-center">
                📞 Thông tin liên hệ
              </h4>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Phone size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Điện thoại</p>
                    <p className="font-semibold text-white">0961627396</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Email</p>
                    <p className="font-semibold text-white">namnam281205@gmail.com</p>
                  </div>
                </div>
                {guest.email && guest.email !== 'namnam281205@gmail.com' && (
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20 md:col-span-2">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Mail size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Email khách mời</p>
                      <p className="font-semibold text-white">{guest.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h5 className="text-xl font-bold text-white mb-4">
              🎊 Chúng tôi rất mong được gặp bạn!
            </h5>
            <p className="text-gray-300 leading-relaxed">
              Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi. 
              Chúng tôi sẵn sàng hỗ trợ bạn mọi lúc.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invitation;
