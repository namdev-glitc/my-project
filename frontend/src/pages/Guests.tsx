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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/guests/export/excel`);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Quản lý Khách mời</h1>
          <p className="text-blue-500 mt-2">
            Quản lý danh sách khách mời và RSVP
          </p>
        </div>
        <div className="flex space-x-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="btn-exp flex items-center space-x-2"
            >
              <Trash2 size={20} />
              <span>{allSelected ? 'Xóa tất cả' : `Xóa đã chọn (${selectedIds.length})`}</span>
            </button>
          )}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-exp flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>Import CSV</span>
          </button>
          <button 
            onClick={handleExportExcel}
            className="btn-exp flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={handleAddNew}
            className="btn-exp flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Thêm khách mời</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-exp">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-exp-primary">
            {filteredGuests.length}
          </div>
          <div className="text-blue-400 text-sm">Tổng khách mời</div>
        </div>
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-green-400">
            {filteredGuests.filter((g: any) => g.rsvp_status === 'accepted').length}
          </div>
          <div className="text-blue-400 text-sm">Đã chấp nhận</div>
        </div>
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {filteredGuests.filter((g: any) => g.rsvp_status === 'pending').length}
          </div>
          <div className="text-blue-400 text-sm">Chờ phản hồi</div>
        </div>
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-blue-400">
            {filteredGuests.filter((g: any) => g.checked_in).length}
          </div>
          <div className="text-blue-400 text-sm">Đã check-in</div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="card-exp">
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


