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
  const getStatusBadge = (status: string, checkedIn: boolean) => {
    if (checkedIn) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Đã check-in
        </span>
      );
    }

    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Chấp nhận
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} className="mr-1" />
            Từ chối
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
      <h3 className="text-lg font-semibold text-white mb-4">
        Danh sách Khách mời ({guests.length})
      </h3>
      
      {guests.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-blue-400 mb-4" />
          <p className="text-blue-400 text-lg">Chưa có khách mời nào</p>
          <p className="text-blue-500 text-sm mt-2">
            Hãy thêm khách mời đầu tiên để bắt đầu
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-exp-primary"
                    checked={guests.length > 0 && selectedIds.length === guests.map(g=>g.id).length}
                    onChange={(e) => onToggleSelectAll && onToggleSelectAll(e.target.checked, guests.map((g)=>g.id))}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Khách mời
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Tổ chức
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  RSVP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-800 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-exp-primary"
                      checked={selectedIds.includes(guest.id)}
                      onChange={(e) => onToggleSelect && onToggleSelect(guest.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-exp-gradient rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {guest.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {guest.title} {guest.name}
                        </div>
                        <div className="text-sm text-blue-400">
                          {guest.role || 'Chưa có chức vụ'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-300">
                      {guest.organization || 'Chưa có tổ chức'}
                    </div>
                    {guest.tag && (
                      <div className="text-xs text-blue-500">
                        #{guest.tag}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(guest.rsvp_status, guest.checked_in)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {guest.checked_in ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Đã check-in
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock size={12} className="mr-1" />
                        Chưa check-in
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(guest)}
                        className="text-exp-primary hover:text-white transition-colors duration-200"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      {event && (
                        <button
                          onClick={() => {
                            setSelectedGuest(guest);
                            setInvitationModalOpen(true);
                          }}
                          className="text-green-400 hover:text-white transition-colors duration-200"
                          title="Gửi thiệp mời"
                        >
                          <Mail size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedGuest(guest);
                          setQrModalOpen(true);
                        }}
                        className="text-blue-400 hover:text-white transition-colors duration-200"
                        title="Xem QR code"
                      >
                        <QrCode size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(guest.id)}
                        className="text-red-400 hover:text-white transition-colors duration-200"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedGuest && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          guest={selectedGuest}
        />
      )}
      
      {event && selectedGuest && (
        <InvitationLinkModal
          isOpen={invitationModalOpen}
          onClose={() => setInvitationModalOpen(false)}
          guest={selectedGuest}
          event={event}
        />
      )}
    </div>
  );
};

export default GuestTable;

