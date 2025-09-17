import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  Download, 
  Upload,
  Trash2
} from 'lucide-react';
import { getGuests, deleteGuest, getEvents, updateGuest, createGuest } from '../services/api';
import GuestTable from '../components/guests/GuestTable';
import GuestModal from '../components/guests/GuestModal';
import ImportModal from '../components/guests/ImportModal';
import SearchFilter from '../components/guests/SearchFilter';
import AnimatedCounter from '../components/AnimatedCounter';
import toast from 'react-hot-toast';

const Guests: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rsvp_status: '',
    organization: '',
    checked_in: ''
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const { data: guests, isLoading } = useQuery(
    ['guests', searchTerm, filters],
    () => getGuests({ search: searchTerm, ...filters })
  );

  const { data: events } = useQuery('events', getEvents);
  const currentEvent = events?.[0]; // Lấy event đầu tiên làm mặc định

  const deleteGuestMutation = useMutation(deleteGuest, {
    onSuccess: () => {
      queryClient.invalidateQueries('guests');
    }
  });

  const updateGuestMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => updateGuest(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('guests');
        toast.success('Cập nhật khách mời thành công!');
      },
      onError: () => {
        toast.error('Có lỗi khi cập nhật khách mời!');
      }
    }
  );

  const createGuestMutation = useMutation(
    (data: any) => createGuest(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('guests');
        toast.success('Thêm khách mời thành công!');
      },
      onError: () => {
        toast.error('Có lỗi khi thêm khách mời!');
      }
    }
  );

  const handleEdit = (guest: any) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  const handleDelete = (guestId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách mời này?')) {
      deleteGuestMutation.mutate(guestId);
    }
  };

  const handleToggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
  };

  const handleToggleSelectAll = (checked: boolean, currentIds: number[]) => {
    setSelectedIds(checked ? currentIds : []);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Xóa ${selectedIds.length} khách mời đã chọn?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteGuest(id)));
      setSelectedIds([]);
      queryClient.invalidateQueries('guests');
      toast.success('Đã xóa các khách mời đã chọn');
    } catch (err) {
      toast.error('Không thể xóa một số khách mời');
    }
  };

  const handleAddNew = () => {
    setSelectedGuest(null);
    setIsModalOpen(true);
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/guests/export/excel`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `guests_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Xuất Excel thành công!');
      } else {
        toast.error('Có lỗi khi xuất file!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Có lỗi khi xuất file!');
    }
  };


  const filteredGuests = guests?.filter((guest: any) => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        guest.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRsvp = !filters.rsvp_status || guest.rsvp_status === filters.rsvp_status;
    const matchesOrg = !filters.organization || guest.organization === filters.organization;
    const matchesCheckIn = filters.checked_in === '' || 
                          (filters.checked_in === 'true' && guest.checked_in) ||
                          (filters.checked_in === 'false' && !guest.checked_in);

    return matchesSearch && matchesRsvp && matchesOrg && matchesCheckIn;
  }) || [];

  const allSelected = filteredGuests.length > 0 && selectedIds.length === filteredGuests.map((g: any) => g.id).length;

  return (
    <div className="relative space-y-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-orange-900/10 pointer-events-none"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Header */}
      <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">Quản lý Khách mời</h1>
          <p className="text-gray-300 mt-2 text-lg">
            Quản lý danh sách khách mời và RSVP
          </p>
        </div>
        <div className="w-full grid grid-cols-3 gap-2 sm:w-auto sm:flex sm:space-x-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 flex items-center justify-center space-x-2 w-full sm:w-auto col-span-3 sm:col-span-1"
            >
              <Trash2 size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span>{allSelected ? 'Xóa tất cả' : `Xóa đã chọn (${selectedIds.length})`}</span>
            </button>
          )}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Upload size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleAddNew}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-pink-600 text-white py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Thêm khách mời</span>
          </button>
          <button 
            onClick={handleExportExcel}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative z-10 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Guests */}
        <div className="group relative overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <AnimatedCounter value={filteredGuests.length} />
            </div>
            <div className="text-gray-300 text-sm font-medium mb-3">Tổng khách mời</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>
          <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
        </div>

        {/* Accepted Guests */}
        <div className="group relative overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              <AnimatedCounter value={filteredGuests.filter((g: any) => g.rsvp_status === 'accepted').length} />
            </div>
            <div className="text-gray-300 text-sm font-medium mb-3">Đã chấp nhận</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                   style={{width: `${filteredGuests.length > 0 ? (filteredGuests.filter((g: any) => g.rsvp_status === 'accepted').length / filteredGuests.length) * 100 : 0}%`}}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {filteredGuests.length > 0 ? Math.round((filteredGuests.filter((g: any) => g.rsvp_status === 'accepted').length / filteredGuests.length) * 100) : 0}%
            </div>
          </div>
          <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
        </div>

        {/* Pending Guests */}
        <div className="group relative overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
              <AnimatedCounter value={filteredGuests.filter((g: any) => g.rsvp_status === 'pending').length} />
            </div>
            <div className="text-gray-300 text-sm font-medium mb-3">Chờ phản hồi</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" 
                   style={{width: `${filteredGuests.length > 0 ? (filteredGuests.filter((g: any) => g.rsvp_status === 'pending').length / filteredGuests.length) * 100 : 0}%`}}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {filteredGuests.length > 0 ? Math.round((filteredGuests.filter((g: any) => g.rsvp_status === 'pending').length / filteredGuests.length) * 100) : 0}%
            </div>
          </div>
          <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
        </div>

        {/* Checked-in Guests */}
        <div className="group relative overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <AnimatedCounter value={filteredGuests.filter((g: any) => g.checked_in).length} />
            </div>
            <div className="text-gray-300 text-sm font-medium mb-3">Đã check-in</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                   style={{width: `${filteredGuests.length > 0 ? (filteredGuests.filter((g: any) => g.checked_in).length / filteredGuests.length) * 100 : 0}%`}}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {filteredGuests.length > 0 ? Math.round((filteredGuests.filter((g: any) => g.checked_in).length / filteredGuests.length) * 100) : 0}%
            </div>
          </div>
          <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="relative z-10 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
        <GuestTable
          guests={filteredGuests}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          event={currentEvent}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      </div>

      {/* Modals */}
      {isModalOpen && (
        <GuestModal
          guest={selectedGuest}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGuest(null);
          }}
          onUpdate={updateGuestMutation.mutate}
          onCreate={createGuestMutation.mutate}
          isLoading={updateGuestMutation.isLoading || createGuestMutation.isLoading}
        />
      )}

      {isImportModalOpen && (
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Guests;


