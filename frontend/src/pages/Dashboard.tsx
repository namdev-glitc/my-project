import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  TrendingUp,
  QrCode,
  Download,
  RefreshCw
} from 'lucide-react';
import { getGuestStats, getEventStats } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import RecentGuests from '../components/dashboard/RecentGuests';
import QuickActions from '../components/dashboard/QuickActions';
import EventsList from '../components/dashboard/EventsList';
import CountdownTimer from '../components/CountdownTimer';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { data: guestStats, isLoading: guestStatsLoading } = useQuery(
    'guestStats',
    getGuestStats,
    {
      refetchInterval: 5000, // Refresh every 5 seconds
      refetchOnWindowFocus: true
    }
  );

  const { data: eventStats } = useQuery(
    'eventStats',
    () => getEventStats(1)
  );

  const { data: events } = useQuery(
    'events',
    () => fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/events/`).then(res => res.json()),
    {
      refetchInterval: 30000, // Refresh every 30 seconds để cập nhật sự kiện
      refetchOnWindowFocus: true
    }
  );

  const handleQRScanner = () => {
    navigate('/scanner');
  };

  const handleExportReport = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/guests/export/excel`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bao_cao_khach_moi_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Xuất báo cáo thành công!');
      } else {
        toast.error('Có lỗi khi xuất báo cáo!');
      }
    } catch (error) {
      console.error('Export report error:', error);
      toast.error('Có lỗi khi xuất báo cáo!');
    }
  };

  const stats = [
    {
      title: t('dashboard.total_guests'),
      value: guestStats?.total_guests || 0,
      icon: Users,
      color: 'from-blue-600 to-blue-700',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: t('dashboard.checked_in'),
      value: guestStats?.checked_in || 0,
      icon: QrCode,
      color: 'from-green-600 to-green-700',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: t('dashboard.rsvp_accepted'),
      value: guestStats?.rsvp_accepted || 0,
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-700',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: t('guests.pending_count'),
      value: guestStats?.rsvp_pending || 0,
      icon: Clock,
      color: 'from-orange-600 to-orange-700',
      change: '-5%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-indigo-800">{t('dashboard.title')}</h1>
          <p className="text-gray-400 dark:text-indigo-600 mt-2">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => window.location.reload()}
            className="btn-exp flex items-center space-x-2"
            title="Làm mới trang"
          >
            <RefreshCw size={20} />
            <span>{t('dashboard.refresh')}</span>
          </button>
          <button 
            onClick={handleQRScanner}
            className="btn-exp flex items-center space-x-2"
          >
            <QrCode size={20} />
            <span>{t('dashboard.qr_scanner')}</span>
          </button>
          <button 
            onClick={handleExportReport}
            className="btn-exp flex items-center space-x-2"
          >
            <Download size={20} />
            <span>{t('dashboard.export_report')}</span>
          </button>
        </div>
      </div>

      {/* Countdown Timer */}
      {(() => {
        // Lấy sự kiện sắp tới nhất (chưa diễn ra)
        const now = new Date();
        const upcomingEvents = events?.filter((event: any) => {
          const eventDate = new Date(event.event_date);
          return eventDate > now; // Chỉ lấy sự kiện chưa diễn ra
        }).sort((a: any, b: any) => {
          const dateA = new Date(a.event_date);
          const dateB = new Date(b.event_date);
          return dateA.getTime() - dateB.getTime(); // Sắp xếp theo thời gian gần nhất
        });
        
        const upcomingEvent = upcomingEvents?.[0]; // Lấy sự kiện gần nhất
        
        if (upcomingEvent) {
          return (
            <CountdownTimer
              eventDate={upcomingEvent.event_date}
              eventName={upcomingEvent.name}
              eventLocation={upcomingEvent.location}
              variant="dashboard"
              className="mb-6"
            />
          );
        }
        
        // Nếu không có sự kiện nào sắp tới
        return (
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-6 text-white text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Không có sự kiện sắp tới</h3>
                <p className="text-gray-300">Tất cả sự kiện đã kết thúc hoặc chưa được lên lịch</p>
                <p className="text-gray-400 text-sm mt-2">
                  Tổng số sự kiện: {events?.length || 0} | 
                  Sự kiện tương lai: {upcomingEvents?.length || 0}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Stats Grid - 4 cards in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
            changeType={stat.changeType as "positive" | "negative" | "neutral"}
            loading={guestStatsLoading}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2">
          <EventsList />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Guests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentGuests />
        
        {/* Additional widgets can be added here */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Thống kê theo tổ chức
          </h3>
          <div className="space-y-3">
            {(eventStats?.organizations || []).slice(0, 5).map((org: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{org.name}</span>
                <span className="text-exp-primary font-semibold">{org.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

