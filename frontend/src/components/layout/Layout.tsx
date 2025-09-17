import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Mail, 
  QrCode, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ExpLogoImage from '../ExpLogoImage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: Home },
    { name: t('nav.guests'), href: '/guests', icon: Users },
    { name: t('nav.events'), href: '/events', icon: Calendar },
    { name: t('nav.invitations'), href: '/invitations', icon: Mail },
    { name: t('nav.qr_scanner'), href: '/scanner', icon: QrCode },
    { name: t('nav.reports'), href: '/reports', icon: BarChart3 },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-exp-dark to-gray-900 dark:bg-gradient-to-br dark:from-indigo-50 dark:via-purple-50 dark:to-cyan-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-exp-dark transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          {/* EXP Logo */}
          <div className="flex flex-col items-center">
            <ExpLogoImage size="xs" showText={true} />
            <p className="text-gray-400 text-xs mt-1">Company Limited</p>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-exp-gradient text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black border border-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.full_name || user?.username || 'Admin'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {user?.email || 'admin@exp-solution.io'}
              </p>
            </div>
            <button 
              onClick={logout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-exp-dark bg-opacity-90 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-white text-xl font-semibold">
                {t('system.title')}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:block text-sm text-gray-400">
                {t('system.anniversary')}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
