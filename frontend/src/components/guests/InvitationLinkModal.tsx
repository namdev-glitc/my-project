import React, { useState, useEffect } from 'react';
import { X, Copy, Mail, MessageSquare, Share2, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateInviteLink } from '../../services/api';

interface InvitationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  } | null;
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
  };
}

const InvitationLinkModal: React.FC<InvitationLinkModalProps> = ({
  isOpen,
  onClose,
  guest,
  event
}) => {
  const [copied, setCopied] = useState(false);
  
  // Handle modal open/close effects
  React.useEffect(() => {
    if (isOpen) {
      // Scroll to top when modal opens
      window.scrollTo(0, 0);
    }
  }, [isOpen]);
  
  const [invitationLink, setInvitationLink] = useState<string>('');

  useEffect(() => {
    const build = async () => {
      if (!guest) return;
      try {
        const { url } = await generateInviteLink(guest.id);
        const base = window.location.origin;
        // Nếu API trả về path tương đối, nối với origin
        setInvitationLink(url.startsWith('http') ? url : `${base}${url}`);
      } catch (e: any) {
        // Fallback tạm thời: dùng route cũ theo ID (cần đăng nhập)
        setInvitationLink(`${window.location.origin}/invitation/${guest.id}?event=${event.id}`);
      }
    };
    build();
  }, [guest, event]);
 
  // Kiểm tra guest và event có tồn tại không (sau khi khai báo hooks)
  if (!guest || !event) {
    return null;
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast.success('Đã sao chép link mời!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = invitationLink;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        toast.success('Đã sao chép link mời!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Không thể sao chép link');
      }
    }
  };

  const sendEmail = () => {
    const subject = `EXP TECHNOLOGY - ${event.name}`;
    const body = `Xin chào ${guest.name},\n\nBạn được mời tham dự sự kiện "${event.name}" vào ngày ${event.date} tại ${event.location}.\n\nVui lòng xác nhận tham dự tại link: ${invitationLink}\n\nTrân trọng!`;
    
    const mailtoLink = `mailto:${guest.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const sendSMS = () => {
    const message = `Xin chào ${guest.name}, bạn được mời tham dự "${event.name}" vào ${event.date} tại ${event.location}. Xác nhận tại: ${invitationLink}`;
    const smsLink = `sms:${guest.phone || ''}?body=${encodeURIComponent(message)}`;
    window.open(smsLink);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-top bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-2xl sm:w-full" style={{marginTop: '20px'}}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                📧 Gửi thiệp mời
              </h3>
              <p className="text-blue-100">
                Gửi lời mời tham dự cho {guest.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Thông tin sự kiện */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4">{event.name}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">{event.date}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Link mời */}
          <div>
            <label className="block text-xl font-bold text-gray-900 mb-4">
              🔗 Link mời tham dự
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={invitationLink}
                readOnly
                className="flex-1 px-6 py-4 border-2 border-blue-300 rounded-xl text-lg font-bold bg-blue-50 text-blue-900 focus:border-blue-500 focus:outline-none shadow-lg"
                style={{ 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  backgroundColor: '#eff6ff'
                }}
              />
              <button
                onClick={copyToClipboard}
                className={`px-6 py-4 rounded-xl text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  copied
                    ? 'bg-green-500 text-white border-2 border-green-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-600'
                }`}
              >
                <Copy size={20} />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <CheckCircle size={16} className="mr-1" />
                Đã sao chép link!
              </p>
            )}
          </div>

          {/* Các cách gửi */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">📤 Các cách gửi thiệp mời</h4>
            <div className="grid gap-4">
              {guest.email && (
                <button
                  onClick={sendEmail}
                  className="group flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-900 text-lg">Email</p>
                    <p className="text-gray-600">{guest.email}</p>
                    <p className="text-sm text-blue-600 mt-1">Mở ứng dụng email</p>
                  </div>
                </button>
              )}

              {guest.phone && (
                <button
                  onClick={sendSMS}
                  className="group flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MessageSquare className="text-green-600" size={24} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-900 text-lg">SMS</p>
                    <p className="text-gray-600">{guest.phone}</p>
                    <p className="text-sm text-green-600 mt-1">Mở ứng dụng tin nhắn</p>
                  </div>
                </button>
              )}

              <button
                onClick={copyToClipboard}
                className="group flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Share2 className="text-purple-600" size={24} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-gray-900 text-lg">Sao chép link</p>
                  <p className="text-gray-600">Chia sẻ qua ứng dụng khác</p>
                  <p className="text-sm text-purple-600 mt-1">Sao chép vào clipboard</p>
                </div>
              </button>
            </div>
          </div>

        </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 rounded-b-3xl">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationLinkModal;
