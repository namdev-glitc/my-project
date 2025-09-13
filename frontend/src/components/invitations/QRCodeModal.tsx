import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Copy, QrCode, Smartphone, Monitor, Tablet } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  guest?: any;
  invitationUrl?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  event,
  guest,
  invitationUrl
}) => {
  const [qrSize, setQrSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [qrCode, setQrCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR Code URL
  const generateQRUrl = () => {
    if (invitationUrl) return invitationUrl;
    
    const baseUrl = window.location.origin;
    const eventId = event?.id || 'default';
    const guestId = guest?.id || 'all';
    
    return `${baseUrl}/invitation/${eventId}/${guestId}`;
  };

  // Generate QR Code using a simple method (in real app, use a QR library)
  const generateQRCode = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate QR code generation
      const qrUrl = generateQRUrl();
      
      // In a real app, you would use a QR code library like qrcode.js
      // For now, we'll create a simple visual representation
      const qrData = {
        url: qrUrl,
        event: event?.name || 'Sự kiện',
        guest: guest?.name || 'Khách mời',
        timestamp: new Date().toISOString()
      };
      
      // Simulate API call to generate QR code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a data URL of a simple QR-like pattern
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = qrSize === 'small' ? 200 : qrSize === 'medium' ? 300 : 400;
      
      canvas.width = size;
      canvas.height = size;
      
      if (ctx) {
        // Create a simple QR-like pattern
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, size);
        
        // Add white squares (simplified QR pattern)
        const squareSize = size / 25;
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
            }
          }
        }
        
        // Add corner markers
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, squareSize * 7, squareSize * 7);
        ctx.fillRect(size - squareSize * 7, 0, squareSize * 7, squareSize * 7);
        ctx.fillRect(0, size - squareSize * 7, squareSize * 7, squareSize * 7);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(squareSize, squareSize, squareSize * 5, squareSize * 5);
        ctx.fillRect(size - squareSize * 6, squareSize, squareSize * 5, squareSize * 5);
        ctx.fillRect(squareSize, size - squareSize * 6, squareSize * 5, squareSize * 5);
        
        setQrCode(canvas.toDataURL());
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, qrSize, event, guest]);

  const getSizePixels = () => {
    switch (qrSize) {
      case 'small': return 200;
      case 'medium': return 300;
      case 'large': return 400;
      default: return 300;
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${event?.name || 'invitation'}-${guest?.name || 'guest'}.png`;
    link.href = qrCode;
    link.click();
  };

  const copyQRUrl = () => {
    const qrUrl = generateQRUrl();
    navigator.clipboard.writeText(qrUrl);
    // You could add a toast notification here
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
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QrCode className="text-blue-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">QR Code thiệp mời</h3>
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
            {/* Event Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                {event?.name || 'Sự kiện mặc định'}
              </h4>
              <p className="text-sm text-gray-600">
                {guest ? `Dành cho: ${guest.name}` : 'Dành cho tất cả khách mời'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                URL: {generateQRUrl()}
              </p>
            </div>

            {/* QR Code Size Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kích thước QR Code
              </label>
              <div className="flex space-x-3">
                {[
                  { id: 'small', label: 'Nhỏ', icon: Smartphone },
                  { id: 'medium', label: 'Vừa', icon: Tablet },
                  { id: 'large', label: 'Lớn', icon: Monitor }
                ].map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setQrSize(size.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      qrSize === size.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <size.icon size={16} />
                    <span className="text-sm">{size.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
                {isGenerating ? (
                  <div className="flex items-center justify-center" style={{ width: getSizePixels(), height: getSizePixels() }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="max-w-full h-auto"
                    style={{ maxWidth: getSizePixels(), maxHeight: getSizePixels() }}
                  />
                ) : (
                  <div className="flex items-center justify-center text-gray-500" style={{ width: getSizePixels(), height: getSizePixels() }}>
                    <QrCode size={48} />
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Info */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Khách mời có thể quét mã QR này để xem thiệp mời
              </p>
              <p className="text-xs text-gray-500">
                Kích thước: {getSizePixels()}x{getSizePixels()}px
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={copyQRUrl}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
              >
                <Copy size={16} />
                <span>Sao chép URL</span>
              </button>
              <button 
                onClick={downloadQRCode}
                disabled={!qrCode}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-all duration-200"
              >
                <Download size={16} />
                <span>Tải xuống</span>
              </button>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;



