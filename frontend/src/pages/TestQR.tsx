import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle, XCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const TestQR: React.FC = () => {
  const navigate = useNavigate();
  const [testData, setTestData] = useState('');
  const [result, setResult] = useState<any>(null);

  // Sample QR data for testing
  const sampleQRData = {
    guest_id: 1,
    guest_name: "Nguyễn Văn A",
    event_id: 1,
    qr_id: "test-qr-123",
    type: "guest_checkin"
  };

  const handleTestQR = () => {
    try {
      const qrData = JSON.parse(testData);
      
      // Validate QR data
      if (!qrData.guest_id || !qrData.type) {
        throw new Error('Invalid QR data format');
      }

      setResult({
        success: true,
        data: qrData,
        message: 'QR data is valid!'
      });

      toast.success('QR data parsed successfully!');
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Invalid QR data format'
      });

      toast.error('Invalid QR data format');
    }
  };

  const handleTestCheckIn = () => {
    if (!result?.success) {
      toast.error('Please test QR data first');
      return;
    }

    // Navigate to check-in page with QR data
    const guestId = result.data.guest_id;
    const qrId = result.data.qr_id;
    
    navigate(`/checkin?guest_id=${guestId}&qr_id=${qrId}`);
  };

  const copySampleData = () => {
    setTestData(JSON.stringify(sampleQRData, null, 2));
    toast.success('Sample data copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🧪 QR Code Test Page</h1>
          <p className="text-gray-300">Test QR check-in functionality without camera</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Data Input */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <QrCode className="h-6 w-6 mr-2" />
              QR Data Input
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paste QR Code Data (JSON):
                </label>
                <textarea
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  placeholder="Paste QR code data here..."
                  className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={copySampleData}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Sample Data
                </button>
                
                <button
                  onClick={handleTestQR}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Test QR Data
                </button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2" />
              Test Results
            </h2>

            {result ? (
              <div className="space-y-4">
                {result.success ? (
                  <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-400 font-medium">Valid QR Data</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{result.message}</p>
                    
                    <div className="bg-gray-800 rounded-lg p-3 mb-4">
                      <h4 className="text-white font-medium mb-2">Parsed Data:</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-400">Guest ID:</span> <span className="text-white">{result.data.guest_id}</span></p>
                        <p><span className="text-gray-400">Guest Name:</span> <span className="text-white">{result.data.guest_name}</span></p>
                        <p><span className="text-gray-400">Event ID:</span> <span className="text-white">{result.data.event_id}</span></p>
                        <p><span className="text-gray-400">QR ID:</span> <span className="text-white">{result.data.qr_id}</span></p>
                        <p><span className="text-gray-400">Type:</span> <span className="text-white">{result.data.type}</span></p>
                      </div>
                    </div>

                    <button
                      onClick={handleTestCheckIn}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Test Check-in Process
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-red-400 font-medium">Invalid QR Data</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{result.message}</p>
                    <p className="text-red-300 text-xs">{result.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Enter QR data to test</p>
              </div>
            )}
          </div>
        </div>

        {/* Sample QR Data */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sample QR Data for Testing:</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{JSON.stringify(sampleQRData, null, 2)}
            </pre>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Copy this data and paste it into the input field above to test
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 How to Test:</h3>
          <div className="space-y-2 text-gray-300">
            <p>1. <strong>Use Sample Data:</strong> Click "Use Sample Data" to load test data</p>
            <p>2. <strong>Test QR Data:</strong> Click "Test QR Data" to validate the format</p>
            <p>3. <strong>Test Check-in:</strong> If valid, click "Test Check-in Process" to simulate check-in</p>
            <p>4. <strong>Real QR Code:</strong> In production, QR codes will contain this JSON data</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestQR;

