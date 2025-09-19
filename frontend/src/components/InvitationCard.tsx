import React from 'react';
import ExpLogoImage from './ExpLogoImage';
import { Calendar, CheckCircle, XCircle, QrCode, Download, Share2, Mail, Phone } from 'lucide-react';

export interface GuestData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  rsvp_status?: 'pending' | 'accepted' | 'declined';
  qr_code?: string;
  qr_image_url?: string;
}

export interface EventData {
  id: number;
  name: string;
  description?: string;
  event_date?: string;
  location?: string;
}

interface InvitationCardProps {
  guest: GuestData;
  event: EventData;
  submitting?: boolean;
  qrBust?: number;
  onRSVP?: (status: 'accepted' | 'declined') => void;
  onQrError?: () => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ guest, event, submitting = false, qrBust = Date.now(), onRSVP, onQrError }) => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[radial-gradient(1200px_800px_at_50%_-200px,rgba(27,36,84,1)_0%,rgba(21,15,46,1)_50%,rgba(10,10,26,1)_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-yellow-500/10 to-amber-500/0 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tr from-fuchsia-500/10 to-purple-500/0 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[conic-gradient(from_180deg_at_50%_50%,#6d28d9_0%,#22d3ee_25%,#8b5cf6_50%,#22d3ee_75%,#6d28d9_100%)] p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.35)]">
                <ExpLogoImage size="sm" showText={false} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">TECHNOLOGY</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-300 mt-2">Từ Thái Nguyên vươn xa, 15 năm thành lập</p>
          <div className="relative w-40 mx-auto mt-3">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full mx-auto bg-slate-900/70 text-white backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-yellow-500/20 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <div className="p-6 sm:p-10">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-block p-[2px] rounded-2xl mb-6 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(212,175,55,0.8)_0%,rgba(255,255,255,0.8)_20%,rgba(212,175,55,0.8)_40%,rgba(184,134,11,0.8)_60%,rgba(241,230,178,0.9)_80%,rgba(212,175,55,0.8)_100%)]">
                <div className="rounded-2xl bg-slate-900/80 p-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-yellow-400/40 shadow-[0_12px_24px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{guest.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 sm:mb-3" style={{ textShadow: '0 0 8px rgba(139,92,246,0.6), 0 0 16px rgba(99,102,241,0.45), 0 0 28px rgba(34,211,238,0.35)' }}>
                Kính gửi : {guest.name}!
              </h3>
              <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                Chúng tôi rất vinh dự khi được cùng bạn tham gia sự kiện thành lập 10/10/2010 - 10/10/2025.
              </p>
            </div>

            {/* RSVP */}
            {guest.rsvp_status === 'pending' && (
              <div className="text-center mb-10 sm:mb-12">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8">
                  <p className="text-2xl text-white mb-6 font-medium">Vui lòng xác nhận tham dự của bạn</p>
                  <p className="text-gray-300 mb-8">Chúng tôi cần biết bạn có thể tham dự để chuẩn bị tốt nhất cho sự kiện</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 justify-center">
                  <button onClick={() => onRSVP?.('accepted')} disabled={submitting} className="group flex items-center justify-center gap-3 px-12 py-4 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-900 font-bold tracking-wide shadow-[0_10px_30px_rgba(251,191,36,0.35)] ring-1 ring-yellow-300/40 hover:shadow-[0_12px_36px_rgba(251,191,36,0.45)] hover:translate-y-[-1px] transition-all disabled:opacity-50">
                    <CheckCircle size={22} className="shrink-0" />
                    <span className="text-lg">Xác nhận tham dự</span>
                  </button>
                  <button onClick={() => onRSVP?.('declined')} disabled={submitting} className="group flex items-center justify-center gap-3 px-12 py-4 rounded-3xl bg-white text-slate-800 font-semibold ring-1 ring-white/70 shadow-[0_6px_18px_rgba(0,0,0,0.12)] hover:bg-gray-50 hover:ring-white transition-all disabled:opacity-50">
                    <XCircle size={20} className="shrink-0" />
                    <span className="text-lg">Từ chối</span>
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
                          onError={onQrError}
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
                </div>
              </div>
            )}

            {/* Time & Program */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-10">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
                  <h5 className="text-white font-semibold text-sm sm:text-base bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent" style={{ textShadow: '0 0 12px rgba(56,189,248,0.6), 0 0 24px rgba(56,189,248,0.4)' }}>Thời gian & Địa điểm</h5>
                </div>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                    <Calendar className="w-5 h-5 text-sky-300 flex-shrink-0" />
                    <span className="font-bold text-white text-base sm:text-lg tracking-wide" style={{ textShadow: '0 0 10px rgba(56,189,248,0.6), 0 0 20px rgba(56,189,248,0.3)' }}>
                      {event.event_date ? new Date(event.event_date).toLocaleString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Thứ Sáu, 15 tháng 12, 2024 lúc 18:00'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="mt-1 text-indigo-300">●</span>
                    <span>{event.location || 'Nhà hàng/Trung tâm Hội nghị'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-purple-300">●</span>
                    <button
                      onClick={() => {
                        const location = event.location || 'Trung tâm Hội nghị Quốc gia';
                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
                        window.open(url, '_blank');
                      }}
                      className="text-purple-300 hover:text-purple-200 underline underline-offset-2"
                    >
                      Xem trên Google Maps
                    </button>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                  <h5 className="text-white font-semibold text-sm sm:text-base bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent" style={{ textShadow: '0 0 12px rgba(99,102,241,0.6), 0 0 24px rgba(99,102,241,0.4)' }}>Chương trình</h5>
                </div>
                <ul className="space-y-2">
                  <li className="grid grid-cols-[54px_1fr] gap-3 text-sm sm:text-base"><span className="text-indigo-300 font-semibold text-right pr-1">18:00</span><span className="text-gray-300">Check-in đón khách</span></li>
                  <li className="grid grid-cols-[54px_1fr] gap-3 text-sm sm:text-base"><span className="text-indigo-300 font-semibold text-right pr-1">18:30</span><span className="text-gray-300">Khai mạc</span></li>
                  <li className="grid grid-cols-[54px_1fr] gap-3 text-sm sm:text-base"><span className="text-indigo-300 font-semibold text-right pr-1">19:00</span><span className="text-gray-300">Tiệc & Giao lưu</span></li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-slate-800/60 p-6 sm:p-8 rounded-3xl border border-yellow-500/20">
              <h4 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" style={{ textShadow: '0 0 16px rgba(251,191,36,0.7), 0 0 32px rgba(251,191,36,0.5)' }}>📞 Thông tin liên hệ</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"><Phone size={20} className="text-green-400" /></div>
                  <div>
                    <p className="text-sm text-gray-300">Điện thoại</p>
                    <p className="font-semibold text-white">0961627396</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center"><Mail size={20} className="text-blue-400" /></div>
                  <div>
                    <p className="text-sm text-gray-300">Email</p>
                    <p className="font-semibold text-white">namnam281205@gmail.com</p>
                  </div>
                </div>
                {guest.email && guest.email !== 'namnam281205@gmail.com' && (
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20 md:col-span-2">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center"><Mail size={20} className="text-purple-400" /></div>
                    <div>
                      <p className="text-sm text-gray-300">Email khách mời</p>
                      <p className="font-semibold text-white text-sm sm:text-base break-words">{guest.email}</p>
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
            <h5 className="text-xl font-bold text-white mb-4">🎊 Chúng tôi rất mong được gặp bạn!</h5>
            <p className="text-gray-300 leading-relaxed">Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi. Chúng tôi sẵn sàng hỗ trợ bạn mọi lúc.</p>
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

export default InvitationCard;


