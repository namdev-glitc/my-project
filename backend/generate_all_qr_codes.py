#!/usr/bin/env python3
"""
Script để tạo QR code cho tất cả khách mời
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db
from app.models.guest import Guest
from app.services.qr_service import QRService
import json

def generate_qr_for_all_guests():
    """Tạo QR code cho tất cả khách mời"""
    db = next(get_db())
    qr_service = QRService()
    
    try:
        # Lấy tất cả khách mời
        guests = db.query(Guest).all()
        print(f"🚀 Tìm thấy {len(guests)} khách mời")
        
        success_count = 0
        error_count = 0
        
        for i, guest in enumerate(guests, 1):
            try:
                print(f"📱 [{i}/{len(guests)}] Tạo QR cho: {guest.name}")
                
                # Tạo QR code mới
                qr_result = qr_service.generate_qr_code(
                    guest_id=guest.id,
                    guest_name=guest.name,
                    event_id=1  # Event mặc định
                )
                
                # Cập nhật thông tin QR vào database
                guest.qr_code = qr_result['qr_data']
                guest.qr_image_path = qr_result['qr_image_path']
                guest.qr_id = qr_result['qr_id']
                
                db.commit()
                success_count += 1
                
                print(f"   ✅ Thành công: {guest.name}")
                print(f"   📁 File: {qr_result['qr_image_path']}")
                print(f"   🔗 URL: {qr_result['checkin_url']}")
                
            except Exception as e:
                print(f"   ❌ Lỗi tạo QR cho {guest.name}: {e}")
                error_count += 1
                continue
        
        print(f"\n📊 Kết quả:")
        print(f"   ✅ Thành công: {success_count} khách mời")
        print(f"   ❌ Lỗi: {error_count} khách mời")
        print(f"   📁 QR images được lưu trong: backend/qr_images/")
        
        return success_count, error_count
        
    except Exception as e:
        print(f"❌ Lỗi tổng thể: {e}")
        db.rollback()
        return 0, len(guests)
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Bắt đầu tạo QR code cho tất cả khách mời...")
    success, errors = generate_qr_for_all_guests()
    
    if success > 0:
        print(f"\n🎉 Hoàn thành! Đã tạo {success} QR code thành công!")
    else:
        print("\n❌ Không thể tạo QR code nào!")




