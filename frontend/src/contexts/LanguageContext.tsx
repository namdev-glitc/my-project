import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Lấy ngôn ngữ từ localStorage hoặc mặc định là tiếng Việt
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'vi';
  });

  useEffect(() => {
    // Lưu ngôn ngữ vào localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Hàm dịch đơn giản
  const t = (key: string): string => {
    const translations: Record<Language, Record<string, string>> = {
      vi: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.guests': 'Khách mời',
        'nav.events': 'Sự kiện',
        'nav.invitations': 'Thiệp mời',
        'nav.qr_scanner': 'QR Scanner',
        'nav.reports': 'Báo cáo',
        'nav.settings': 'Cài đặt',
        
        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Tổng quan hệ thống quản lý khách mời',
        'dashboard.total_guests': 'Tổng khách mời',
        'dashboard.checked_in': 'Đã check-in',
        'dashboard.rsvp_accepted': 'RSVP Chấp nhận',
        'dashboard.check_in_rate': 'Tỷ lệ check-in',
        'dashboard.refresh': 'Làm mới',
        'dashboard.qr_scanner': 'QR Scanner',
        'dashboard.export_report': 'Xuất báo cáo',
        
        // Guests
        'guests.title': 'Quản lý Khách mời',
        'guests.subtitle': 'Quản lý danh sách khách mời và RSVP',
        'guests.import_csv': 'Import CSV',
        'guests.export_excel': 'Xuất Excel',
        'guests.add_guest': 'Thêm khách mời',
        'guests.delete_selected': 'Xóa đã chọn',
        'guests.delete_all': 'Xóa tất cả',
        'guests.search_placeholder': 'Tìm kiếm theo tên, tổ chức...',
        'guests.rsvp_status': 'Trạng thái RSVP',
        'guests.organization': 'Tổ chức',
        'guests.checkin_status': 'Trạng thái Check-in',
        'guests.all': 'Tất cả',
        'guests.pending': 'Chờ phản hồi',
        'guests.accepted': 'Chấp nhận',
        'guests.declined': 'Từ chối',
        'guests.checked_in': 'Đã check-in',
        'guests.not_checked_in': 'Chưa check-in',
        'guests.total_guests': 'Tổng khách mời',
        'guests.accepted_count': 'Đã chấp nhận',
        'guests.pending_count': 'Chờ phản hồi',
        'guests.checked_in_count': 'Đã check-in',
        'guests.guest_list': 'Danh sách Khách mời',
        'guests.guest': 'Khách mời',
        'guests.organization_col': 'Tổ chức',
        'guests.rsvp': 'RSVP',
        'guests.actions': 'Thao tác',
        'guests.no_guests': 'Chưa có khách mời nào',
        'guests.add_first_guest': 'Hãy thêm khách mời đầu tiên để bắt đầu',
        'guests.no_title': 'Chưa có chức vụ',
        'guests.no_organization': 'Chưa có tổ chức',
        
        // Events
        'events.title': 'Quản lý Sự kiện',
        'events.subtitle': 'Tạo và quản lý các sự kiện',
        'events.add_event': 'Thêm sự kiện',
        'events.event_name': 'Tên sự kiện',
        'events.event_date': 'Ngày sự kiện',
        'events.location': 'Địa điểm',
        'events.description': 'Mô tả',
        'events.max_guests': 'Số khách tối đa',
        
        // Invitations
        'invitations.title': 'Thiệp mời',
        'invitations.subtitle': 'Tạo và quản lý thiệp mời cho khách mời',
        'invitations.view_sample': 'Xem mẫu',
        'invitations.create_all': 'Tạo tất cả',
        'invitations.locked': '(đã khóa)',
        'invitations.select_guests': 'Chọn khách mời',
        'invitations.event_info': 'Thông tin sự kiện',
        'invitations.create_invitation': 'Tạo thiệp mời',
        'invitations.view_invitation': 'Xem thiệp mời',
        'invitations.qr_code': 'QR Code',
        'invitations.create_html_invitation': 'Tạo thiệp mời HTML đẹp mắt cho từng khách mời',
        'invitations.display_html_invitation': 'Hiển thị thiệp mời HTML của khách đã chọn',
        'invitations.integrate_qr_checkin': 'Tích hợp QR code để check-in tại sự kiện',
        
        // QR Scanner
        'qr_scanner.title': 'QR Scanner',
        'qr_scanner.subtitle': 'Quét mã QR để check-in khách mời',
        'qr_scanner.start_scanning': 'Bắt đầu quét',
        'qr_scanner.stop_scanning': 'Dừng quét',
        'qr_scanner.scan_instructions': 'Hướng camera về phía mã QR để quét',
        'qr_scanner.no_camera': 'Không tìm thấy camera',
        'qr_scanner.scan_success': 'Quét thành công!',
        'qr_scanner.scan_error': 'Lỗi khi quét mã QR',
        
        // Reports
        'reports.title': 'Báo cáo',
        'reports.subtitle': 'Xem và xuất báo cáo thống kê',
        'reports.export_report': 'Xuất báo cáo',
        'reports.guest_statistics': 'Thống kê khách mời',
        'reports.event_statistics': 'Thống kê sự kiện',
        
        // Settings
        'settings.title': 'Cài đặt',
        'settings.subtitle': 'Cấu hình hệ thống',
        'settings.general': 'Chung',
        'settings.notifications': 'Thông báo',
        'settings.security': 'Bảo mật',
        'settings.qr_code': 'QR Code',
        'settings.email': 'Email',
        'settings.system': 'Hệ thống',
        'settings.app_name': 'Tên ứng dụng',
        'settings.language': 'Ngôn ngữ',
        'settings.timezone': 'Múi giờ',
        'settings.theme': 'Giao diện',
        'settings.light_mode': 'Chế độ sáng',
        'settings.dark_mode': 'Chế độ tối',
        'settings.vietnamese': 'Tiếng Việt',
        'settings.english': 'English',
        'settings.save': 'Lưu',
        'settings.cancel': 'Hủy',
        
        // Common
        'common.edit': 'Chỉnh sửa',
        'common.delete': 'Xóa',
        'common.save': 'Lưu',
        'common.cancel': 'Hủy',
        'common.close': 'Đóng',
        'common.confirm': 'Xác nhận',
        'common.yes': 'Có',
        'common.no': 'Không',
        'common.loading': 'Đang tải...',
        'common.error': 'Lỗi',
        'common.success': 'Thành công',
        'common.warning': 'Cảnh báo',
        'common.info': 'Thông tin',
        
        // System
        'system.title': 'Hệ thống Quản lý Khách mời',
        'system.anniversary': 'Lễ kỷ niệm 15 năm',
        'system.techno_logy': 'TECHNO LOGY',
        'system.admin': 'Admin',
        'system.logout': 'Đăng xuất'
      },
      en: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.guests': 'Guests',
        'nav.events': 'Events',
        'nav.invitations': 'Invitations',
        'nav.qr_scanner': 'QR Scanner',
        'nav.reports': 'Reports',
        'nav.settings': 'Settings',
        
        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Guest management system overview',
        'dashboard.total_guests': 'Total Guests',
        'dashboard.checked_in': 'Checked In',
        'dashboard.rsvp_accepted': 'RSVP Accepted',
        'dashboard.check_in_rate': 'Check-in Rate',
        'dashboard.refresh': 'Refresh',
        'dashboard.qr_scanner': 'QR Scanner',
        'dashboard.export_report': 'Export Report',
        
        // Guests
        'guests.title': 'Guest Management',
        'guests.subtitle': 'Manage guest list and RSVP',
        'guests.import_csv': 'Import CSV',
        'guests.export_excel': 'Export Excel',
        'guests.add_guest': 'Add Guest',
        'guests.delete_selected': 'Delete Selected',
        'guests.delete_all': 'Delete All',
        'guests.search_placeholder': 'Search by name, organization...',
        'guests.rsvp_status': 'RSVP Status',
        'guests.organization': 'Organization',
        'guests.checkin_status': 'Check-in Status',
        'guests.all': 'All',
        'guests.pending': 'Pending',
        'guests.accepted': 'Accepted',
        'guests.declined': 'Declined',
        'guests.checked_in': 'Checked In',
        'guests.not_checked_in': 'Not Checked In',
        'guests.total_guests': 'Total Guests',
        'guests.accepted_count': 'Accepted',
        'guests.pending_count': 'Pending',
        'guests.checked_in_count': 'Checked In',
        'guests.guest_list': 'Guest List',
        'guests.guest': 'Guest',
        'guests.organization_col': 'Organization',
        'guests.rsvp': 'RSVP',
        'guests.actions': 'Actions',
        'guests.no_guests': 'No guests yet',
        'guests.add_first_guest': 'Add your first guest to get started',
        'guests.no_title': 'No title',
        'guests.no_organization': 'No organization',
        
        // Events
        'events.title': 'Event Management',
        'events.subtitle': 'Create and manage events',
        'events.add_event': 'Add Event',
        'events.event_name': 'Event Name',
        'events.event_date': 'Event Date',
        'events.location': 'Location',
        'events.description': 'Description',
        'events.max_guests': 'Max Guests',
        
        // Invitations
        'invitations.title': 'Invitations',
        'invitations.subtitle': 'Create and manage invitations for guests',
        'invitations.view_sample': 'View Sample',
        'invitations.create_all': 'Create All',
        'invitations.locked': '(locked)',
        'invitations.select_guests': 'Select Guests',
        'invitations.event_info': 'Event Information',
        'invitations.create_invitation': 'Create Invitation',
        'invitations.view_invitation': 'View Invitation',
        'invitations.qr_code': 'QR Code',
        'invitations.create_html_invitation': 'Create beautiful HTML invitations for each guest',
        'invitations.display_html_invitation': 'Display HTML invitation of selected guest',
        'invitations.integrate_qr_checkin': 'Integrate QR code for event check-in',
        
        // QR Scanner
        'qr_scanner.title': 'QR Scanner',
        'qr_scanner.subtitle': 'Scan QR codes to check-in guests',
        'qr_scanner.start_scanning': 'Start Scanning',
        'qr_scanner.stop_scanning': 'Stop Scanning',
        'qr_scanner.scan_instructions': 'Point camera at QR code to scan',
        'qr_scanner.no_camera': 'No camera found',
        'qr_scanner.scan_success': 'Scan successful!',
        'qr_scanner.scan_error': 'Error scanning QR code',
        
        // Reports
        'reports.title': 'Reports',
        'reports.subtitle': 'View and export statistics reports',
        'reports.export_report': 'Export Report',
        'reports.guest_statistics': 'Guest Statistics',
        'reports.event_statistics': 'Event Statistics',
        
        // Settings
        'settings.title': 'Settings',
        'settings.subtitle': 'System configuration',
        'settings.general': 'General',
        'settings.notifications': 'Notifications',
        'settings.security': 'Security',
        'settings.qr_code': 'QR Code',
        'settings.email': 'Email',
        'settings.system': 'System',
        'settings.app_name': 'App Name',
        'settings.language': 'Language',
        'settings.timezone': 'Timezone',
        'settings.theme': 'Theme',
        'settings.light_mode': 'Light Mode',
        'settings.dark_mode': 'Dark Mode',
        'settings.vietnamese': 'Tiếng Việt',
        'settings.english': 'English',
        'settings.save': 'Save',
        'settings.cancel': 'Cancel',
        
        // Common
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.close': 'Close',
        'common.confirm': 'Confirm',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.warning': 'Warning',
        'common.info': 'Info',
        
        // System
        'system.title': 'Guest Management System',
        'system.anniversary': '15th Anniversary',
        'system.techno_logy': 'TECHNO LOGY',
        'system.admin': 'Admin',
        'system.logout': 'Logout'
      }
    };

    return (translations[language] as Record<string, string>)?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
