import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, X, AlertCircle } from 'lucide-react';
import { checkinGuest } from '../services/api';
import toast from 'react-hot-toast';
import QrScanner from 'qr-scanner';

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [checkinResult, setCheckinResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);



  const startScanning = async () => {
    try {
      setError(null);
      
      // Check if we already have a scanner running
      if (qrScannerRef.current) {
        await qrScannerRef.current.start();
        setIsScanning(true);
        return;
      }

      setIsScanning(true);

      // Wait for React to render the video element
      let attempts = 0;
      while (!videoRef.current && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!videoRef.current) {
        setError('Không thể khởi tạo camera. Vui lòng thử lại.');
        setIsScanning(false);
        return;
      }

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleQRCodeDetected(result.data);
        },
        {
          onDecodeError: (error) => {
            // Ignore decode errors, they're normal during scanning
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
        }
      );

      await qrScannerRef.current.start();

    } catch (err) {
      setError(`Lỗi khởi động camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
    setScannedData(null);
    setCheckinResult(null);
  };

  const handleQRCodeDetected = async (data: string) => {
    try {
      let qrData;
      let guestId;
      
      // Thử parse JSON trước
      try {
        qrData = JSON.parse(data);
        if (qrData.type === 'guest_checkin' && qrData.guest_id) {
          guestId = qrData.guest_id;
          setScannedData(qrData);
        } else {
          setError('QR code không hợp lệ');
          return;
        }
      } catch (jsonErr) {
        // Nếu không phải JSON, thử parse URL
        try {
          const url = new URL(data);
          const guestIdParam = url.searchParams.get('guest_id');
          if (guestIdParam) {
            guestId = parseInt(guestIdParam);
            qrData = {
              guest_id: guestId,
              guest_name: 'Khách mời',
              event_id: url.searchParams.get('event_id'),
              qr_id: url.searchParams.get('qr_id'),
              type: 'guest_checkin',
              checkin_url: data
            };
            setScannedData(qrData);
          } else {
            setError('QR code không hợp lệ');
            return;
          }
        } catch (urlErr) {
          setError('QR code không hợp lệ');
          return;
        }
      }
      
      if (guestId) {
        // Auto check-in
        const result = await checkinGuest(guestId, {
          check_in_location: 'QR Scanner'
        });
        
        setCheckinResult(result);
        toast.success('Check-in thành công!');
        
        // Stop scanning after successful check-in
        stopScanning();
      }
    } catch (err) {
      console.error('Error processing QR code:', err);
      setError('Không thể xử lý QR code');
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setCheckinResult(null);
    setError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">QR Scanner</h1>
          <p className="text-gray-400 mt-2">
            Quét QR code để check-in khách mời
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={startScanning}
            disabled={isScanning}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isScanning
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isScanning ? 'Đang quét...' : 'Bắt đầu quét'}
          </button>
          
          {isScanning && (
            <button
              onClick={stopScanning}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Dừng quét
            </button>
          )}
        </div>
      </div>

      {/* Scanner Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera View */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Camera Scanner
          </h3>
          
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-64 object-cover ${isScanning ? 'block' : 'hidden'}`}
            />
            {!isScanning && (
              <div className="w-full h-64 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">Nhấn "Bắt đầu quét" để mở camera</p>
                </div>
              </div>
            )}
            
            {/* QR Code Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-exp-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-exp-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-exp-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-exp-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-exp-primary rounded-br-lg"></div>
                </div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        {/* Scan Results */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Kết quả quét
          </h3>

          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {scannedData && (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Thông tin QR Code</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Guest ID:</span> <span className="text-white">{scannedData.guest_id}</span></p>
                  <p><span className="text-gray-400">Tên:</span> <span className="text-white">{scannedData.guest_name}</span></p>
                  <p><span className="text-gray-400">Event ID:</span> <span className="text-white">{scannedData.event_id}</span></p>
                </div>
              </div>

              {checkinResult && (
                <div className="bg-green-900 bg-opacity-20 border border-green-500 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle size={20} className="text-green-400" />
                    <p className="text-green-400 font-medium">Check-in thành công!</p>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p>Khách mời: {checkinResult.name}</p>
                    <p>Thời gian: {new Date(checkinResult.check_in_time).toLocaleString('vi-VN')}</p>
                    <p>Vị trí: {checkinResult.check_in_location}</p>
                  </div>
                </div>
              )}

              <button
                onClick={resetScanner}
                className="w-full btn-exp"
              >
                Quét QR code khác
              </button>
            </div>
          )}

          {!scannedData && !error && (
            <div className="text-center py-8">
              <QrCode size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">Chưa có dữ liệu quét</p>
              <p className="text-gray-500 text-sm mt-2">
                Hướng camera về phía QR code để quét
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card-exp">
        <h3 className="text-lg font-semibold text-white mb-4">
          Hướng dẫn sử dụng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-exp-gradient rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h4 className="text-white font-medium mb-2">Bắt đầu quét</h4>
            <p className="text-gray-400 text-sm">
              Nhấn nút "Bắt đầu quét" để mở camera
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-exp-gradient rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h4 className="text-white font-medium mb-2">Hướng camera</h4>
            <p className="text-gray-400 text-sm">
              Hướng camera về phía QR code của khách mời
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-exp-gradient rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h4 className="text-white font-medium mb-2">Check-in tự động</h4>
            <p className="text-gray-400 text-sm">
              Hệ thống sẽ tự động check-in khi quét thành công
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;


