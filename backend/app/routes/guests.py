from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.guest import Guest
from ..schemas.guest import GuestCreate, GuestUpdate, GuestResponse, GuestRSVP, GuestCheckIn
from ..services.qr_service import QRService
from ..services.csv_service import CSVService
from datetime import datetime
import json
import os
import time
from jose import jwt
from urllib.parse import urlencode
import os

router = APIRouter(prefix="/guests", tags=["guests"])

# Initialize services
qr_service = QRService()
csv_service = CSVService()

@router.get("/", response_model=List[GuestResponse])
def get_guests(
    skip: int = 0,
    limit: int = 100,
    event_id: Optional[int] = None,
    rsvp_status: Optional[str] = None,
    organization: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách khách mời với các bộ lọc
    """
    try:
        query = db.query(Guest)
        
        if event_id:
            query = query.filter(Guest.event_id == event_id)
        if rsvp_status:
            query = query.filter(Guest.rsvp_status == rsvp_status)
        if organization:
            query = query.filter(Guest.organization.contains(organization))
        
        guests = query.offset(skip).limit(limit).all()
        
        # Convert to GuestResponse objects with qr_image_url
        from ..schemas.guest import GuestResponse
        result = []
        for guest in guests:
            guest_data = {
                "id": guest.id,
                "title": guest.title,
                "name": guest.name,
                "role": guest.role,
                "organization": guest.organization,
                "tag": guest.tag,
                "email": guest.email,
                "phone": guest.phone,
                "qr_code": guest.qr_code,
                "qr_image_path": guest.qr_image_path,
                "qr_image_url": f"/qr_images/{os.path.basename(guest.qr_image_path)}" if guest.qr_image_path else None,
                "rsvp_status": guest.rsvp_status,
                "rsvp_response_date": guest.rsvp_response_date,
                "rsvp_notes": guest.rsvp_notes,
                "checked_in": bool(guest.checked_in) if guest.checked_in is not None else False,
                "check_in_time": guest.check_in_time,
                "check_in_location": guest.check_in_location,
                "created_at": guest.created_at,
                "updated_at": guest.updated_at,
                "event_id": guest.event_id
            }
            result.append(GuestResponse(**guest_data))
        
        return result
    except Exception as e:
        print(f"Error in get_guests: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{guest_id}", response_model=GuestResponse)
def get_guest(guest_id: int, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết một khách mời
    """
    print(f"🔍 Backend: Nhận request get_guest với ID: {guest_id}")
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        print(f"❌ Backend: Không tìm thấy khách mời ID: {guest_id}")
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    print(f"✅ Backend: Tìm thấy khách mời: {guest.name}")
    
    # Thêm qr_image_url nếu có qr_image_path
    guest_dict = guest.__dict__.copy()
    if guest.qr_image_path:
        guest_dict['qr_image_url'] = f"/qr_images/{os.path.basename(guest.qr_image_path)}"
    else:
        guest_dict['qr_image_url'] = None
    
    return guest_dict

@router.post("/", response_model=GuestResponse)
def create_guest(guest: GuestCreate, db: Session = Depends(get_db)):
    """
    Tạo khách mời mới
    """
    # Tạo khách mời
    db_guest = Guest(**guest.dict())
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)
    
    # Tạo QR code
    qr_data = qr_service.generate_qr_code(
        guest_id=db_guest.id,
        guest_name=db_guest.name,
        event_id=db_guest.event_id
    )
    
    # Cập nhật QR code vào database
    db_guest.qr_code = qr_data["qr_data"]
    db_guest.qr_image_path = qr_data["qr_image_path"]
    db.commit()
    db.refresh(db_guest)
    
    return db_guest

@router.put("/{guest_id}", response_model=GuestResponse)
def update_guest(guest_id: int, guest_update: GuestUpdate, db: Session = Depends(get_db)):
    """
    Cập nhật thông tin khách mời
    """
    db_guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not db_guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Cập nhật các trường
    update_data = guest_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_guest, field, value)
    
    # Nếu đang set checked_in = True và chưa có check_in_time, set thời gian hiện tại
    if update_data.get('checked_in') is True and not db_guest.check_in_time:
        db_guest.check_in_time = datetime.now()
        if not db_guest.check_in_location:
            db_guest.check_in_location = 'Manual Update'
    
    # Nếu đang set checked_in = False, xóa thông tin check-in
    if update_data.get('checked_in') is False:
        db_guest.check_in_time = None
        db_guest.check_in_location = None
    
    db_guest.updated_at = datetime.now()
    db.commit()
    db.refresh(db_guest)
    
    return db_guest

