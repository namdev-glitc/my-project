import React, { useState } from 'react';
import { Download, FileText, Settings, Printer, Mail, Share2 } from 'lucide-react';

interface PDFGeneratorProps {
  template: any;
  customization: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: number;
    logo: string | null | undefined;
    backgroundPattern: string;
  };
  event?: any;
  guest?: any;
  onGenerate: (options: PDFOptions) => void;
}

interface PDFOptions {
  format: 'A4' | 'A5' | 'Letter';
  orientation: 'portrait' | 'landscape';
  quality: 'low' | 'medium' | 'high';
  includeQR: boolean;
  includeLogo: boolean;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  template,
  customization,
  event,
  guest,
  onGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<PDFOptions>({
    format: 'A4',
    orientation: 'portrait',
    quality: 'high',
    includeQR: true,
    includeLogo: true
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the actual generation function
      onGenerate(options);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatSizes = {
    A4: { width: 210, height: 297, label: 'A4 (210x297mm)' },
    A5: { width: 148, height: 210, label: 'A5 (148x210mm)' },
    Letter: { width: 216, height: 279, label: 'Letter (216x279mm)' }
  };

  return (
    <div className="space-y-6">
      {/* PDF Preview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xem trước PDF</h3>
        <div className="flex justify-center">
          <div 
            className="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
            style={{
              width: options.orientation === 'portrait' ? '210px' : '297px',
              height: options.orientation === 'portrait' ? '297px' : '210px',
              transform: 'scale(0.5)',
              transformOrigin: 'top center'
            }}
          >
            {/* PDF Content Preview */}
            <div 
              className="w-full h-full p-4 flex flex-col justify-center items-center text-center"
              style={{
                backgroundColor: customization.secondaryColor,
                color: customization.primaryColor,
                fontFamily: customization.fontFamily,
                fontSize: `${customization.fontSize * 0.8}px`
              }}
            >
              {/* Logo */}
              {options.includeLogo && (
                <div className="mb-4">
                  {customization.logo ? (
                    <img 
                      src={customization.logo} 
                      alt="Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">E</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="text-lg font-bold mb-2">
                {event?.name || 'Sự kiện mặc định'}
              </h1>
              <h2 className="text-sm font-semibold mb-4">
                {event?.organization || 'EXP Technology'}
              </h2>

              {/* Event Details */}
              <div className="space-y-1 mb-4 text-xs">
                <p>{event?.event_date || 'Ngày sự kiện'}</p>
                <p>{event?.event_time || 'Thời gian'}</p>
                <p>{event?.location || 'Địa điểm'}</p>
              </div>

              {/* Guest Info */}
              {guest && (
                <div className="p-2 bg-gray-100 rounded mb-4">
                  <p className="text-xs font-semibold">Kính mời</p>
                  <p className="text-xs">{guest.name}</p>
                </div>
              )}

              {/* QR Code */}
              {options.includeQR && (
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs">QR</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          Kích thước: {formatSizes[options.format].label} - {options.orientation}
        </p>
      </div>

      {/* PDF Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tùy chọn PDF</h3>
        
        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kích thước giấy
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(formatSizes).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setOptions(prev => ({ ...prev, format: key as any }))}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  options.format === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">{key}</div>
                <div className="text-xs text-gray-500">{value.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hướng giấy
          </label>
          <div className="flex space-x-3">
            <button
              onClick={() => setOptions(prev => ({ ...prev, orientation: 'portrait' }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                options.orientation === 'portrait'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-4 h-6 border-2 border-current"></div>
              <span className="text-sm">Dọc</span>
            </button>
            <button
              onClick={() => setOptions(prev => ({ ...prev, orientation: 'landscape' }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                options.orientation === 'landscape'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-6 h-4 border-2 border-current"></div>
              <span className="text-sm">Ngang</span>
            </button>
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chất lượng
          </label>
          <div className="flex space-x-3">
            {[
              { id: 'low', label: 'Thấp', desc: 'Kích thước nhỏ' },
              { id: 'medium', label: 'Trung bình', desc: 'Cân bằng' },
              { id: 'high', label: 'Cao', desc: 'Chất lượng tốt' }
            ].map((quality) => (
              <button
                key={quality.id}
                onClick={() => setOptions(prev => ({ ...prev, quality: quality.id as any }))}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  options.quality === quality.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">{quality.label}</div>
                <div className="text-xs text-gray-500">{quality.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tùy chọn bổ sung
          </label>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-sm">Bao gồm QR Code</div>
              <div className="text-xs text-gray-500">Thêm mã QR vào thiệp mời</div>
            </div>
            <input
              type="checkbox"
              checked={options.includeQR}
              onChange={(e) => setOptions(prev => ({ ...prev, includeQR: e.target.checked }))}
              className="w-4 h-4 text-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-sm">Bao gồm Logo</div>
              <div className="text-xs text-gray-500">Thêm logo công ty vào thiệp</div>
            </div>
            <input
              type="checkbox"
              checked={options.includeLogo}
              onChange={(e) => setOptions(prev => ({ ...prev, includeLogo: e.target.checked }))}
              className="w-4 h-4 text-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200">
            <Printer size={16} />
            <span>In trực tiếp</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200">
            <Mail size={16} />
            <span>Gửi email</span>
          </button>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang tạo PDF...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Tải PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PDFGenerator;



