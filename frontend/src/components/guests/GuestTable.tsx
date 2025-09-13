import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  QrCode, 
  CheckCircle,
  Clock,
  X,
  Users,
  Mail
} from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import InvitationLinkModal from './InvitationLinkModal';

interface GuestTableProps {
  guests: any[];
  loading: boolean;
  onEdit: (guest: any) => void;
  onDelete: (id: number) => void;
  event?: {
    id: number;
    name: string;
    date: string;
    location: string;
  };
  selectedIds?: number[];
  onToggleSelect?: (id: number, checked: boolean) => void;
  onToggleSelectAll?: (checked: boolean, currentIds: number[]) => void;
}

const GuestTable: React.FC<GuestTableProps> = ({
  guests,
  loading,
  onEdit,
  onDelete,
  event,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll
}) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [invitationModalOpen, setInvitationModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
            <CheckCircle size={12} className="mr-1" />
            Chấp nhận
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
            <X size={12} className="mr-1" />
            Từ chối
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
            <Clock size={12} className="mr-1" />
            Chờ phản hồi
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-600 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Danh sách Khách mời ({guests.length})
      </h3>
      
      {guests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-blue-400" />
          </div>
          <p className="text-white text-xl font-semibold mb-2">Chưa có khách mời nào</p>
          <p className="text-gray-400 text-sm">
            Hãy thêm khách mời đầu tiên để bắt đầu
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead className="backdrop-blur-sm bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-500 focus:ring-2"
                      checked={guests.length > 0 && selectedIds.length === guests.map(g=>g.id).length}
                      onChange={(e) => onToggleSelectAll && onToggleSelectAll(e.target.checked, guests.map((g)=>g.id))}
                    />
                    <span className="text-sm font-semibold text-white uppercase tracking-wider">
                      Chọn tất cả
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Tổ chức
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  RSVP
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-700/30">
              {guests.map((guest) => (
                <tr key={guest.id} className="group relative overflow-hidden hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/10">
                  <td className="relative z-10 px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-500 focus:ring-2 group-hover:scale-110 transition-transform duration-200"
                      checked={selectedIds.includes(guest.id)}
                      onChange={(e) => onToggleSelect && onToggleSelect(guest.id, e.target.checked)}
                    />
                  </td>
                  <td className="relative z-10 px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {guest.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                          {guest.title} {guest.name}
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          {guest.role || 'Chưa có chức vụ'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="relative z-10 px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                      {guest.organization || 'Chưa có tổ chức'}
                    </div>
                    {guest.tag && (
                      <div className="text-xs text-blue-400 group-hover:text-blue-300 transition-colors duration-300 font-medium">
                        #{guest.tag}
                      </div>
                    )}
                  </td>
                  <td className="relative z-10 px-6 py-4 whitespace-nowrap">
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      {getStatusBadge(guest.rsvp_status || 'pending')}
                    </div>
                  </td>
                  <td className="relative z-10 px-6 py-4 whitespace-nowrap">
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      {guest.checked_in === true ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                          <CheckCircle size={12} className="mr-1" />
                          Đã check-in
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg">
                          <Clock size={12} className="mr-1" />
                          Chưa check-in
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="relative z-10 px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="grid grid-cols-2 gap-2 w-20 h-20 opacity-70 group-hover:opacity-100 transition-all duration-300">
                      {/* Hàng 1: Xóa, Sửa */}
                      <button
                        onClick={() => onDelete(guest.id)}
                        className="w-full h-full p-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-white transition-all duration-200 hover:scale-110 flex items-center justify-center"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(guest)}
                        className="w-full h-full p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-white transition-all duration-200 hover:scale-110 flex items-center justify-center"
                        title="Chỉnh sửa"
                      >
                        <Edit size={14} />
                      </button>
                      
                      {/* Hàng 2: Link, QR */}
                      <button
                        onClick={() => {
                          if (event) {
                            setSelectedGuest(guest);
                            setInvitationModalOpen(true);
                          }
                        }}
                        disabled={!event}
                        className={`w-full h-full p-1 rounded-lg transition-all duration-200 hover:scale-110 flex items-center justify-center ${
                          event 
                            ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-white' 
                            : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                        }`}
                        title={event ? "Gửi thiệp mời" : "Chưa có sự kiện"}
                      >
                        <Mail size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGuest(guest);
                          setQrModalOpen(true);
                        }}
                        className="w-full h-full p-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-white transition-all duration-200 hover:scale-110 flex items-center justify-center"
                        title="Xem QR code"
                      >
                        <QrCode size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedGuest(null);
        }}
        guest={selectedGuest || { id: 0, name: '', title: '', organization: '' }}
      />
      
      {event && (
        <InvitationLinkModal
          isOpen={invitationModalOpen}
          onClose={() => {
            setInvitationModalOpen(false);
            setSelectedGuest(null);
          }}
          guest={selectedGuest}
          event={event}
        />
      )}
    </div>
  );
};

export default GuestTable;