@router.post("/{guest_id}/rsvp", response_model=GuestResponse)
def update_rsvp(guest_id: int, rsvp: GuestRSVP, db: Session = Depends(get_db)):
    """
    Cập nhật RSVP cho khách mời
    """
    db_guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not db_guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    db_guest.rsvp_status = rsvp.rsvp_status
    db_guest.rsvp_notes = rsvp.rsvp_notes
    db_guest.rsvp_response_date = datetime.now()
    db_guest.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_guest)
    
    return db_guest

@router.post("/{guest_id}/checkin")
def checkin_guest(guest_id: int, checkin: GuestCheckIn, db: Session = Depends(get_db)):
    """
    Check-in khách mời
    """
    try:
        print(f"Checkin request for guest {guest_id}: {checkin}")
        
        db_guest = db.query(Guest).filter(Guest.id == guest_id).first()
        if not db_guest:
            print(f"Guest {guest_id} not found")
            raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
        
        if db_guest.checked_in:
            print(f"Guest {guest_id} already checked in")
            # Trả về thông tin khách cùng cờ đã check-in trước đó
            return {
                "already_checked_in": True,
                "guest": db_guest
            }
        
        db_guest.checked_in = True
        db_guest.check_in_time = datetime.now()
        db_guest.check_in_location = checkin.check_in_location
        db_guest.updated_at = datetime.now()
        
        db.commit()
        db.refresh(db_guest)
        
        print(f"Guest {guest_id} checked in successfully")
        return {
            "already_checked_in": False,
            "guest": db_guest
        }
    except Exception as e:
        print(f"Error checking in guest {guest_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/import", response_model=dict)
