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
    <div className="card-exp">
      <h3 className="text-lg font-semibold text-white mb-4">
        Thao tác nhanh
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.href}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 group"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm group-hover:text-exp-primary transition-colors duration-200">
                  {action.title}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;




