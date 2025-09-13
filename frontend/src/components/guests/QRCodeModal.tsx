import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: any | null;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, guest }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Debug logging
  console.log('QRCodeModal render:', { isOpen, guest: guest?.name });

  const generateQRCode = useCallback(async () => {
    if (!guest) return;
    
    setLoading(true);
    try {
      // Lấy QR code từ backend
      const response = await fetch(`http://localhost:8000/api/guests/${guest.id}/qr`);
      if (response.ok) {
        const data = await response.json();
        if (data.qr_image_url) {
          setQrCodeUrl(`http://localhost:8000${data.qr_image_url}`);
        } else {
          // Fallback: tạo QR code từ dữ liệu
          const qrData = JSON.parse(data.qr_data);
          const qrCodeDataURL = await import('qrcode').then(qr => 
            qr.toDataURL(JSON.stringify(qrData), {
              width: 256,
              margin: 2,
              color: {
                dark: '#0B2A4A',
                light: '#FFFFFF'
              }
            })
          );
          setQrCodeUrl(qrCodeDataURL);
        }
      } else {
        throw new Error('Không thể lấy QR code từ server');
      }
    } catch (error) {
      console.error('Lỗi tạo QR code:', error);
    } finally {
      setLoading(false);
    }
  }, [guest]);

  useEffect(() => {
    if (isOpen && guest) {
      generateQRCode();
      // Scroll to top when modal opens
      window.scrollTo(0, 0);
    }
  }, [isOpen, guest, generateQRCode]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `QR_${guest.name}_${guest.id}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-top bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-md sm:w-full" style={{marginTop: '20px'}}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <QrCode className="mr-2" size={20} />
            QR Code - {guest?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center">
          {loading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Đang tạo QR code...</p>
            </div>
          ) : qrCodeUrl ? (
            <div>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Khách mời:</strong> {guest?.title} {guest?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tổ chức:</strong> {guest?.organization || 'Chưa có'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Chức vụ:</strong> {guest?.role || 'Chưa có'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <p className="text-red-600">Lỗi tạo QR code</p>
            </div>
          )}
        </div>

            <div className="flex justify-center mt-6 space-x-3">
              <button
                onClick={downloadQRCode}
                disabled={!qrCodeUrl}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={16} className="mr-2" />
                Tải xuống
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

export default QRCodeModal;
