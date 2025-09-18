import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getInvitationByToken, getEvent, getGuestQR, updateGuestRSVP } from '../services/api';
import { CheckCircle, XCircle, QrCode, Download, Share2 } from 'lucide-react';
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
}

const InvitationPublic: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qrBust, setQrBust] = useState<number>(Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        if (!token) {
          toast.error('Thiếu token thiệp mời');
          setLoading(false);
          return;
        }
        const g = await getInvitationByToken(token);
        setGuest(g);
        if (g?.event_id) {
          const ev = await getEvent(g.event_id);
          setEvent(ev);
        }
        // Ensure QR exists
        try {
          if (!g.qr_image_url) {
            const qr = await getGuestQR(g.id);
            if (qr?.qr_image_url) {
              setGuest((prev) => (prev ? { ...prev, qr_image_url: qr.qr_image_url, qr_code: qr.qr_data } : prev));
              setQrBust(Date.now());
            }
          }
        } catch {}
      } catch (e: any) {
        toast.error(e?.response?.data?.detail || 'Link thiệp mời không hợp lệ/đã hết hạn');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleRSVP = async (status: 'accepted' | 'declined') => {
    if (!guest) return;
    setSubmitting(true);
    try {
      await updateGuestRSVP(guest.id, { rsvp_status: status });
      let updated = { ...guest, rsvp_status: status } as Guest;
      if (status === 'accepted') {
        try {
          const qrResp = await getGuestQR(guest.id);
          if (qrResp?.qr_image_url) {
            updated = { ...updated, qr_image_url: qrResp.qr_image_url, qr_code: qrResp.qr_data };
          }
        } catch {}
      }
      setGuest(updated);
      toast.success(status === 'accepted' ? 'Đã xác nhận tham dự!' : 'Đã từ chối lời mời');
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">Đang tải thiệp mời...</div>
      </div>
    );
  }

  if (!guest || !event) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <div>Link thiệp mời không hợp lệ hoặc đã hết hạn</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[radial-gradient(1200px_800px_at_50%_-200px,rgba(27,36,84,1)_0%,rgba(21,15,46,1)_50%,rgba(10,10,26,1)_100%)]">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-yellow-500/10 to-amber-500/0 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tr from-fuchsia-500/10 to-purple-500/0 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 relative z-10">
        {/* Header - match internal invitation */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[conic-gradient(from_180deg_at_50%_50%,#6d28d9_0%,#22d3ee_25%,#8b5cf6_50%,#22d3ee_75%,#6d28d9_100%)] p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.35)]">
                <ExpLogoImage size="sm" showText={false} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">EXP TECHNOLOGY</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-300 mt-2">Từ Thái Nguyên vươn xa, 15 năm thành lập</p>
          <div className="relative w-40 mx-auto mt-3">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]"></div>
          </div>
        </div>

        {/* Main Card - match internal layout widths */}
        <div className="w-full mx-auto bg-slate-900/70 text-white backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-yellow-500/20 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <div className="p-6 sm:p-10">
            <div className="text-center mb-10 sm:mb-12">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 sm:mb-3">Kính gửi {guest.name}!</h3>
              <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Chúng tôi rất vinh dự khi được cùng bạn tham gia sự kiện thành lập 10/10/2010 - 10/10/2025.
              </p>
            </div>

            {guest.rsvp_status === 'pending' && (
              <div className="text-center mb-10 sm:mb-12">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8">
                  <p className="text-2xl text-white mb-6 font-medium">Vui lòng xác nhận tham dự của bạn</p>
                  <p className="text-gray-300 mb-8">Chúng tôi cần biết bạn có thể tham dự để chuẩn bị tốt nhất cho sự kiện</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 justify-center">
                  <button onClick={() => handleRSVP('accepted')} disabled={submitting} className="group flex items-center justify-center space-x-3 px-10 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 rounded-2xl hover:from-amber-500 hover:to-yellow-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/40">
                    <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-lg font-bold tracking-wide">Xác nhận tham dự</span>
                  </button>
                  <button onClick={() => handleRSVP('declined')} disabled={submitting} className="group flex items-center justify-center space-x-3 px-10 py-4 border-2 border-white/60 text-gray-800 bg-white rounded-2xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow">
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

                <div className="bg-slate-800/60 p-6 sm:p-10 rounded-3xl shadow-xl border border-yellow-500/20">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-white mb-2">QR Code Check-in</h4>
                    <p className="text-gray-300">Mã QR cá nhân của bạn</p>
                  </div>
                  <div className="flex justify-center mb-6 sm:mb-8">
                    {guest.qr_image_url ? (
                      <div className="relative">
                        <img
                          src={encodeURI(`${guest.qr_image_url}?v=${qrBust}`)}
                          alt="QR Code"
                          className="w-56 h-56 sm:w-64 sm:h-64 border-4 border-yellow-400/40 rounded-2xl shadow-lg bg-white"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle size={16} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-56 h-56 sm:w-64 sm:h-64 bg-gray-200 rounded-2xl flex flex-col items-center justify-center">
                        <QrCode size={64} className="text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500">Đang tải QR code...</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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
                          navigator.share?.({ title: `QR Code Check-in - ${guest.name}`, url: `${guest.qr_image_url}` })
                            .catch(() => {
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
            )}

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-10">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
                  <h5 className="text-white font-semibold text-sm sm:text-base bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent" style={{textShadow: '0 0 12px rgba(56,189,248,0.6), 0 0 24px rgba(56,189,248,0.4)'}}>Thời gian & Địa điểm</h5>
                </div>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                    <span className="font-bold text-white text-base sm:text-lg tracking-wide" style={{ textShadow: '0 0 10px rgba(56,189,248,0.6), 0 0 20px rgba(56,189,248,0.3)' }}>
                      {event.event_date ? new Date(event.event_date).toLocaleString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Thứ Sáu, 15 tháng 12, 2024 lúc 18:00'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="mt-1 text-indigo-300">●</span>
                    <span>{event.location || 'Nhà hàng/Trung tâm Hội nghị'}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                  <h5 className="text-white font-semibold text-sm sm:text-base bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent" style={{textShadow: '0 0 12px rgba(99,102,241,0.6), 0 0 24px rgba(99,102,241,0.4)'}}>Chương trình</h5>
                </div>
                <ul className="space-y-2">
                  <li className="grid grid-cols-[54px_1fr] gap-3 text-sm sm:text-base">
                    <span className="text-indigo-300 font-semibold text-right pr-1">18:00</span>
                    <span className="text-gray-300">Check-in đón khách</span>
                  </li>
                  <li className="grid grid-cols-[54px_1fr] gap-3 text-sm sm:text-base">
                    <span className="text-indigo-300 font-semibold text-right pr-1">18:30</span>
                    <span className="text-gray-300">Khai mạc</span>
                  </li>
                  <li className="grid grid-cols-[54px_1fr] gap-3 text-sm sm:text-base">
                    <span className="text-indigo-300 font-semibold text-right pr-1">19:00</span>
                    <span className="text-gray-300">Tiệc & Giao lưu</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Lưu ý - match internal invitation */}
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

export default InvitationPublic;


