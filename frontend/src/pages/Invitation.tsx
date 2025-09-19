import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getGuest, getEvent, updateGuestRSVP, getGuestQR } from '../services/api';
import InvitationCard from '../components/InvitationCard';

interface Guest {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  rsvp_status?: 'pending' | 'accepted' | 'declined';
  qr_code?: string;
  qr_image_url?: string;
  event_id?: number;
}

interface Event {
  id: number;
  name: string;
  description?: string;
  event_date?: string;
  location?: string;
}

const Invitation: React.FC = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const [searchParams] = useSearchParams();
  const eventIdFromQuery = searchParams.get('event');

  const [guest, setGuest] = useState<Guest | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [qrTriedOnce, setQrTriedOnce] = useState<boolean>(false);
  const [qrBust, setQrBust] = useState<number>(Date.now());

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!guestId) {
          toast.error('Thiếu thông tin khách mời hoặc sự kiện');
          setLoading(false);
          return;
        }
        const guestData = await getGuest(parseInt(guestId));
        try {
          if (!guestData.qr_image_url) {
            const qrResp = await getGuestQR(guestData.id);
            if (qrResp?.qr_image_url) {
              guestData.qr_image_url = qrResp.qr_image_url;
              guestData.qr_code = qrResp.qr_data;
            }
          }
        } catch {}
        setGuest(guestData);

        const resolvedEventId = eventIdFromQuery ? parseInt(eventIdFromQuery) : guestData?.event_id;
        if (resolvedEventId) {
          const eventData = await getEvent(resolvedEventId);
          setEvent(eventData);
        } else {
          toast.error('Thiếu thông tin sự kiện');
        }
      } catch (error) {
        console.error(error);
        toast.error('Không thể tải thông tin mời');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [guestId, eventIdFromQuery]);

  const handleRSVP = async (status: 'accepted' | 'declined') => {
    if (!guest) return;
    setSubmitting(true);
    try {
      await updateGuestRSVP(guest.id, { rsvp_status: status });
      let updated = { ...guest, rsvp_status: status } as Guest;
      if (status === 'accepted') {
        try {
          const qrResp = await getGuestQR(guest.id);
          if (qrResp?.qr_image_url) {
            updated = { ...updated, qr_image_url: qrResp.qr_image_url, qr_code: qrResp.qr_data };
          }
        } catch {}
      }
      setGuest(updated);
      toast.success(status === 'accepted' ? 'Đã xác nhận tham dự!' : 'Đã từ chối lời mời');
    } catch (error) {
      console.error(error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQrLoadError = async () => {
    try {
      if (!guest || qrTriedOnce) return;
      setQrTriedOnce(true);
      const qrResp = await getGuestQR(guest.id);
      if (qrResp?.qr_image_url) {
        setGuest({ ...guest, qr_image_url: qrResp.qr_image_url, qr_code: qrResp.qr_data });
        setQrBust(Date.now());
      } else {
        toast.error('Không tìm thấy QR code, vui lòng thử lại sau');
      }
    } catch (e) {
      toast.error('Lỗi tạo/tải QR code');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Đang tải thông tin...</div>
      </div>
    );
  }

  if (!guest || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Không tìm thấy thông tin thiệp mời</div>
      </div>
    );
  }

  return (
    <InvitationCard
      guest={guest}
      event={event}
      submitting={submitting}
      qrBust={qrBust}
      onRSVP={handleRSVP}
      onQrError={handleQrLoadError}
    />
  );
};

export default Invitation;
