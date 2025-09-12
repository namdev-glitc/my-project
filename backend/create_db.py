#!/usr/bin/env python3
"""
Script để tạo database và import dữ liệu mẫu
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.database import SessionLocal
# Import models để đăng ký với Base metadata
from app.models.event import Event
from app.models.guest import Guest
from app.services.csv_service import CSVService
from app.services.qr_service import QRService
import json
from datetime import datetime

def create_database():
    """Tạo database và import dữ liệu"""
    try:
        print("🔄 Đang tạo database tables...")
        try:
            # Kiểm tra xem models có được import đúng không
            print(f"📋 Event model: {Event}")
            print(f"📋 Guest model: {Guest}")
            print(f"📋 Base metadata: {Base.metadata.tables}")
            
            # Kiểm tra xem models có được đăng ký với Base không
            print(f"📋 Event __tablename__: {Event.__tablename__}")
            print(f"📋 Guest __tablename__: {Guest.__tablename__}")
            
            # Kiểm tra xem models có được đăng ký với Base không
            print(f"📋 Event __table__: {Event.__table__}")
            print(f"📋 Guest __table__: {Guest.__table__}")
            
            # Kiểm tra xem models có được đăng ký với Base không
            print(f"📋 Event __table__.name: {Event.__table__.name}")
            print(f"📋 Guest __table__.name: {Guest.__table__.name}")
            
            # Kiểm tra xem models có được đăng ký với Base không
            print(f"📋 Event __table__.columns: {Event.__table__.columns}")
            print(f"📋 Guest __table__.columns: {Guest.__table__.columns}")
            
            # Kiểm tra xem models có được đăng ký với Base không
            print(f"📋 Event __table__.metadata: {Event.__table__.metadata}")
            print(f"📋 Guest __table__.metadata: {Guest.__table__.metadata}")
            
            # Kiểm tra xem models có được đăng ký với Base không
            print(f"📋 Event __table__.metadata.tables: {Event.__table__.metadata.tables}")
            print(f"📋 Guest __table__.metadata.tables: {Guest.__table__.metadata.tables}")
            
            # Sử dụng metadata từ models thay vì Base.metadata
            Event.__table__.metadata.create_all(bind=engine)
            print("✅ Đã tạo database tables thành công")
            
            # Kiểm tra xem tables có được tạo không
            from sqlalchemy import inspect
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print(f"📋 Tables trong database: {tables}")
            
        except Exception as e:
            print(f"❌ Lỗi tạo database tables: {e}")
            return False
        
        # Kiểm tra xem database có được tạo không
        if os.path.exists("guest_management.db"):
            print("✅ Database file đã được tạo")
        else:
            print("❌ Database file chưa được tạo")
            return False
        
        db = SessionLocal()
        
        # Tạo sự kiện mẫu
        print("🔄 Đang tạo sự kiện mẫu...")
        try:
            sample_event = Event(
                name="Lễ kỷ niệm 15 năm EXP Techno Logy",
                description="Sự kiện kỷ niệm 15 năm thành lập công ty EXP Techno Logy",
                event_date=datetime(2024, 12, 15, 18, 0, 0),
                location="Trung tâm Hội nghị Quốc gia",
                max_guests=100
            )
            db.add(sample_event)
            db.commit()
            db.refresh(sample_event)
            print(f"✅ Đã tạo sự kiện mẫu: {sample_event.name}")
        except Exception as e:
            print(f"❌ Lỗi tạo sự kiện mẫu: {e}")
            return False
        
        # Import dữ liệu khách mời
        print("🔄 Đang import dữ liệu khách mời...")
        try:
            with open("guests (5).json", "r", encoding="utf-8") as f:
                guests_data = json.load(f)
            
            csv_service = CSVService()
            qr_service = QRService()
            
            for guest_data in guests_data:
                cleaned_guest = csv_service._clean_guest_data(guest_data)
                if cleaned_guest:
                    db_guest = Guest(
                        title=cleaned_guest.get('title'),
                        name=cleaned_guest.get('name'),
                        role=cleaned_guest.get('role'),
                        organization=cleaned_guest.get('organization'),
                        tag=cleaned_guest.get('tag'),
                        email=cleaned_guest.get('email'),
                        phone=cleaned_guest.get('phone'),
                        event_id=sample_event.id
                    )
                    
                    db.add(db_guest)
                    db.commit()
                    db.refresh(db_guest)
                    
                    # Tạo QR code
                    qr_data = qr_service.generate_qr_code(
                        guest_id=db_guest.id,
                        guest_name=db_guest.name,
                        event_id=sample_event.id
                    )
                    
                    db_guest.qr_code = qr_data["qr_data"]
                    db_guest.qr_image_path = qr_data["qr_image_path"]
                    db.commit()
            
            print(f"✅ Đã import {len(guests_data)} khách mời thành công")
            
        except Exception as e:
            print(f"⚠️ Lỗi import dữ liệu khách mời: {e}")
        
        db.close()
        print("🎉 Hoàn thành tạo database và import dữ liệu!")
        
    except Exception as e:
        print(f"❌ Lỗi tạo database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    create_database()
