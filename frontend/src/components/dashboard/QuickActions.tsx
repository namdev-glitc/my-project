import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  QrCode, 
  BarChart3,
  Calendar
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Quản lý khách mời',
      description: 'Thêm và quản lý khách mời',
      icon: Plus,
      href: '/guests',
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Check-in',
      description: 'Quét QR code để check-in',
      icon: QrCode,
      href: '/scanner',
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Thống kê',
      description: 'Xem báo cáo chi tiết',
      icon: BarChart3,
      href: '/reports',
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Sự kiện',
      description: 'Quản lý sự kiện',
      icon: Calendar,
      href: '/events',
      color: 'from-orange-600 to-orange-700'
    }
  ];

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Thao tác nhanh
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.href}
              className="group relative overflow-hidden flex items-center space-x-4 p-4 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className={`relative z-10 w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Icon size={24} className="text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <div className="relative z-10 flex-1 min-w-0">
                <p className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors duration-300 mb-1">
                  {action.title}
                </p>
                <p className="text-gray-300 text-xs group-hover:text-gray-200 transition-colors duration-300">
                  {action.description}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;




