from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import logging
from .database import engine, Base
from .routes import guests, events, invitations, auth

logger = logging.getLogger(__name__)

# Tạo thư mục static
os.makedirs("static", exist_ok=True)
os.makedirs("qr_images", exist_ok=True)
os.makedirs("templates/invitations", exist_ok=True)

app = FastAPI(
    title="Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm",
    description="API quản lý khách mời với QR code và RSVP",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên giới hạn domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/qr_images", StaticFiles(directory="qr_images"), name="qr_images")
app.mount("/invitations", StaticFiles(directory="templates/invitations"), name="invitations")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(guests.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(invitations.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm",
        "version": "1.0.0",
        "docs": "/docs",
        "api": "/api"
    }

@app.get("/favicon.ico")
def get_favicon():
    return {"message": "Favicon not found"}

@app.get("/logo192.png")
def get_logo():
    return {"message": "Logo not found"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API đang hoạt động bình thường"}

# Import dữ liệu mẫu
@app.on_event("startup")
async def startup_event():
    """
    Import dữ liệu mẫu khi khởi động
    """
    try:
        from .database import SessionLocal
        from .models.event import Event
        from .models.guest import Guest
        from .services.csv_service import CSVService
        from .services.qr_service import QRService
        import json
        
        # Tạo database tables trước
        try:
            Base.metadata.create_all(bind=engine)
            print("✅ Đã tạo database tables")
        except Exception as e:
            print(f"⚠️ Lỗi tạo database tables: {e}")
            return
        
        db = SessionLocal()
        
        # Kiểm tra xem đã có dữ liệu chưa
        try:
            event_count = db.query(Event).count()
            print(f"✅ Số lượng events: {event_count}")
        except Exception as e:
            print(f"⚠️ Lỗi truy cập events table: {e}")
            return
            
        if event_count == 0:
            from datetime import datetime
            # Tạo sự kiện mẫu
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
        
        # Import dữ liệu khách mời từ file JSON
        if db.query(Guest).count() == 0:
            try:
                # Đọc file guests.json từ thư mục gốc
                with open("guests (5).json", "r", encoding="utf-8") as f:
                    guests_data = json.load(f)
                
                csv_service = CSVService()
                qr_service = QRService()
                
                # Lấy event đầu tiên
                event = db.query(Event).first()
                
                for guest_data in guests_data:
                    # Làm sạch dữ liệu
                    cleaned_guest = csv_service._clean_guest_data(guest_data)
                    if cleaned_guest:
                        # Tạo khách mời
                        db_guest = Guest(
                            title=cleaned_guest.get('title'),
                            name=cleaned_guest.get('name'),
                            role=cleaned_guest.get('role'),
                            organization=cleaned_guest.get('organization'),
                            tag=cleaned_guest.get('tag'),
                            email=cleaned_guest.get('email'),
                            phone=cleaned_guest.get('phone'),
                            rsvp_status=cleaned_guest.get('rsvp_status', 'pending'),
                            checked_in=cleaned_guest.get('checked_in', False),
                            event_id=event.id
                        )
                        
                        db.add(db_guest)
                        db.commit()
                        db.refresh(db_guest)
                        
                        # Tạo QR code
                        qr_data = qr_service.generate_qr_code(
                            guest_id=db_guest.id,
                            guest_name=db_guest.name,
                            event_id=event.id
                        )
                        
                        # Cập nhật QR code
                        db_guest.qr_code = qr_data["qr_data"]
                        db_guest.qr_image_path = qr_data["qr_image_path"]
                        db.commit()
                
                print(f"✅ Đã import {len(guests_data)} khách mời từ file JSON")
                
            except Exception as e:
                print(f"⚠️ Không thể import dữ liệu mẫu: {e}")
        
        db.close()
        
    except Exception as e:
        print(f"⚠️ Lỗi khởi tạo dữ liệu: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
