import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Image, 
  Settings, 
  Upload, 
  RotateCcw, 
  Save, 
  Download,
  Eye,
  EyeOff,
  Wand2,
  Sparkles
} from 'lucide-react';

interface Customization {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  logo: string | null | undefined;
  backgroundPattern: string;
}

interface CustomizationPanelProps {
  customization: Customization;
  onCustomizationChange: (customization: Customization) => void;
  onSave: () => void;
  onReset: () => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onCustomizationChange,
  onSave,
  onReset
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'effects'>('colors');

  const fontOptions = [
    { name: 'Inter', value: 'Inter', category: 'Modern' },
    { name: 'Poppins', value: 'Poppins', category: 'Modern' },
    { name: 'Playfair Display', value: 'Playfair Display', category: 'Serif' },
    { name: 'Roboto', value: 'Roboto', category: 'Sans-serif' },
    { name: 'Cormorant Garamond', value: 'Cormorant Garamond', category: 'Serif' },
    { name: 'Dancing Script', value: 'Dancing Script', category: 'Script' },
    { name: 'Crimson Text', value: 'Crimson Text', category: 'Serif' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro', category: 'Sans-serif' }
  ];

  const backgroundPatterns = [
    { name: 'None', value: 'none', preview: 'bg-transparent' },
    { name: 'Dots', value: 'dots', preview: 'bg-dots' },
    { name: 'Lines', value: 'lines', preview: 'bg-lines' },
    { name: 'Grid', value: 'grid', preview: 'bg-grid' },
    { name: 'Diagonal', value: 'diagonal', preview: 'bg-diagonal' }
  ];

  const colorPresets = [
    { name: 'Ocean Blue', colors: ['#0ea5e9', '#ffffff', '#f0f9ff'] },
    { name: 'Forest Green', colors: ['#059669', '#ffffff', '#f0fdf4'] },
    { name: 'Royal Purple', colors: ['#7c3aed', '#ffffff', '#faf5ff'] },
    { name: 'Sunset Orange', colors: ['#ea580c', '#ffffff', '#fff7ed'] },
    { name: 'Rose Pink', colors: ['#e11d48', '#ffffff', '#fff1f2'] },
    { name: 'Midnight', colors: ['#1e293b', '#ffffff', '#f8fafc'] }
  ];

  const handleColorChange = (colorType: keyof Customization, color: string) => {
    onCustomizationChange({
      ...customization,
      [colorType]: color
    });
  };

  const handlePresetSelect = (preset: any) => {
    onCustomizationChange({
      ...customization,
      primaryColor: preset.colors[0],
      secondaryColor: preset.colors[1],
      accentColor: preset.colors[2]
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onCustomizationChange({
          ...customization,
          logo: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="text-white" size={24} />
          <h2 className="text-xl font-bold text-white">Tùy chỉnh thiệp</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
        >
          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{isExpanded ? 'Ẩn' : 'Hiện'}</span>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
            {[
              { id: 'colors', label: 'Màu sắc', icon: Palette },
              { id: 'typography', label: 'Font chữ', icon: Type },
              { id: 'layout', label: 'Bố cục', icon: Image },
              { id: 'effects', label: 'Hiệu ứng', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                {/* Color Presets */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Màu sắc có sẵn</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSelect(preset)}
                        className="p-3 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200"
                      >
                        <div className="flex space-x-1 mb-2">
                          {preset.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded-full border border-white/20"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="text-white text-sm font-medium">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Màu tùy chỉnh</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Màu chủ đạo</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customization.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Màu nền</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customization.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Màu phụ</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customization.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Font chữ</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => onCustomizationChange({ ...customization, fontFamily: font.value })}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                          customization.fontFamily === font.value
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium" style={{ fontFamily: font.value }}>
                              {font.name}
                            </p>
                            <p className="text-gray-400 text-sm">{font.category}</p>
                          </div>
                          <div className="text-xs text-gray-400" style={{ fontFamily: font.value }}>
                            Aa
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Kích thước font: {customization.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={customization.fontSize}
                    onChange={(e) => onCustomizationChange({ ...customization, fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            )}

            {/* Layout Tab */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Logo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition-all duration-200"
                      >
                        <Upload size={16} />
                        <span>Tải lên logo</span>
                      </label>
                      {customization.logo && (
                        <button
                          onClick={() => onCustomizationChange({ ...customization, logo: null })}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    {customization.logo && (
                      <div className="p-4 bg-white/5 rounded-lg">
                        <img
                          src={customization.logo}
                          alt="Logo preview"
                          className="w-20 h-20 object-contain mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Họa tiết nền</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {backgroundPatterns.map((pattern) => (
                      <button
                        key={pattern.value}
                        onClick={() => onCustomizationChange({ ...customization, backgroundPattern: pattern.value })}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          customization.backgroundPattern === pattern.value
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className={`w-full h-8 rounded ${pattern.preview} mb-2`}></div>
                        <p className="text-white text-sm">{pattern.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Effects Tab */}
            {activeTab === 'effects' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Hiệu ứng đặc biệt</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Wand2 className="text-purple-400" size={20} />
                        <span className="text-white">Hiệu ứng gradient</span>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="text-yellow-400" size={20} />
                        <span className="text-white">Hiệu ứng lấp lánh</span>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="text-blue-400" size={20} />
                        <span className="text-white">Hiệu ứng 3D</span>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
            >
              <RotateCcw size={16} />
              <span>Đặt lại</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={onSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-white rounded-lg transition-all duration-200"
              >
                <Save size={16} />
                <span>Lưu</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-white rounded-lg transition-all duration-200">
                <Download size={16} />
                <span>Xuất</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomizationPanel;
