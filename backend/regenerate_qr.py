#!/usr/bin/env python3
"""
Script để tạo lại QR code cho tất cả khách mời với URL check-in
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.guest import Guest
from app.services.qr_service import QRService

def regenerate_all_qr_codes():
    """Tạo lại QR code cho tất cả khách mời"""
    db = SessionLocal()
    qr_service = QRService()

    try:
        # Lấy tất cả khách mời
        guests = db.query(Guest).all()
        print(f'🔄 Đang tạo lại QR code cho {len(guests)} khách mời...')

        for guest in guests:
            # Tạo QR code mới
            qr_info = qr_service.generate_qr_code(
                guest_id=guest.id,
                guest_name=guest.name,
                event_id=guest.event_id
            )
            
            # Cập nhật database
            guest.qr_code = qr_info['qr_data']
            guest.qr_image_path = qr_info['qr_image_path']
            db.add(guest)
            
            print(f'✅ Đã tạo QR mới cho: {guest.name}')
            print(f'   URL: {qr_info["checkin_url"]}')

        db.commit()
        print('🎉 Hoàn thành tạo lại QR code!')
        
    except Exception as e:
        print(f'❌ Lỗi: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    regenerate_all_qr_codes()




