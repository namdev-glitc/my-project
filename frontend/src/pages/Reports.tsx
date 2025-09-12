import React from 'react';
import { useQuery } from 'react-query';
import { 
  Download, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Building2,
  UserCheck,
  UserX
} from 'lucide-react';
import { getGuestStats, getEventStats, getGuests } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  
  const { data: guestStats, isLoading: guestStatsLoading } = useQuery(
    'guestStats',
    getGuestStats
  );

  const { data: eventStats, isLoading: eventStatsLoading } = useQuery(
    'eventStats',
    () => getEventStats(1) // Default event ID
  );

  const { data: guests, isLoading: guestsLoading } = useQuery(
    'guests',
    () => getGuests({})
  );

  const rsvpData = [
    { name: 'Chấp nhận', value: guestStats?.rsvp_accepted || 0, color: '#10b981' },
    { name: 'Từ chối', value: guestStats?.rsvp_declined || 0, color: '#ef4444' },
    { name: 'Chờ phản hồi', value: guestStats?.rsvp_pending || 0, color: '#f59e0b' }
  ];

  const checkinData = [
    { name: 'Đã check-in', value: guestStats?.checked_in || 0, color: '#3b82f6' },
    { name: 'Chưa check-in', value: (guestStats?.total_guests || 0) - (guestStats?.checked_in || 0), color: '#6b7280' }
  ];

  const organizationData = eventStats?.organizations?.map((org: any) => ({
    name: org.name,
    count: org.count
  })) || [];

  // Tính toán chi tiết theo tổ chức
  const organizationDetails = React.useMemo(() => {
    if (!guests) return [];
    
    const orgMap = new Map();
    
    guests.forEach((guest: any) => {
      const org = guest.organization || 'Chưa có tổ chức';
      if (!orgMap.has(org)) {
        orgMap.set(org, {
          name: org,
          total: 0,
          checkedIn: 0,
          pending: 0,
          accepted: 0,
          declined: 0
        });
      }
      
      const orgData = orgMap.get(org);
      orgData.total++;
      
      if (guest.checked_in) {
        orgData.checkedIn++;
      }
      
      switch (guest.rsvp_status) {
        case 'accepted':
          orgData.accepted++;
          break;
        case 'declined':
          orgData.declined++;
          break;
        case 'pending':
        default:
          orgData.pending++;
          break;
      }
    });
    
    return Array.from(orgMap.values()).sort((a, b) => b.total - a.total);
  }, [guests]);

  const exportReport = async () => {
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

  if (guestStatsLoading || eventStatsLoading || guestsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-600 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="card-exp animate-pulse">
              <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('reports.title')}</h1>
          <p className="text-gray-400 mt-2">
            {t('reports.subtitle')}
          </p>
        </div>
        <button
          onClick={exportReport}
          className="btn-exp flex items-center space-x-2"
        >
          <Download size={20} />
          <span>{t('reports.export_report')}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-exp">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Tổng khách mời</p>
              <p className="text-2xl font-bold text-white mt-1">
                {guestStats?.total_guests || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-exp">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Đã check-in</p>
              <p className="text-2xl font-bold text-white mt-1">
                {guestStats?.checked_in || 0}
              </p>
              <p className="text-green-400 text-sm">
                {guestStats?.check_in_rate || 0}% tỷ lệ
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-exp">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">RSVP Chấp nhận</p>
              <p className="text-2xl font-bold text-white mt-1">
                {guestStats?.rsvp_accepted || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-exp">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Chờ phản hồi</p>
              <p className="text-2xl font-bold text-white mt-1">
                {guestStats?.rsvp_pending || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Status Chart */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Phân bố RSVP
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rsvpData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rsvpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {rsvpData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in Status Chart */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Trạng thái Check-in
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={checkinData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {checkinData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {checkinData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organization Details */}
      <div className="card-exp">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Building2 className="mr-2 text-blue-400" size={20} />
          Chi tiết khách mời theo tổ chức
        </h3>
        
        {organizationDetails.length > 0 ? (
          <div className="space-y-4">
            {organizationDetails.map((org, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Building2 size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{org.name}</h4>
                      <p className="text-gray-400 text-sm">{org.total} người</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">{org.total}</div>
                    <div className="text-xs text-gray-400">tổng cộng</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-900/30 rounded-lg p-3 border border-green-700/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <UserCheck size={14} className="text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Đã check-in</span>
                    </div>
                    <div className="text-white font-bold text-lg">{org.checkedIn}</div>
                  </div>
                  
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock size={14} className="text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">Chờ phản hồi</span>
                    </div>
                    <div className="text-white font-bold text-lg">{org.pending}</div>
                  </div>
                  
                  <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle size={14} className="text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">Chấp nhận</span>
                    </div>
                    <div className="text-white font-bold text-lg">{org.accepted}</div>
                  </div>
                  
                  <div className="bg-red-900/30 rounded-lg p-3 border border-red-700/30">
                    <div className="flex items-center space-x-2 mb-1">
                      <UserX size={14} className="text-red-400" />
                      <span className="text-red-400 text-sm font-medium">Từ chối</span>
                    </div>
                    <div className="text-white font-bold text-lg">{org.declined}</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Tỷ lệ check-in</span>
                    <span>{org.total > 0 ? Math.round((org.checkedIn / org.total) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${org.total > 0 ? (org.checkedIn / org.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400">Chưa có dữ liệu tổ chức</p>
          </div>
        )}
      </div>

      {/* Organization Chart */}
      {organizationData.length > 0 && (
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4">
            Biểu đồ phân bố theo Tổ chức
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={organizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#00bcd4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="card-exp">
        <h3 className="text-lg font-semibold text-white mb-4">
          Tóm tắt sự kiện
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Thống kê chung</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Tổng số khách mời:</span>
                <span className="text-white font-medium">{guestStats?.total_guests || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tỷ lệ check-in:</span>
                <span className="text-white font-medium">{guestStats?.check_in_rate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tỷ lệ RSVP chấp nhận:</span>
                <span className="text-white font-medium">
                  {guestStats?.total_guests > 0 
                    ? Math.round((guestStats?.rsvp_accepted / guestStats?.total_guests) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Khuyến nghị</h4>
            <div className="space-y-2 text-sm text-gray-300">
              {guestStats?.rsvp_pending > 0 && (
                <p>• Còn {guestStats.rsvp_pending} khách mời chưa phản hồi RSVP</p>
              )}
              {guestStats?.check_in_rate < 50 && (
                <p>• Tỷ lệ check-in thấp, cần kiểm tra lại quy trình</p>
              )}
              {guestStats?.rsvp_accepted > 0 && (
                <p>• Sự kiện có {guestStats.rsvp_accepted} khách mời xác nhận tham gia</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;


