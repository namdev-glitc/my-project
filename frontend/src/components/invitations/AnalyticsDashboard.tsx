import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Star,
  Heart,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  totalInvitations: number;
  sentInvitations: number;
  deliveredInvitations: number;
  openedInvitations: number;
  respondedInvitations: number;
  acceptedInvitations: number;
  declinedInvitations: number;
  openRate: number;
  responseRate: number;
  acceptanceRate: number;
  deliveryRate: number;
  avgResponseTime: number;
  popularTemplates: Array<{
    id: number;
    name: string;
    usage: number;
    openRate: number;
  }>;
  recentActivity: Array<{
    id: number;
    action: string;
    guest: string;
    timestamp: string;
    status: 'success' | 'pending' | 'error';
  }>;
  dailyStats: Array<{
    date: string;
    sent: number;
    opened: number;
    responded: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  onRefresh: () => void;
  onExport: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  onRefresh,
  onExport
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'templates' | 'activity' | 'trends'>('overview');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-green-400" size={16} />;
      case 'pending': return <Clock className="text-yellow-400" size={16} />;
      case 'error': return <AlertCircle className="text-red-400" size={16} />;
      default: return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="text-white" size={24} />
          <h2 className="text-2xl font-bold text-white">Phân tích thiệp mời</h2>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
            <option value="1y">1 năm qua</option>
          </select>
          <button
            onClick={onRefresh}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-white rounded-lg transition-all duration-200"
          >
            <Download size={16} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
          { id: 'templates', label: 'Mẫu thiệp', icon: Star },
          { id: 'activity', label: 'Hoạt động', icon: Clock },
          { id: 'trends', label: 'Xu hướng', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedMetric(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedMetric === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedMetric === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Tổng thiệp mời</p>
                  <p className="text-3xl font-bold text-white">{data.totalInvitations}</p>
                </div>
                <Mail className="text-blue-400" size={24} />
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-400" size={16} />
                <span className="text-green-400 text-sm">+12% so với tháng trước</span>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Tỷ lệ mở</p>
                  <p className="text-3xl font-bold text-white">{data.openRate}%</p>
                </div>
                <Eye className="text-green-400" size={24} />
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-400" size={16} />
                <span className="text-green-400 text-sm">+5% so với tháng trước</span>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Tỷ lệ phản hồi</p>
                  <p className="text-3xl font-bold text-white">{data.responseRate}%</p>
                </div>
                <CheckCircle className="text-purple-400" size={24} />
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-400" size={16} />
                <span className="text-green-400 text-sm">+8% so với tháng trước</span>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Tỷ lệ chấp nhận</p>
                  <p className="text-3xl font-bold text-white">{data.acceptanceRate}%</p>
                </div>
                <Heart className="text-pink-400" size={24} />
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-green-400" size={16} />
                <span className="text-green-400 text-sm">+3% so với tháng trước</span>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Tiến độ gửi thiệp</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Đã gửi</span>
                    <span className="text-white">{data.sentInvitations}/{data.totalInvitations}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${(data.sentInvitations / data.totalInvitations) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Đã nhận</span>
                    <span className="text-white">{data.deliveredInvitations}/{data.sentInvitations}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(data.deliveredInvitations / data.sentInvitations) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Đã mở</span>
                    <span className="text-white">{data.openedInvitations}/{data.deliveredInvitations}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${(data.openedInvitations / data.deliveredInvitations) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Phản hồi khách mời</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Chấp nhận</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white font-semibold">{data.acceptedInvitations}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Từ chối</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-white font-semibold">{data.declinedInvitations}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Chờ phản hồi</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-white font-semibold">{data.respondedInvitations - data.acceptedInvitations - data.declinedInvitations}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {selectedMetric === 'templates' && (
        <div className="space-y-6">
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Mẫu thiệp phổ biến</h3>
            <div className="space-y-4">
              {data.popularTemplates.map((template, index) => (
                <div key={template.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{template.name}</h4>
                      <p className="text-gray-400 text-sm">{template.usage} lần sử dụng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{template.openRate}%</p>
                    <p className="text-gray-400 text-sm">Tỷ lệ mở</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {selectedMetric === 'activity' && (
        <div className="space-y-6">
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Hoạt động gần đây</h3>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.guest}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status === 'success' ? 'Thành công' : 
                       activity.status === 'pending' ? 'Đang xử lý' : 'Lỗi'}
                    </p>
                    <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {selectedMetric === 'trends' && (
        <div className="space-y-6">
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Xu hướng 30 ngày qua</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-400">Biểu đồ xu hướng sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;



