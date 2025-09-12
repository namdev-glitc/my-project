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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 z-10" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, tổ chức..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 input-exp"
          style={{ textIndent: '20px' }}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* RSVP Status Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Trạng thái RSVP
          </label>
          <select
            value={filters.rsvp_status}
            onChange={(e) => handleFilterChange('rsvp_status', e.target.value)}
            className="w-full input-exp"
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ phản hồi</option>
            <option value="accepted">Chấp nhận</option>
            <option value="declined">Từ chối</option>
          </select>
        </div>

        {/* Organization Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Tổ chức
          </label>
          <select
            value={filters.organization}
            onChange={(e) => handleFilterChange('organization', e.target.value)}
            className="w-full input-exp"
          >
            <option value="">Tất cả</option>
            <option value="ICTU">ICTU</option>
            <option value="Hachitech">Hachitech</option>
            <option value="EcomElite">EcomElite</option>
            <option value="Biva">Biva</option>
            <option value="GTE">GTE</option>
            <option value="Gstar">Gstar</option>
            <option value="Dino">Dino</option>
            <option value="SSE">SSE</option>
            <option value="ST">ST</option>
            <option value="EXP">EXP</option>
          </select>
        </div>

        {/* Check-in Status Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Trạng thái Check-in
          </label>
          <select
            value={filters.checked_in}
            onChange={(e) => handleFilterChange('checked_in', e.target.value)}
            className="w-full input-exp"
          >
            <option value="">Tất cả</option>
            <option value="true">Đã check-in</option>
            <option value="false">Chưa check-in</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-blue-400" />
            <span className="text-sm text-blue-400">Bộ lọc đang áp dụng:</span>
            {filters.rsvp_status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                RSVP: {filters.rsvp_status}
                <button
                  onClick={() => handleFilterChange('rsvp_status', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.organization && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Tổ chức: {filters.organization}
                <button
                  onClick={() => handleFilterChange('organization', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.checked_in && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Check-in: {filters.checked_in === 'true' ? 'Đã' : 'Chưa'}
                <button
                  onClick={() => handleFilterChange('checked_in', '')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;




