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
    <div className="relative space-y-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-orange-900/10 pointer-events-none"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{t('dashboard.title')}</h1>
          <p className="text-gray-300 mt-2 text-lg">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => window.location.reload()}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center space-x-2"
            title="Làm mới trang"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-300" />
            <span>{t('dashboard.refresh')}</span>
          </button>
          <button 
            onClick={handleQRScanner}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 flex items-center space-x-2"
          >
            <QrCode size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>{t('dashboard.qr_scanner')}</span>
          </button>
          <button 
            onClick={handleExportReport}
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 flex items-center space-x-2"
          >
            <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
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
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
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

