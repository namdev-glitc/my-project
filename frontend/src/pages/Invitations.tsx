import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Mail, 
  Eye, 
  QrCode,
  Share2
} from 'lucide-react';
import { getGuests, getEvents } from '../services/api';
import QRCodeModal from '../components/guests/QRCodeModal';
import CountdownTimer from '../components/CountdownTimer';
import toast from 'react-hot-toast';

const Invitations: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  // const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);


  const { data: guests, isLoading: guestsLoading } = useQuery('guests', getGuests);
  const { data: events, isLoading: eventsLoading } = useQuery('events', getEvents);

  // const generateInvitation = async (guestId: number) => {
  //   setIsGenerating(true);
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/invitations/generate/${guestId}`);
  //     const data = await response.json();
      
  //     if (response.ok) {
  //       if (data.already_exists) {
  //         // Mở thiệp mời đã có sẵn
  //         const url = `http://localhost:8000${data.download_url || '/invitations/' + data.filename}`;
  //         window.open(url, '_blank');
  //         toast(`Tôi đã có thiệp mời rồi`, { icon: 'ℹ️' });
  //       } else {
  //         setPreviewData(data);
  //         toast.success('Tạo thiệp mời thành công!');
  //       }
  //     } else {
  //       toast.error('Lỗi tạo thiệp mời!');
  //     }
  //   } catch (error) {
  //     toast.error('Lỗi tạo thiệp mời!');
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // const generateAllInvitations = async () => {
  //   setIsGenerating(true);
  //   try {
  //     const response = await fetch('http://localhost:8000/api/invitations/generate-all');
  //     const data = await response.json();
      
  //     if (response.ok) {
  //       toast.success(`Đã tạo ${data.invitations.length} thiệp mời!`);
  //     } else {
  //       toast.error('Lỗi tạo thiệp mời!');
  //     }
  //   } catch (error) {
  //     toast.error('Lỗi tạo thiệp mời!');
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // const downloadInvitation = async (guestId: number) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/invitations/download/${guestId}`);
  //     const data = await response.json();
      
  //     if (response.ok) {
  //       // Tạo link download
  //       const link = document.createElement('a');
  //       link.href = `http://localhost:8000/invitations/${data.filename}`;
  //       link.download = data.filename;
  //       link.click();
  //       toast.success('Tải xuống thành công!');
  //     } else {
  //       toast.error('Lỗi tải xuống!');
  //     }
  //   } catch (error) {
  //     toast.error('Lỗi tải xuống!');
  //   }
  // };

  const previewTemplate = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/invitations/preview');
      const data = await response.json();
      
      if (response.ok) {
        setPreviewData(data);
        toast.success('Tải mẫu thiệp mời thành công!');
      } else {
        toast.error('Lỗi tải mẫu!');
      }
    } catch (error) {
      toast.error('Lỗi tải mẫu!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Thiệp mời</h1>
          <p className="text-gray-400 mt-2">
            Tạo và quản lý thiệp mời cho khách mời
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={previewTemplate}
            className="btn-exp flex items-center space-x-2"
          >
            <Eye size={20} />
            <span>Xem mẫu</span>
          </button>
          <button
            onClick={() => toast.error('Tính năng tạo tất cả đang tạm khóa')}
            disabled
            className="btn-exp flex items-center space-x-2 disabled:opacity-50"
          >
            <Mail size={20} />
            <span>Tạo tất cả (đã khóa)</span>
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {previewData && (
        <div className="card-exp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Xem trước thiệp mời
            </h3>
            <button
              onClick={() => setPreviewData(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div 
              dangerouslySetInnerHTML={{ __html: previewData.html_content }}
              style={{ maxHeight: '600px', overflow: 'auto' }}
            />
          </div>
        </div>
      )}

      {/* Guest Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guests List */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Chọn khách mời
          </h3>
          
          {guestsLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-600 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {guests?.map((guest: any) => (
                <div
                  key={guest.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedGuest?.id === guest.id
                      ? 'bg-exp-gradient text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedGuest(guest)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {guest.title} {guest.name}
                      </p>
                      <p className="text-sm opacity-75">
                        {guest.organization || 'Chưa có tổ chức'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.error('Tính năng tạo thiệp mời đang tạm khóa');
                        }}
                        className="p-2 rounded-lg bg-blue-600 opacity-60 cursor-not-allowed text-white"
                        disabled
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const invitationLink = `${window.location.origin}/invitation/${guest.id}`;
                          navigator.clipboard.writeText(invitationLink).then(() => {
                            toast.success(`Đã copy link thiệp mời của ${guest.name}`);
                          }).catch(() => {
                            // Fallback nếu không hỗ trợ clipboard
                            const textArea = document.createElement('textarea');
                            textArea.value = invitationLink;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            toast.success(`Đã copy link thiệp mời của ${guest.name}`);
                          });
                        }}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Countdown Timer */}
        {selectedEvent && (
          <CountdownTimer
            eventDate={selectedEvent.event_date}
            eventName={selectedEvent.name}
            eventLocation={selectedEvent.location}
            variant="invitation"
            className="mb-6"
          />
        )}

        {/* Event Info */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Thông tin sự kiện
          </h3>
          
          {eventsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2"></div>
              <div className="h-4 bg-gray-600 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {events?.map((event: any) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedEvent?.id === event.id
                      ? 'bg-exp-gradient text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <h4 className="font-semibold mb-2">{event.name}</h4>
                  <div className="space-y-1 text-sm opacity-75">
                    <p>📅 {new Date(event.event_date).toLocaleDateString('vi-VN')}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {guests?.filter((g: any) => g.event_id === event.id).length || 0} khách mời</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invitation Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-exp text-center">
          <div className="w-16 h-16 bg-exp-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Tạo thiệp mời</h3>
          <p className="text-gray-400 text-sm mb-4">
            Tạo thiệp mời HTML đẹp mắt cho từng khách mời
          </p>
          <button
            onClick={() => toast.error('Tính năng tạo thiệp mời đang tạm khóa')}
            disabled
            className="btn-exp w-full disabled:opacity-50"
          >
            Tạo thiệp mời (đã khóa)
          </button>
        </div>

        <div className="card-exp text-center">
          <div className="w-16 h-16 bg-exp-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye size={24} className="text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Xem thiệp mời</h3>
          <p className="text-gray-400 text-sm mb-4">
            Hiển thị thiệp mời HTML của khách đã chọn
          </p>
          <button
            onClick={() => {
              if (selectedGuest) {
                const eventQuery = selectedEvent?.id ? `?event=${selectedEvent.id}` : '';
                navigate(`/invitation/${selectedGuest.id}${eventQuery}`);
              } else {
                toast.error('Vui lòng chọn khách mời trước!');
              }
            }}
            className="btn-exp w-full"
          >
            Xem thiệp mời
          </button>
        </div>

        <div className="card-exp text-center">
          <div className="w-16 h-16 bg-exp-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode size={24} className="text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">QR Code</h3>
          <p className="text-gray-400 text-sm mb-4">
            Tích hợp QR code để check-in tại sự kiện
          </p>
          <button
            onClick={() => {
              if (selectedGuest) {
                setShowQR(true);
              } else {
                toast.error('Vui lòng chọn khách mời trước!');
              }
            }}
            className="btn-exp w-full"
          >
            Xem QR Code
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && selectedGuest && (
        <QRCodeModal
          guest={selectedGuest}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Template Info */}
      <div className="card-exp">
        <h3 className="text-lg font-semibold text-white mb-4">
          Mẫu thiệp mời
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Tính năng</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✅ Thiết kế responsive, đẹp mắt</li>
              <li>✅ Tích hợp QR code check-in</li>
              <li>✅ Nút RSVP trực tiếp</li>
              <li>✅ Thông tin sự kiện chi tiết</li>
              <li>✅ Chương trình sự kiện</li>
              <li>✅ Branding EXP Technology</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Cách sử dụng</h4>
            <ol className="space-y-2 text-gray-300 text-sm">
              <li>1. Chọn khách mời từ danh sách</li>
              <li>2. Nhấn "Tạo thiệp mời"</li>
              <li>3. Xem trước thiệp mời</li>
              <li>4. Tải xuống file HTML</li>
              <li>5. Gửi qua email cho khách mời</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invitations;


