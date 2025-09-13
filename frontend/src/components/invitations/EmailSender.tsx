import React, { useState } from 'react';
import { Mail, Send, Users, Clock, CheckCircle, AlertCircle, X, Eye, Edit, FileText, QrCode } from 'lucide-react';

interface EmailSenderProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGuests: any[];
  event?: any;
  template: any;
  customization: any;
  onSend: (emailData: EmailData) => void;
}

interface EmailData {
  subject: string;
  message: string;
  sendTo: 'selected' | 'all';
  schedule: 'now' | 'scheduled';
  scheduledTime?: string;
  includePDF: boolean;
  includeQR: boolean;
  reminder: boolean;
  reminderDays: number;
}

const EmailSender: React.FC<EmailSenderProps> = ({
  isOpen,
  onClose,
  selectedGuests,
  event,
  template,
  customization,
  onSend
}) => {
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState<EmailData>({
    subject: `Thiệp mời: ${event?.name || 'Sự kiện'}`,
    message: `Xin chào,\n\nChúng tôi trân trọng kính mời bạn tham dự sự kiện của chúng tôi.\n\nChi tiết sự kiện:\n- Tên: ${event?.name || 'Sự kiện'}\n- Ngày: ${event?.event_date || 'Chưa xác định'}\n- Thời gian: ${event?.event_time || 'Chưa xác định'}\n- Địa điểm: ${event?.location || 'Chưa xác định'}\n\nVui lòng xác nhận tham dự.\n\nTrân trọng,\n${event?.organization || 'EXP Technology'}`,
    sendTo: 'selected',
    schedule: 'now',
    scheduledTime: '',
    includePDF: true,
    includeQR: true,
    reminder: true,
    reminderDays: 3
  });

  const [previewMode, setPreviewMode] = useState<'email' | 'invitation'>('email');

  const handleSend = async () => {
    setIsSending(true);
    
    try {
      // Simulate sending emails
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Call the actual send function
      onSend(emailData);
      
      // Close modal after successful send
      onClose();
    } catch (error) {
      console.error('Error sending emails:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getRecipientCount = () => {
    return emailData.sendTo === 'selected' ? selectedGuests.length : 'Tất cả khách mời';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-500" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gửi thiệp mời qua email</h3>
                <p className="text-sm text-gray-500">
                  Gửi cho {getRecipientCount()} người nhận
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Preview Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('email')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  previewMode === 'email'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail size={16} />
                <span>Nội dung email</span>
              </button>
              <button
                onClick={() => setPreviewMode('invitation')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  previewMode === 'invitation'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye size={16} />
                <span>Thiệp mời</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Content */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Nội dung email</h4>
                
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề email
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung email
                  </label>
                  <textarea
                    rows={8}
                    value={emailData.message}
                    onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Người nhận
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sendTo"
                        value="selected"
                        checked={emailData.sendTo === 'selected'}
                        onChange={(e) => setEmailData(prev => ({ ...prev, sendTo: e.target.value as any }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="ml-2 text-sm">Chỉ khách mời đã chọn ({selectedGuests.length} người)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sendTo"
                        value="all"
                        checked={emailData.sendTo === 'all'}
                        onChange={(e) => setEmailData(prev => ({ ...prev, sendTo: e.target.value as any }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="ml-2 text-sm">Tất cả khách mời</span>
                    </label>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lịch gửi
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="schedule"
                        value="now"
                        checked={emailData.schedule === 'now'}
                        onChange={(e) => setEmailData(prev => ({ ...prev, schedule: e.target.value as any }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="ml-2 text-sm">Gửi ngay</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="schedule"
                        value="scheduled"
                        checked={emailData.schedule === 'scheduled'}
                        onChange={(e) => setEmailData(prev => ({ ...prev, schedule: e.target.value as any }))}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="ml-2 text-sm">Lên lịch gửi</span>
                    </label>
                    {emailData.schedule === 'scheduled' && (
                      <input
                        type="datetime-local"
                        value={emailData.scheduledTime}
                        onChange={(e) => setEmailData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="ml-6 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Xem trước</h4>
                
                {previewMode === 'email' ? (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <strong>Đến:</strong> {emailData.sendTo === 'selected' ? `${selectedGuests.length} người` : 'Tất cả khách mời'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Tiêu đề:</strong> {emailData.subject}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Nội dung:</strong>
                      </div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border">
                        {emailData.message}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div 
                      className="w-full aspect-[4/3] rounded-lg overflow-hidden shadow-sm"
                      style={{
                        backgroundColor: customization.secondaryColor,
                        color: customization.primaryColor,
                        fontFamily: customization.fontFamily
                      }}
                    >
                      <div className="p-4 h-full flex flex-col justify-center items-center text-center">
                        <h3 className="text-lg font-bold mb-2">
                          {event?.name || 'Sự kiện mặc định'}
                        </h3>
                        <p className="text-sm mb-4">
                          {event?.organization || 'EXP Technology'}
                        </p>
                        <div className="text-xs space-y-1">
                          <p>{event?.event_date || 'Ngày sự kiện'}</p>
                          <p>{event?.event_time || 'Thời gian'}</p>
                          <p>{event?.location || 'Địa điểm'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Tệp đính kèm</h5>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="text-red-500" size={16} />
                      <span className="text-sm">Thiệp mời PDF</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailData.includePDF}
                      onChange={(e) => setEmailData(prev => ({ ...prev, includePDF: e.target.checked }))}
                      className="w-4 h-4 text-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <QrCode className="text-blue-500" size={16} />
                      <span className="text-sm">QR Code</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailData.includeQR}
                      onChange={(e) => setEmailData(prev => ({ ...prev, includeQR: e.target.checked }))}
                      className="w-4 h-4 text-blue-500"
                    />
                  </div>
                </div>

                {/* Reminder Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Nhắc nhở RSVP</div>
                      <div className="text-xs text-gray-500">Gửi email nhắc nhở nếu chưa phản hồi</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailData.reminder}
                      onChange={(e) => setEmailData(prev => ({ ...prev, reminder: e.target.checked }))}
                      className="w-4 h-4 text-blue-500"
                    />
                  </div>

                  {emailData.reminder && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gửi nhắc nhở sau (ngày)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={emailData.reminderDays}
                        onChange={(e) => setEmailData(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200">
                <Edit size={16} />
                <span>Chỉnh sửa</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200">
                <Eye size={16} />
                <span>Xem trước</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-all duration-200"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Gửi email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSender;
