import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Bell, 
  Shield, 
  Database,
  QrCode,
  Mail,
  Globe
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
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
    logLevel: 'info'
  });

  const tabs = [
    { id: 'general', name: t('settings.general'), icon: SettingsIcon },
    { id: 'notifications', name: t('settings.notifications'), icon: Bell },
    { id: 'security', name: t('settings.security'), icon: Shield },
    { id: 'qr', name: t('settings.qr_code'), icon: QrCode },
    { id: 'email', name: t('settings.email'), icon: Mail },
    { id: 'system', name: t('settings.system'), icon: Database }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving settings:', settings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('settings.app_name')}
        </label>
        <input
          type="text"
          value={settings.appName}
          onChange={(e) => handleSettingChange('appName', e.target.value)}
          className="w-full input-exp"
        />
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

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Email thông báo</h4>
          <p className="text-gray-400 text-sm">Gửi thông báo qua email</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-exp-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">SMS thông báo</h4>
          <p className="text-gray-400 text-sm">Gửi thông báo qua SMS</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-exp-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Push thông báo</h4>
          <p className="text-gray-400 text-sm">Thông báo trên trình duyệt</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-exp-primary"></div>
        </label>
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

      <div className="flex items-center justify-between">
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
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-exp-primary"></div>
        </label>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
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
            className="w-full input-exp"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <input
          type="text"
          value={settings.smtpUsername}
          onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
          className="w-full input-exp"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          value={settings.smtpPassword}
          onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
          className="w-full input-exp"
        />
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('settings.title')}</h1>
          <p className="text-gray-400 mt-2">
            {t('settings.subtitle')}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-exp flex items-center space-x-2"
        >
          <Save size={20} />
          <span>{t('settings.save')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-exp">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-exp-gradient text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.name}</span>
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


