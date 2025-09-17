import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Bell, 
  Shield, 
  Database,
  QrCode,
  Mail,
  Globe,
  Download,
  Upload,
  TestTube,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Palette,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Clock,
  Zap,
  FileText,
  Trash2,
  Copy,
  Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState({
    // General settings
    appName: 'Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm',
    appVersion: '1.0.0',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    
    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Security settings
    requireAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    
    // QR Code settings
    qrSize: 'medium',
    qrFormat: 'png',
    qrLogo: true,
    
    // Email settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    
    // System settings
    autoBackup: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    
    // Theme settings
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    borderRadius: '8px',
    fontSize: 'medium',
    
    // Advanced settings
    twoFactorAuth: false,
    apiRateLimit: 100,
    cacheEnabled: true,
    debugMode: false,
    
    // Analytics
    analyticsEnabled: true,
    crashReporting: true,
    usageTracking: true
  });

  const tabs = [
    { id: 'general', name: 'Chung', icon: SettingsIcon, color: 'blue' },
    { id: 'theme', name: 'Giao diện', icon: Palette, color: 'purple' },
    { id: 'notifications', name: 'Thông báo', icon: Bell, color: 'yellow' },
    { id: 'security', name: 'Bảo mật', icon: Shield, color: 'red' },
    { id: 'qr', name: 'QR Code', icon: QrCode, color: 'green' },
    { id: 'email', name: 'Email', icon: Mail, color: 'blue' },
    { id: 'system', name: 'Hệ thống', icon: Database, color: 'gray' },
    { id: 'advanced', name: 'Nâng cao', icon: Zap, color: 'orange' }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear validation error when user changes value
    if (validationErrors[key]) {
      setValidationErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const validateSettings = () => {
    const errors: Record<string, string> = {};
    
    if (!settings.appName.trim()) {
      errors.appName = 'Tên ứng dụng không được để trống';
    }
    
    if (settings.smtpPort < 1 || settings.smtpPort > 65535) {
      errors.smtpPort = 'Port phải từ 1 đến 65535';
    }
    
    if (settings.smtpUsername && !settings.smtpPassword) {
      errors.smtpPassword = 'Mật khẩu SMTP là bắt buộc khi có username';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      toast.error('Vui lòng kiểm tra lại các thông tin');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      toast.success('Đã lưu cài đặt thành công! 🎉');
    } catch (error) {
      toast.error('Có lỗi khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSMTP = async () => {
    try {
      toast.loading('Đang test kết nối SMTP...', { id: 'smtp-test' });
      
      // Simulate SMTP test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Kết nối SMTP thành công! ✅', { id: 'smtp-test' });
    } catch (error) {
      toast.error('Kết nối SMTP thất bại! ❌', { id: 'smtp-test' });
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Đã xuất cài đặt! 📁');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        toast.success('Đã nhập cài đặt thành công! 📂');
      } catch (error) {
        toast.error('File không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  const handlePreviewQR = () => {
    // Generate preview QR code
    const qrData = {
      template: settings.qrSize,
      format: settings.qrFormat,
      logo: settings.qrLogo
    };
    console.log('QR Preview:', qrData);
    toast.success('Xem trước QR Code! 📱');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* App Info Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <SettingsIcon size={20} className="mr-2 text-blue-400" />
          Thông tin ứng dụng
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tên ứng dụng
            </label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => handleSettingChange('appName', e.target.value)}
              className={`w-full input-exp ${validationErrors.appName ? 'border-red-500' : ''}`}
              placeholder="Nhập tên ứng dụng..."
            />
            {validationErrors.appName && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {validationErrors.appName}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phiên bản
              </label>
              <input
                type="text"
                value={settings.appVersion}
                readOnly
                className="w-full input-exp bg-gray-700/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trạng thái
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('settings.language')}
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}
              className="w-full input-exp appearance-none pr-10"
            >
              <option value="vi">{t('settings.vietnamese')}</option>
              <option value="en">{t('settings.english')}</option>
            </select>
            <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('settings.timezone')}
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full input-exp"
          >
            <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderThemeSettings = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Palette size={20} className="mr-2 text-purple-400" />
          Chọn giao diện
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              theme === 'dark' ? 'border-purple-500 bg-purple-900/30' : 'border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => setTheme('dark')}
          >
            <Moon size={24} className="text-purple-400 mx-auto mb-2" />
            <p className="text-white text-sm text-center">Dark</p>
          </div>
          
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              theme === 'light' ? 'border-purple-500 bg-purple-900/30' : 'border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => setTheme('light')}
          >
            <Sun size={24} className="text-yellow-400 mx-auto mb-2" />
            <p className="text-white text-sm text-center">Light</p>
          </div>
          
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              theme === 'auto' ? 'border-purple-500 bg-purple-900/30' : 'border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => setTheme('auto')}
          >
            <Monitor size={24} className="text-blue-400 mx-auto mb-2" />
            <p className="text-white text-sm text-center">Auto</p>
          </div>
        </div>
      </div>

      {/* Color Customization */}
      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg p-6 border border-blue-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Palette size={20} className="mr-2 text-blue-400" />
          Tùy chỉnh màu sắc
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Màu chính
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                className="flex-1 input-exp font-mono text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Màu phụ
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                className="flex-1 input-exp font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-6 border border-green-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Monitor size={20} className="mr-2 text-green-400" />
          Cài đặt giao diện
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kích thước font
            </label>
            <select
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              className="w-full input-exp"
            >
              <option value="small">Nhỏ</option>
              <option value="medium">Trung bình</option>
              <option value="large">Lớn</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Độ bo góc
            </label>
            <select
              value={settings.borderRadius}
              onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
              className="w-full input-exp"
            >
              <option value="0px">Không bo</option>
              <option value="4px">Nhỏ</option>
              <option value="8px">Trung bình</option>
              <option value="12px">Lớn</option>
              <option value="16px">Rất lớn</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Notification Types */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg p-6 border border-yellow-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Bell size={20} className="mr-2 text-yellow-400" />
          Loại thông báo
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-blue-400" />
              <div>
                <h4 className="text-white font-medium">Email thông báo</h4>
                <p className="text-gray-400 text-sm">Gửi thông báo qua email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone size={20} className="text-green-400" />
              <div>
                <h4 className="text-white font-medium">SMS thông báo</h4>
                <p className="text-gray-400 text-sm">Gửi thông báo qua SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-purple-400" />
              <div>
                <h4 className="text-white font-medium">Push thông báo</h4>
                <p className="text-gray-400 text-sm">Thông báo trên trình duyệt</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 rounded-lg p-6 border border-indigo-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock size={20} className="mr-2 text-indigo-400" />
          Lịch thông báo
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thời gian gửi thông báo
            </label>
            <select className="w-full input-exp">
              <option value="immediate">Ngay lập tức</option>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Giờ gửi
            </label>
            <input
              type="time"
              className="w-full input-exp"
              defaultValue="09:00"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Yêu cầu xác thực</h4>
          <p className="text-gray-400 text-sm">Bắt buộc đăng nhập để sử dụng</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requireAuth}
            onChange={(e) => handleSettingChange('requireAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-exp-primary"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Thời gian hết hạn phiên (phút)
        </label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
          className="w-full input-exp"
          min="5"
          max="480"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Chính sách mật khẩu
        </label>
        <select
          value={settings.passwordPolicy}
          onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
          className="w-full input-exp"
        >
          <option value="weak">Yếu (6 ký tự)</option>
          <option value="medium">Trung bình (8 ký tự, chữ và số)</option>
          <option value="strong">Mạnh (8+ ký tự, chữ, số, ký tự đặc biệt)</option>
        </select>
      </div>
    </div>
  );

  const renderQRSettings = () => (
    <div className="space-y-6">
      {/* QR Configuration */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-6 border border-green-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <QrCode size={20} className="mr-2 text-green-400" />
          Cấu hình QR Code
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kích thước QR Code
            </label>
            <select
              value={settings.qrSize}
              onChange={(e) => handleSettingChange('qrSize', e.target.value)}
              className="w-full input-exp"
            >
              <option value="small">Nhỏ (100x100px)</option>
              <option value="medium">Trung bình (200x200px)</option>
              <option value="large">Lớn (300x300px)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Định dạng file
            </label>
            <select
              value={settings.qrFormat}
              onChange={(e) => handleSettingChange('qrFormat', e.target.value)}
              className="w-full input-exp"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="svg">SVG</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Hiển thị logo</h4>
            <p className="text-gray-400 text-sm">Thêm logo EXP vào QR code</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.qrLogo}
              onChange={(e) => handleSettingChange('qrLogo', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        
        <div className="mt-4">
          <button
            onClick={handlePreviewQR}
            className="btn-exp flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>Xem trước QR Code</span>
          </button>
        </div>
      </div>

      {/* QR Preview */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Eye size={20} className="mr-2 text-purple-400" />
          Xem trước QR Code
        </h3>
        
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className={`bg-black p-4 rounded ${settings.borderRadius}`}>
              <div className="grid grid-cols-3 gap-1 w-24 h-24">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${i % 2 === 0 ? 'bg-black' : 'bg-white'} rounded-sm`}
                  ></div>
                ))}
              </div>
              {settings.qrLogo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Kích thước: {settings.qrSize} | Định dạng: {settings.qrFormat.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      {/* SMTP Configuration */}
      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg p-6 border border-blue-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Mail size={20} className="mr-2 text-blue-400" />
          Cấu hình SMTP
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
              className="w-full input-exp"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
              className={`w-full input-exp ${validationErrors.smtpPort ? 'border-red-500' : ''}`}
              placeholder="587"
            />
            {validationErrors.smtpPort && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {validationErrors.smtpPort}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={settings.smtpUsername}
            onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
            className="w-full input-exp"
            placeholder="your-email@gmail.com"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={settings.smtpPassword}
              onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
              className={`w-full input-exp pr-10 ${validationErrors.smtpPassword ? 'border-red-500' : ''}`}
              placeholder="App password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {validationErrors.smtpPassword && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {validationErrors.smtpPassword}
            </p>
          )}
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleTestSMTP}
            className="btn-exp flex items-center space-x-2"
          >
            <TestTube size={16} />
            <span>Test kết nối SMTP</span>
          </button>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-purple-400" />
          Mẫu email
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Email mời sự kiện</h4>
              <p className="text-gray-400 text-sm">Mẫu email gửi lời mời</p>
            </div>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
              Chỉnh sửa
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Email nhắc nhở</h4>
              <p className="text-gray-400 text-sm">Email nhắc nhở tham gia</p>
            </div>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Tự động backup</h4>
          <p className="text-gray-400 text-sm">Tự động sao lưu dữ liệu</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoBackup}
            onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-exp-primary"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tần suất backup
        </label>
        <select
          value={settings.backupFrequency}
          onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
          className="w-full input-exp"
        >
          <option value="hourly">Hàng giờ</option>
          <option value="daily">Hàng ngày</option>
          <option value="weekly">Hàng tuần</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Mức độ log
        </label>
        <select
          value={settings.logLevel}
          onChange={(e) => handleSettingChange('logLevel', e.target.value)}
          className="w-full input-exp"
        >
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'theme':
        return renderThemeSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'qr':
        return renderQRSettings();
      case 'email':
        return renderEmailSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <SettingsIcon size={32} className="mr-3 text-blue-400" />
              Cài đặt hệ thống
            </h1>
            <p className="text-gray-400 mt-2 flex items-center">
              <Info size={16} className="mr-2" />
              Cấu hình và tùy chỉnh ứng dụng theo nhu cầu của bạn
            </p>
          </div>
          
          <div className="w-full grid grid-cols-3 gap-2 sm:w-auto sm:flex sm:items-center sm:space-x-3">
            {/* Action Buttons */}
            <button
              onClick={handleExportSettings}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
              title="Xuất cài đặt"
            >
              <Download size={16} />
              <span>Xuất</span>
            </button>
            
            <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto">
              <Upload size={16} />
              <span>Nhập</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-exp flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isSaving ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              <span>{isSaving ? 'Đang lưu...' : 'Lưu'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-exp">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Cài đặt</h2>
              <p className="text-gray-400 text-sm">Cấu hình hệ thống</p>
            </div>
            
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                const getColorClasses = (color: string) => {
                  const colors: Record<string, string> = {
                    blue: 'text-blue-400 bg-blue-900/20 border-blue-700/30',
                    purple: 'text-purple-400 bg-purple-900/20 border-purple-700/30',
                    yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30',
                    red: 'text-red-400 bg-red-900/20 border-red-700/30',
                    green: 'text-green-400 bg-green-900/20 border-green-700/30',
                    gray: 'text-gray-400 bg-gray-900/20 border-gray-700/30',
                    orange: 'text-orange-400 bg-orange-900/20 border-orange-700/30'
                  };
                  return colors[color] || colors.blue;
                };
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r from-${tab.color}-900/30 to-${tab.color}-800/30 border border-${tab.color}-700/50 text-white shadow-lg`
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon size={20} className={isActive ? `text-${tab.color}-400` : ''} />
                    <span>{tab.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-current rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card-exp">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;


