import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    rsvp_status: string;
    organization: string;
    checked_in: string;
  };
  onFiltersChange: (filters: any) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      rsvp_status: '',
      organization: '',
      checked_in: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 z-10" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, tổ chức..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RSVP Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Trạng thái RSVP
          </label>
          <select
            value={filters.rsvp_status}
            onChange={(e) => handleFilterChange('rsvp_status', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/10"
          >
            <option value="" className="bg-gray-800">Tất cả</option>
            <option value="pending" className="bg-gray-800">Chờ phản hồi</option>
            <option value="accepted" className="bg-gray-800">Chấp nhận</option>
            <option value="declined" className="bg-gray-800">Từ chối</option>
          </select>
        </div>

        {/* Organization Filter */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Tổ chức
          </label>
          <select
            value={filters.organization}
            onChange={(e) => handleFilterChange('organization', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/10"
          >
            <option value="" className="bg-gray-800">Tất cả</option>
            <option value="ICTU" className="bg-gray-800">ICTU</option>
            <option value="Hachitech" className="bg-gray-800">Hachitech</option>
            <option value="EcomElite" className="bg-gray-800">EcomElite</option>
            <option value="Biva" className="bg-gray-800">Biva</option>
            <option value="GTE" className="bg-gray-800">GTE</option>
            <option value="Gstar" className="bg-gray-800">Gstar</option>
            <option value="Dino" className="bg-gray-800">Dino</option>
            <option value="SSE" className="bg-gray-800">SSE</option>
            <option value="ST" className="bg-gray-800">ST</option>
            <option value="EXP" className="bg-gray-800">EXP</option>
          </select>
        </div>

        {/* Check-in Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Trạng thái Check-in
          </label>
          <select
            value={filters.checked_in}
            onChange={(e) => handleFilterChange('checked_in', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white/10"
          >
            <option value="" className="bg-gray-800">Tất cả</option>
            <option value="true" className="bg-gray-800">Đã check-in</option>
            <option value="false" className="bg-gray-800">Chưa check-in</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center space-x-3">
            <Filter size={18} className="text-blue-400" />
            <span className="text-sm font-semibold text-white">Bộ lọc đang áp dụng:</span>
            <div className="flex items-center space-x-2">
              {filters.rsvp_status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                  RSVP: {filters.rsvp_status}
                  <button
                    onClick={() => handleFilterChange('rsvp_status', '')}
                    className="ml-2 text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.organization && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                  Tổ chức: {filters.organization}
                  <button
                    onClick={() => handleFilterChange('organization', '')}
                    className="ml-2 text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.checked_in && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                  Check-in: {filters.checked_in === 'true' ? 'Đã' : 'Chưa'}
                  <button
                    onClick={() => handleFilterChange('checked_in', '')}
                    className="ml-2 text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;