def import_guests(
    file: UploadFile = File(...),
    event_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """
    Import danh sách khách mời từ file CSV/Excel/JSON
    """
    if not csv_service.validate_file_format(file.filename):
        raise HTTPException(status_code=400, detail="Định dạng file không được hỗ trợ")
    
    try:
        file_content = file.file.read()
        
        # Đọc dữ liệu từ file
        if file.filename.lower().endswith('.json'):
            guests_data = csv_service.read_guests_from_json(file_content)
        else:
            guests_data = csv_service.read_guests_from_csv(file_content, file.filename)
        
        # Tạo khách mời trong database
        created_guests = []
        for guest_data in guests_data:
            # Tạo khách mời
            db_guest = Guest(
                title=guest_data.get('title'),
                name=guest_data.get('name'),
                role=guest_data.get('role'),
                organization=guest_data.get('organization'),
                tag=guest_data.get('tag'),
                email=guest_data.get('email'),
                phone=guest_data.get('phone'),
                event_id=event_id
            )
            
            db.add(db_guest)
            db.commit()
            db.refresh(db_guest)
            
            # Tạo QR code
            qr_data = qr_service.generate_qr_code(
                guest_id=db_guest.id,
                guest_name=db_guest.name,
                event_id=event_id
            )
            
            # Cập nhật QR code
            db_guest.qr_code = qr_data["qr_data"]
            db_guest.qr_image_path = qr_data["qr_image_path"]
            db.commit()
            
            created_guests.append({
                "id": db_guest.id,
                "name": db_guest.name,
                "organization": db_guest.organization
            })
        
        return {
            "message": f"Đã import thành công {len(created_guests)} khách mời",
            "guests": created_guests
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi import: {str(e)}")

@router.get("/{guest_id}/qr")
def get_guest_qr(guest_id: int, db: Session = Depends(get_db)):
    """
    Lấy QR code của khách mời
    """
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Tự động tạo QR nếu chưa có (hoặc file không tồn tại)
    if not guest.qr_image_path or not os.path.exists(guest.qr_image_path):
        qr_data = qr_service.generate_qr_code(
            guest_id=guest.id,
            guest_name=guest.name,
            event_id=guest.event_id,
        )
        guest.qr_code = qr_data["qr_data"]
        guest.qr_image_path = qr_data["qr_image_path"]
        db.commit()
        db.refresh(guest)
    
    return {
        "qr_data": guest.qr_code,
        "qr_image_path": guest.qr_image_path,
        "qr_image_url": f"/qr_images/{os.path.basename(guest.qr_image_path)}",
    }

@router.get("/{guest_id}/qr/image")
def get_guest_qr_image(guest_id: int, db: Session = Depends(get_db)):
    """
    Lấy file ảnh QR code của khách mời
    """
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    if not guest.qr_image_path or not os.path.exists(guest.qr_image_path):
        raise HTTPException(status_code=404, detail="Không tìm thấy file QR code")
    
    return FileResponse(guest.qr_image_path, media_type="image/png")

# -------------------------
# Invite link generation
# -------------------------
@router.post("/{guest_id}/invite_link", response_model=dict)
def generate_invite_link(guest_id: int, db: Session = Depends(get_db)):
    """
    Tạo link thiệp mời công khai (không cần đăng nhập) cho khách mời.
    Link chứa token an toàn (JWT) mã hóa guest_id và event_id, hết hạn sau 30 ngày.
    """
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")

    secret_key = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    expires_in_seconds = 30 * 24 * 3600
    payload = {
        "sub": "invite",
        "guest_id": guest.id,
        "event_id": guest.event_id,
        "exp": int(time.time()) + expires_in_seconds,
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Base URL for frontend; try ENV, fallback to root
    frontend_base = os.getenv("FRONTEND_BASE_URL", "")
    invite_url = f"{frontend_base}/i/{token}" if frontend_base else f"/i/{token}"

    return {"token": token, "url": invite_url, "expires_in": expires_in_seconds}

@router.post("/{guest_id}/rsvp")
def update_guest_rsvp(guest_id: int, rsvp_data: dict, db: Session = Depends(get_db)):
    """
    Cập nhật trạng thái RSVP của khách mời
    """
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Cập nhật trạng thái RSVP
    if 'rsvp_status' in rsvp_data:
        guest.rsvp_status = rsvp_data['rsvp_status']
    
    db.commit()
    db.refresh(guest)
    
    return {
        "message": "Đã cập nhật trạng thái RSVP",
        "guest": guest
    }


@router.delete("/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    """
    Xóa khách mời
    """
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    db.delete(guest)
    db.commit()
    
    return {"message": "Đã xóa khách mời thành công"}

@router.get("/stats/summary")
def get_guest_stats(event_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Lấy thống kê khách mời
    """
    try:
        query = db.query(Guest)
        if event_id:
            query = query.filter(Guest.event_id == event_id)
        
        total_guests = query.count()
        checked_in = query.filter(Guest.checked_in == True).count()
        rsvp_accepted = query.filter(Guest.rsvp_status == "accepted").count()
        rsvp_declined = query.filter(Guest.rsvp_status == "declined").count()
        rsvp_pending = query.filter(Guest.rsvp_status == "pending").count()
        
        return {
            "total_guests": total_guests,
            "checked_in": checked_in,
            "rsvp_accepted": rsvp_accepted,
            "rsvp_declined": rsvp_declined,
            "rsvp_pending": rsvp_pending,
            "check_in_rate": round(checked_in / total_guests * 100, 2) if total_guests > 0 else 0
        }
    except Exception as e:
        print(f"Error in get_guest_stats: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/export/excel")
def export_guests_excel(
    event_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Export danh sách khách mời ra file Excel
    """
    try:
        # Lấy danh sách khách mời
        query = db.query(Guest)
        if event_id:
            query = query.filter(Guest.event_id == event_id)
        
        guests = query.all()
        
        # Tạo file Excel
        file_path = csv_service.export_guests_to_excel(guests)
        
        return FileResponse(
            path=file_path,
            filename=f"guests_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi export Excel: {str(e)}")

@router.get("/export/csv")
def export_guests_csv(
    event_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Export danh sách khách mời ra file CSV
    """
    try:
        # Lấy danh sách khách mời
        query = db.query(Guest)
        if event_id:
            query = query.filter(Guest.event_id == event_id)
        
        guests = query.all()
        
        # Tạo file CSV
        file_path = csv_service.export_guests_to_csv(guests)
        
        return FileResponse(
            path=file_path,
            filename=f"guests_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            media_type="text/csv"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi export CSV: {str(e)}")


# -------------------------
# Public invitation by token
# -------------------------
@router.get("/invite/{token}", response_model=GuestResponse)
def get_invitation_by_token(token: str, db: Session = Depends(get_db)):
    """
    Trả về thông tin thiệp mời công khai dựa trên token (JWT) mà không cần đăng nhập.
    """
    try:
        secret_key = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
        data = jwt.decode(token, secret_key, algorithms=["HS256"])
        if data.get("sub") != "invite":
            raise HTTPException(status_code=400, detail="Token không hợp lệ")
        guest_id = data.get("guest_id")
        guest = db.query(Guest).filter(Guest.id == guest_id).first()
        if not guest:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")

        guest_dict = guest.__dict__.copy()
        guest_dict['qr_image_url'] = f"/qr_images/{os.path.basename(guest.qr_image_path)}" if guest.qr_image_path else None
        return guest_dict
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Token không hợp lệ hoặc đã hết hạn: {str(e)}")


