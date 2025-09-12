#!/usr/bin/env python3
"""
Script để tạo event mặc định trong database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db
from app.models.event import Event
from datetime import datetime, timedelta

def create_default_event():
    """Tạo event mặc định cho hệ thống"""
    db = next(get_db())
    
    try:
        # Kiểm tra xem đã có event nào chưa
        existing_event = db.query(Event).first()
        if existing_event:
            print(f"✅ Đã có event: {existing_event.name}")
            return existing_event
        
        # Tạo event mặc định
        default_event = Event(
            name="Lễ kỷ niệm 15 năm thành lập",
            description="Sự kiện đặc biệt kỷ niệm 15 năm thành lập công ty",
            event_date=datetime.now() + timedelta(days=30),  # 30 ngày sau
            location="Trung tâm Hội nghị Quốc gia",
            max_guests=500,
            is_active=True
        )
        
        db.add(default_event)
        db.commit()
        db.refresh(default_event)
        
        print(f"✅ Đã tạo event mặc định: {default_event.name}")
        print(f"   - ID: {default_event.id}")
        print(f"   - Ngày: {default_event.event_date}")
        print(f"   - Địa điểm: {default_event.location}")
        print(f"   - Số khách tối đa: {default_event.max_guests}")
        
        return default_event
        
    except Exception as e:
        print(f"❌ Lỗi tạo event: {e}")
        db.rollback()
        return None
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Tạo event mặc định...")
    event = create_default_event()
    if event:
        print("✅ Hoàn thành!")
    else:
        print("❌ Thất bại!")




