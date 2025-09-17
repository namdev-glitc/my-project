import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { 
  Download, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Building2,
  UserCheck,
  UserX,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  Eye,
  Search,
  ArrowUpDown,
  Bell,
  Settings,
  Zap,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';
import { getGuestStats, getEventStats, getGuests, getEvents } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  Legend,
  ReferenceLine
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  
  // State management
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month, quarter, year
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeTab, setActiveTab] = useState('overview'); // overview, trends, guests, comparison
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  
  // Queries với dữ liệu thật
  const { data: events = [] } = useQuery('events', getEvents);
  const { data: guestStats, isLoading: guestStatsLoading, refetch: refetchGuestStats } = useQuery(
    ['guestStats', selectedEvent?.id],
    () => selectedEvent ? getEventStats(selectedEvent.id) : getGuestStats(),
    {
      enabled: !!selectedEvent,
      refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
    }
  );

  const { data: eventStats, isLoading: eventStatsLoading, refetch: refetchEventStats } = useQuery(
    ['eventStats', selectedEvent?.id],
    () => selectedEvent ? getEventStats(selectedEvent.id) : null,
    {
      enabled: !!selectedEvent,
      refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
    }
  );

  const { data: guests = [], isLoading: guestsLoading, refetch: refetchGuests } = useQuery(
    ['guests', selectedEvent?.id],
    () => selectedEvent ? getGuests({ event_id: selectedEvent.id }) : getGuests(),
    {
      refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
    }
  );

  // Auto-select first event
  useEffect(() => {
    if (events && events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events, selectedEvent]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        refetchGuestStats();
        refetchEventStats();
        refetchGuests();
        toast.success('Đã cập nhật dữ liệu! 🔄', { duration: 2000 });
      }, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, refetchGuestStats, refetchEventStats, refetchGuests]);

  // Generate trend data from real guest data
  const generateTrendData = () => {
    if (!guests || guests.length === 0) return [];
    
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count RSVP and check-ins for this date
      const dayGuests = guests.filter((guest: any) => {
        const guestDate = new Date(guest.created_at).toISOString().split('T')[0];
        return guestDate === dateStr;
      });
      
      const rsvpCount = dayGuests.filter((guest: any) => guest.rsvp_status === 'accepted').length;
      const checkinCount = dayGuests.filter((guest: any) => guest.checked_in).length;
      const pendingCount = dayGuests.filter((guest: any) => guest.rsvp_status === 'pending').length;
      
      days.push({
        date: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
        rsvp: rsvpCount,
        checkin: checkinCount,
        pending: pendingCount
      });
    }
    return days;
  };

  const trendData = generateTrendData();

  // Event comparison data from real events
  const eventComparisonData = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return events.map((event: any) => {
      const eventGuests = guests.filter((guest: any) => guest.event_id === event.id);
      const checkedIn = eventGuests.filter((guest: any) => guest.checked_in).length;
      const totalGuests = eventGuests.length;
      const rsvpAccepted = eventGuests.filter((guest: any) => guest.rsvp_status === 'accepted').length;
      const efficiency = totalGuests > 0 ? Math.round((checkedIn / totalGuests) * 100) : 0;
      
      return {
        name: event.name,
        guests: totalGuests,
        checkedIn: checkedIn,
        rsvpAccepted: rsvpAccepted,
        efficiency: efficiency
      };
    });
  }, [events, guests]);

  // Filtered and sorted guests
  const filteredGuests = React.useMemo(() => {
    if (!guests) return [];
    
    let filtered = guests.filter((guest: any) => {
      const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guest.organization?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort guests
    filtered.sort((a: any, b: any) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [guests, searchTerm, sortBy, sortOrder]);

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

  // Export functions với API thật
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const endpoint = format === 'excel' ? 'excel' : 'csv'; // Backend chỉ hỗ trợ Excel và CSV
      let apiUrl = `${process.env.REACT_APP_API_URL || '/api'}/guests/export/${endpoint}`;
      
      if (selectedEvent) {
        const params = new URLSearchParams({ event_id: selectedEvent.id.toString() });
        apiUrl += `?${params}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        const extension = format === 'excel' ? 'xlsx' : 'csv';
        const eventName = selectedEvent ? `_${selectedEvent.name.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
        link.download = `bao_cao_khach_moi${eventName}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        toast.success(`Xuất báo cáo ${format.toUpperCase()} thành công! 📊`);
      } else {
        toast.error('Có lỗi khi xuất báo cáo!');
      }
    } catch (error) {
      console.error('Export report error:', error);
      toast.error('Có lỗi khi xuất báo cáo!');
    }
  };

  const exportGuestList = () => {
    if (!filteredGuests.length) {
      toast.error('Không có dữ liệu để xuất!');
      return;
    }

    const csvContent = [
      ['Tên', 'Tổ chức', 'Trạng thái RSVP', 'Check-in', 'Email', 'Số điện thoại'],
      ...filteredGuests.map((guest: any) => [
        guest.name,
        guest.organization || 'N/A',
        guest.rsvp_status || 'pending',
        guest.checked_in ? 'Có' : 'Không',
        guest.email || 'N/A',
        guest.phone || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_khach_moi_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Xuất danh sách khách mời thành công! 📋');
  };

  const refreshData = () => {
    refetchGuestStats();
    refetchEventStats();
    refetchGuests();
    toast.success('Đã làm mới dữ liệu! 🔄');
  };

  if (guestStatsLoading || (selectedEvent && eventStatsLoading) || guestsLoading) {
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
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-exp-gradient rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Báo cáo & Phân tích</h1>
                <p className="text-gray-300">
                  Dashboard thống kê và phân tích chi tiết
          </p>
        </div>
            </div>
            
            {/* Event Selector */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-blue-300" />
                <span className="text-sm text-gray-300">Sự kiện:</span>
                <select
                  value={selectedEvent?.id || ''}
                  onChange={(e) => {
                    const event = events?.find((ev: any) => ev.id === parseInt(e.target.value));
                    setSelectedEvent(event);
                  }}
                  className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm w-full sm:w-auto max-w-full"
                >
                  {events?.map((event: any) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Auto-refresh indicator */}
              {autoRefresh && (
                <div className="flex items-center space-x-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Auto-refresh {refreshInterval}s</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="w-full grid grid-cols-3 gap-2 sm:w-auto sm:flex sm:items-center sm:space-x-3">
        <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Filter size={20} className="text-white" />
            </button>
            
            <button
              onClick={refreshData}
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={20} className="text-white" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-3 rounded-lg transition-colors ${
                  autoRefresh ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Zap size={20} className="text-white" />
              </button>
              {autoRefresh && (
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs w-full sm:w-auto"
                >
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
              <button
                onClick={() => exportReport('excel')}
          className="btn-exp flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
                <FileText size={16} />
                <span>Excel</span>
              </button>
        <button
                onClick={() => exportReport('pdf')}
          className="btn-exp flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
                <Download size={16} />
                <span>PDF</span>
        </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card-exp bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Filter size={20} className="mr-2" />
            Bộ lọc & Tùy chỉnh
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Filter */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Lọc theo thời gian</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
              
              {dateFilter === 'custom' && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                  />
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                  />
                </div>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Tìm kiếm khách mời</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tên, tổ chức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Sắp xếp</label>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-2 py-2 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                >
                  <option value="name">Tên</option>
                  <option value="organization">Tổ chức</option>
                  <option value="rsvp_status">RSVP</option>
                  <option value="checked_in">Check-in</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white hover:bg-gray-600"
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 sm:flex sm:space-x-1 bg-gray-800/50 rounded-lg p-1 overflow-hidden">
        {[
          { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
          { id: 'trends', name: 'Xu hướng', icon: LineChart },
          { id: 'guests', name: 'Khách mời', icon: Users },
          { id: 'comparison', name: 'So sánh', icon: Target }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-2 text-xs sm:text-sm sm:py-3 sm:px-4 rounded-md transition-colors truncate ${
                activeTab === tab.id
                  ? 'bg-exp-gradient text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon size={16} />
              <span className="font-medium">{tab.name}</span>
        </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-exp group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Tổng khách mời</p>
              <p className="text-2xl font-bold text-white mt-1">
                {guestStats?.total_guests || 0}
              </p>
                  <p className="text-blue-400 text-xs mt-1">
                    {selectedEvent?.name || 'Tất cả sự kiện'}
              </p>
            </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>

            <div className="card-exp group hover:scale-105 transition-transform duration-200">
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
        </div>

            <div className="card-exp group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">RSVP Chấp nhận</p>
              <p className="text-2xl font-bold text-white mt-1">
                {guestStats?.rsvp_accepted || 0}
              </p>
                  <p className="text-purple-400 text-xs mt-1">
                    {guestStats?.total_guests > 0 
                      ? Math.round((guestStats?.rsvp_accepted / guestStats?.total_guests) * 100)
                      : 0}% tỷ lệ
              </p>
            </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>

            <div className="card-exp group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Chờ phản hồi</p>
              <p className="text-2xl font-bold text-white mt-1">
                {guestStats?.rsvp_pending || 0}
              </p>
                  {guestStats?.rsvp_pending > 0 && (
                    <p className="text-yellow-400 text-xs mt-1 flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      Cần theo dõi
                    </p>
                  )}
            </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Status Chart */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChartIcon size={20} className="mr-2 text-blue-400" />
            Phân bố RSVP
          </h3>
          
          {/* RSVP Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-700/30">
              <div className="text-lg font-bold text-green-400">
                {guestStats?.rsvp_accepted || 0}
              </div>
              <div className="text-xs text-green-300">Chấp nhận</div>
            </div>
            <div className="text-center p-3 bg-red-900/20 rounded-lg border border-red-700/30">
              <div className="text-lg font-bold text-red-400">
                {guestStats?.rsvp_declined || 0}
              </div>
              <div className="text-xs text-red-300">Từ chối</div>
            </div>
            <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
              <div className="text-lg font-bold text-yellow-400">
                {guestStats?.rsvp_pending || 0}
              </div>
              <div className="text-xs text-yellow-300">Chờ phản hồi</div>
            </div>
          </div>

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
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} khách mời (${rsvpData.find((item: any) => item.name === name)?.value > 0 
                      ? Math.round((value / (guestStats?.total_guests || 1)) * 100) 
                      : 0}%)`, 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {rsvpData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white/20" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{item.value}</div>
                  <div className="text-xs text-gray-400">
                    {(guestStats?.total_guests || 0) > 0 
                      ? Math.round((item.value / (guestStats?.total_guests || 1)) * 100) 
                      : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in Status Chart */}
        <div className="card-exp">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CheckCircle size={20} className="mr-2 text-green-400" />
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
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
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
        </>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RSVP Trends */}
            <div className="card-exp">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <LineChart size={20} className="mr-2 text-purple-400" />
                Xu hướng RSVP 7 ngày qua
              </h3>
              
              {/* Trend Summary */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-green-900/20 rounded border border-green-700/30">
                  <div className="text-sm font-bold text-green-400">
                    {trendData.reduce((sum, day) => sum + day.rsvp, 0)}
                  </div>
                  <div className="text-xs text-green-300">RSVP Tổng</div>
                </div>
                <div className="text-center p-2 bg-blue-900/20 rounded border border-blue-700/30">
                  <div className="text-sm font-bold text-blue-400">
                    {trendData.reduce((sum, day) => sum + day.checkin, 0)}
                  </div>
                  <div className="text-xs text-blue-300">Check-in Tổng</div>
                </div>
                <div className="text-center p-2 bg-yellow-900/20 rounded border border-yellow-700/30">
                  <div className="text-sm font-bold text-yellow-400">
                    {trendData.reduce((sum, day) => sum + day.pending, 0)}
                  </div>
                  <div className="text-xs text-yellow-300">Chờ phản hồi</div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
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
                      formatter={(value: any, name: any) => [
                        `${value} khách mời`,
                        name === 'rsvp' ? 'RSVP Chấp nhận' : 
                        name === 'checkin' ? 'Check-in' : 'Chờ phản hồi'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rsvp" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="RSVP Chấp nhận"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="checkin" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Check-in"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                      name="Chờ phản hồi"
                      strokeDasharray="5 5"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="card-exp">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 size={20} className="mr-2 text-blue-400" />
                Hoạt động theo giờ
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
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
                    <Area 
                      type="monotone" 
                      dataKey="pending" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="checkin" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card-exp">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award size={20} className="mr-2 text-yellow-400" />
              Chỉ số hiệu suất
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-700/30">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {guestStats?.check_in_rate || 0}%
                </div>
                <div className="text-white font-medium mb-1">Tỷ lệ Check-in</div>
                <div className="text-green-300 text-sm">Hiệu quả tốt</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-700/30">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {guestStats?.total_guests > 0 
                    ? Math.round((guestStats?.rsvp_accepted / guestStats?.total_guests) * 100)
                    : 0}%
                </div>
                <div className="text-white font-medium mb-1">Tỷ lệ RSVP</div>
                <div className="text-blue-300 text-sm">Phản hồi tích cực</div>
      </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-700/30">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {organizationDetails.length}
                </div>
                <div className="text-white font-medium mb-1">Tổ chức tham gia</div>
                <div className="text-purple-300 text-sm">Đa dạng</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guests' && (
        <div className="space-y-6">
          {/* Guest List Header */}
          <div className="card-exp">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Users size={20} className="mr-2 text-blue-400" />
                  Danh sách khách mời chi tiết
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {filteredGuests.length} khách mời được tìm thấy
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={exportGuestList}
                  className="btn-exp flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Xuất CSV</span>
                </button>
                <button
                  onClick={() => setShowGuestDetails(!showGuestDetails)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showGuestDetails ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Eye size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Guest Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Khách mời</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Tổ chức</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">RSVP</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Check-in</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest: any, index: number) => (
                    <tr key={guest.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {guest.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{guest.name}</div>
                            {showGuestDetails && (
                              <div className="text-gray-400 text-xs">{guest.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {guest.organization || 'Chưa có'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            guest.rsvp_status === 'accepted' 
                              ? 'bg-green-400'
                              : guest.rsvp_status === 'declined'
                              ? 'bg-red-400'
                              : 'bg-yellow-400'
                          }`}></div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            guest.rsvp_status === 'accepted' 
                              ? 'bg-green-900/30 text-green-300 border-green-700/50'
                              : guest.rsvp_status === 'declined'
                              ? 'bg-red-900/30 text-red-300 border-red-700/50'
                              : 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
                          }`}>
                            {guest.rsvp_status === 'accepted' ? '✓ Chấp nhận' : 
                             guest.rsvp_status === 'declined' ? '✗ Từ chối' : '⏳ Chờ phản hồi'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {guest.checked_in ? (
                          <span className="flex items-center text-green-400">
                            <CheckCircle size={14} className="mr-1" />
                            Đã check-in
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-400">
                            <Clock size={14} className="mr-1" />
                            Chưa check-in
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {guest.created_at ? new Date(guest.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Event Comparison */}
          <div className="card-exp">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target size={20} className="mr-2 text-orange-400" />
              So sánh hiệu suất sự kiện
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={eventComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                  <Legend />
                  <Bar 
                    dataKey="guests" 
                    fill="#3b82f6" 
                    name="Tổng khách mời"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="checkedIn" 
                    fill="#10b981" 
                    name="Đã check-in"
                    radius={[2, 2, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    name="Hiệu suất %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Benchmark Table */}
          <div className="card-exp">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award size={20} className="mr-2 text-yellow-400" />
              Bảng xếp hạng sự kiện
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Xếp hạng</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Sự kiện</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Khách mời</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Check-in</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Hiệu suất</th>
                  </tr>
                </thead>
                <tbody>
                  {eventComparisonData
                    .sort((a: any, b: any) => b.efficiency - a.efficiency)
                    .map((event: any, index: number) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white font-medium">{event.name}</td>
                      <td className="py-3 px-4 text-gray-300">{event.guests}</td>
                      <td className="py-3 px-4 text-gray-300">{event.checkedIn}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${event.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm font-medium">{event.efficiency}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Organization Details - Only show in overview tab */}
      {activeTab === 'overview' && (
      <div className="card-exp">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Building2 className="mr-2 text-blue-400" size={20} />
          Chi tiết khách mời theo tổ chức
        </h3>
        
        {organizationDetails.length > 0 ? (
          <div className="space-y-4">
            {organizationDetails.map((org, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
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
      )}

      {/* Smart Insights - Only show in overview tab */}
      {activeTab === 'overview' && (
        <div className="card-exp bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Bell size={20} className="mr-2 text-purple-400" />
            Thông tin thông minh & Khuyến nghị
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Target size={16} className="mr-2 text-green-400" />
                Thống kê chung
              </h4>
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
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Settings size={16} className="mr-2 text-yellow-400" />
                Khuyến nghị hành động
              </h4>
            <div className="space-y-2 text-sm text-gray-300">
              {guestStats?.rsvp_pending > 0 && (
                  <p className="flex items-start space-x-2">
                    <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Còn {guestStats.rsvp_pending} khách mời chưa phản hồi RSVP - nên gửi nhắc nhở</span>
                  </p>
              )}
              {guestStats?.check_in_rate < 50 && (
                  <p className="flex items-start space-x-2">
                    <AlertTriangle size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Tỷ lệ check-in thấp - cần kiểm tra lại quy trình check-in</span>
                  </p>
              )}
              {guestStats?.rsvp_accepted > 0 && (
                  <p className="flex items-start space-x-2">
                    <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Sự kiện có {guestStats.rsvp_accepted} khách mời xác nhận tham gia</span>
                  </p>
                )}
                {organizationDetails.length > 3 && (
                  <p className="flex items-start space-x-2">
                    <Building2 size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Đa dạng {organizationDetails.length} tổ chức tham gia</span>
                  </p>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Reports;


