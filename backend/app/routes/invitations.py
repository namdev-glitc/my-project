from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..models.guest import Guest
from ..models.event import Event
from ..services.invitation_service import InvitationService
from ..schemas.guest import GuestResponse
import os

# Pydantic models for request data
class GenerateInvitationRequest(BaseModel):
    template: Optional[str] = "elegant"
    event_id: Optional[int] = None

class GenerateBulkRequest(BaseModel):
    guest_ids: List[int]
    template: Optional[str] = "elegant"
    event_id: Optional[int] = None

class SendEmailRequest(BaseModel):
    template: Optional[str] = "elegant"

class PreviewRequest(BaseModel):
    template: str
    event_id: int
    customization: dict = {}

router = APIRouter(prefix="/invitations", tags=["invitations"])

# Initialize service
invitation_service = InvitationService()

@router.post("/generate/{guest_id}")
def generate_invitation(guest_id: int, request_data: GenerateInvitationRequest, db: Session = Depends(get_db)):
    """
    Tạo thiệp mời cho khách mời
    """
    # Lấy thông tin khách mời
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Lấy thông tin sự kiện
    event = db.query(Event).filter(Event.id == guest.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    
    # Chuyển đổi thành dict
    guest_dict = {
        'id': guest.id,
        'title': guest.title,
        'name': guest.name,
        'role': guest.role,
        'organization': guest.organization,
        'tag': guest.tag,
        'email': guest.email,
        'phone': guest.phone
    }
    
    event_dict = {
        'id': event.id,
        'name': event.name,
        'event_date': event.event_date.isoformat(),
        'location': getattr(event, 'location', ''),
        'address': getattr(event, 'address', ''),
        'agenda': getattr(event, 'agenda', ''),
        'description': getattr(event, 'description', '')
    }
    
    # Kiểm tra xem thiệp mời đã tồn tại chưa dựa theo quy ước đặt tên file
    invitation_id = f"INV{guest.id:06d}"
    filename = f"invite_{invitation_id}.html"
    filepath = os.path.join(invitation_service.templates_dir, filename)

    if os.path.exists(filepath):
        # Đã có thiệp mời trước đó
        return {
            "already_exists": True,
            "filename": filename,
            "file_path": filepath,
            "download_url": f"/invitations/{filename}",
            "guest": guest_dict,
            "event": event_dict
        }

    # Tạo dữ liệu thiệp mời nếu chưa có
    invitation_data = invitation_service.generate_invitation_data(guest_dict, event_dict)
    
    # Tạo HTML thiệp mời
    html_content = invitation_service.generate_html_invitation(invitation_data)
    
    return {
        "already_exists": False,
        "invitation_data": invitation_data,
        "html_content": html_content,
        "guest": guest_dict,
        "event": event_dict
    }

@router.post("/generate-all")
def generate_all_invitations(
    request_data: GenerateInvitationRequest,
    db: Session = Depends(get_db)
):
    """
    Tạo thiệp mời cho tất cả khách mời
    """
    # Lấy danh sách khách mời
    query = db.query(Guest)
    
    # Extract event_id from request_data if provided
    event_id = request_data.event_id
    if event_id:
        query = query.filter(Guest.event_id == event_id)
    
    guests = query.all()
    
    if not guests:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Lấy thông tin sự kiện
    event = db.query(Event).filter(Event.id == guests[0].event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    
    event_dict = {
        'id': event.id,
        'name': event.name,
        'event_date': event.event_date.isoformat(),
        'location': getattr(event, 'location', ''),
        'address': getattr(event, 'address', ''),
        'agenda': getattr(event, 'agenda', ''),
        'description': getattr(event, 'description', '')
    }
    
    invitations = []
    
    for guest in guests:
        guest_dict = {
            'id': guest.id,
            'title': guest.title,
            'name': guest.name,
            'role': guest.role,
            'organization': guest.organization,
            'tag': guest.tag,
            'email': guest.email,
            'phone': guest.phone
        }
        
        # Tạo dữ liệu thiệp mời
        invitation_data = invitation_service.generate_invitation_data(guest_dict, event_dict)
        
        # Tạo HTML thiệp mời
        html_content = invitation_service.generate_html_invitation(invitation_data)
        
        # Lưu file HTML
        filename = f"invite_{invitation_data['meta']['invitation_id']}.html"
        filepath = invitation_service.save_invitation_html(invitation_data, filename)
        
        invitations.append({
            "guest_id": guest.id,
            "guest_name": guest.name,
            "invitation_id": invitation_data['meta']['invitation_id'],
            "file_path": filepath,
            "invitation_data": invitation_data
        })
    
    return {
        "message": f"Đã tạo {len(invitations)} thiệp mời",
        "invitations": invitations,
        "event": event_dict
    }

@router.post("/generate-bulk")
def generate_bulk_invitations(
    request_data: GenerateBulkRequest,
    db: Session = Depends(get_db)
):
    """
    Tạo thiệp mời cho nhiều khách mời được chọn
    """
    if not request_data.guest_ids:
        raise HTTPException(status_code=400, detail="Danh sách khách mời không được để trống")
    
    # Lấy danh sách khách mời theo IDs
    guests = db.query(Guest).filter(Guest.id.in_(request_data.guest_ids)).all()
    
    if not guests:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Lấy thông tin sự kiện từ khách mời đầu tiên
    event = db.query(Event).filter(Event.id == guests[0].event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    
    event_dict = {
        'id': event.id,
        'name': event.name,
        'event_date': event.event_date.isoformat(),
        'location': getattr(event, 'location', ''),
        'address': getattr(event, 'address', ''),
        'agenda': getattr(event, 'agenda', ''),
        'description': getattr(event, 'description', '')
    }
    
    invitations = []
    
    for guest in guests:
        guest_dict = {
            'id': guest.id,
            'title': guest.title,
            'name': guest.name,
            'role': guest.role,
            'organization': guest.organization,
            'tag': guest.tag,
            'email': guest.email,
            'phone': guest.phone
        }
        
        # Tạo dữ liệu thiệp mời
        invitation_data = invitation_service.generate_invitation_data(guest_dict, event_dict)
        
        # Tạo HTML thiệp mời
        html_content = invitation_service.generate_html_invitation(invitation_data)
        
        # Lưu file HTML
        filename = f"invite_{invitation_data['meta']['invitation_id']}.html"
        filepath = invitation_service.save_invitation_html(invitation_data, filename)
        
        invitations.append({
            "guest_id": guest.id,
            "guest_name": guest.name,
            "invitation_id": invitation_data['meta']['invitation_id'],
            "file_path": filepath,
            "invitation_data": invitation_data
        })
    
    return {
        "message": f"Đã tạo {len(invitations)} thiệp mời cho {len(request_data.guest_ids)} khách mời",
        "invitations": invitations,
        "event": event_dict
    }

@router.get("/preview")
def preview_invitation_template():
    """
    Xem trước mẫu thiệp mời
    """
    # Dữ liệu mẫu
    sample_guest = {
        'id': 1,
        'title': 'Mr',
        'name': 'Nguyễn Văn A',
        'role': 'CEO',
        'organization': 'Công ty ABC',
        'tag': 'ABC',
        'email': 'nguyenvana@abc.com',
        'phone': '0123456789'
    }
    
    sample_event = {
        'id': 1,
        'name': 'EXP Technology – 15 Years of Excellence',
        'event_date': '2025-10-10T18:00:00',
        'location': 'Trung tâm Hội nghị tỉnh Thái Nguyên',
        'address': 'Số 1 Đường XYZ, TP. Thái Nguyên',
        'agenda': '18:00 - Đón khách & Check-in\n18:30 - Khai mạc\n19:00 - Vinh danh & Tri ân\n20:00 - Gala & Networking',
        'description': 'Lễ kỷ niệm 15 năm thành lập EXP Technology'
    }
    
    # Tạo dữ liệu thiệp mời
    invitation_data = invitation_service.generate_invitation_data(sample_guest, sample_event)
    
    # Tạo HTML thiệp mời
    html_content = invitation_service.generate_html_invitation(invitation_data)
    
    return {
        "invitation_data": invitation_data,
        "html_content": html_content
    }

@router.get("/download/{guest_id}")
def download_invitation(guest_id: int, db: Session = Depends(get_db)):
    """
    Tải xuống thiệp mời HTML
    """
    # Lấy thông tin khách mời
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Lấy thông tin sự kiện
    event = db.query(Event).filter(Event.id == guest.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    
    guest_dict = {
        'id': guest.id,
        'title': guest.title,
        'name': guest.name,
        'role': guest.role,
        'organization': guest.organization,
        'tag': guest.tag,
        'email': guest.email,
        'phone': guest.phone
    }
    
    event_dict = {
        'id': event.id,
        'name': event.name,
        'event_date': event.event_date.isoformat(),
        'location': getattr(event, 'location', ''),
        'address': getattr(event, 'address', ''),
        'agenda': getattr(event, 'agenda', ''),
        'description': getattr(event, 'description', '')
    }
    
    # Tạo dữ liệu thiệp mời
    invitation_data = invitation_service.generate_invitation_data(guest_dict, event_dict)
    
    # Tạo và lưu file HTML
    filename = f"invite_{invitation_data['meta']['invitation_id']}.html"
    filepath = invitation_service.save_invitation_html(invitation_data, filename)
    
    return {
        "file_path": filepath,
        "filename": filename,
        "invitation_id": invitation_data['meta']['invitation_id'],
        "download_url": f"/static/invitations/{filename}"
    }

@router.post("/send-email/{guest_id}")
def send_invitation_email(guest_id: int, request_data: SendEmailRequest, db: Session = Depends(get_db)):
    """
    Gửi email thiệp mời cho khách mời
    """
    # Lấy thông tin khách mời
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách mời")
    
    # Lấy thông tin sự kiện
    event = db.query(Event).filter(Event.id == guest.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    
    guest_dict = {
        'id': guest.id,
        'title': guest.title,
        'name': guest.name,
        'role': guest.role,
        'organization': guest.organization,
        'tag': guest.tag,
        'email': guest.email,
        'phone': guest.phone
    }
    
    event_dict = {
        'id': event.id,
        'name': event.name,
        'event_date': event.event_date.isoformat(),
        'location': getattr(event, 'location', ''),
        'address': getattr(event, 'address', ''),
        'agenda': getattr(event, 'agenda', ''),
        'description': getattr(event, 'description', '')
    }
    
    # Tạo dữ liệu thiệp mời
    invitation_data = invitation_service.generate_invitation_data(guest_dict, event_dict)
    
    # Tạo và lưu file HTML
    filename = f"invite_{invitation_data['meta']['invitation_id']}.html"
    filepath = invitation_service.save_invitation_html(invitation_data, filename)
    
    # TODO: Implement actual email sending logic here
    # For now, just return success message
    
    return {
        "message": f"Đã gửi email thiệp mời cho {guest.name}",
        "email": guest.email,
        "invitation_id": invitation_data['meta']['invitation_id'],
        "filename": filename,
        "file_path": filepath
    }

@router.get("/list")
def list_invitations(db: Session = Depends(get_db)):
    """
    Liệt kê tất cả thiệp mời đã tạo
    """
    invitations_dir = invitation_service.templates_dir
    
    if not os.path.exists(invitations_dir):
        return {"invitations": []}
    
    invitations = []
    
    for filename in os.listdir(invitations_dir):
        if filename.endswith('.html'):
            filepath = os.path.join(invitations_dir, filename)
            file_stat = os.stat(filepath)
            
            invitations.append({
                "filename": filename,
                "file_path": filepath,
                "created_at": file_stat.st_ctime,
                "size": file_stat.st_size
            })
    
    # Sắp xếp theo thời gian tạo
    invitations.sort(key=lambda x: x['created_at'], reverse=True)
    
    return {
        "invitations": invitations,
        "total": len(invitations)
    }

@router.delete("/delete/{filename}")
def delete_invitation(filename: str):
    """
    Xóa thiệp mời
    """
    filepath = os.path.join(invitation_service.templates_dir, filename)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Không tìm thấy file thiệp mời")
    
    try:
        os.remove(filepath)
        return {"message": f"Đã xóa thiệp mời {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xóa file: {str(e)}")

@router.get("/template")
def get_invitation_template():
    """
    Lấy mẫu dữ liệu thiệp mời
    """
    return {
        "guest": {
            "title": "Mr",
            "name": "Nguyễn Cường",
            "role": "CEO",
            "organization": "Công ty TNHH Dịch vụ và Phát triển Công nghệ Hachitech Solution",
            "tag": "Hachitech"
        },
        "event": {
            "title": "EXP Technology – 15 Years of Excellence",
            "subtitle": "Lễ kỷ niệm 15 năm thành lập",
            "host_org": "EXP Technology Company Limited",
            "datetime": "2025-10-10T18:00:00",
            "timezone": "Asia/Ho_Chi_Minh",
            "venue": {
                "name": "Trung tâm Hội nghị tỉnh Thái Nguyên",
                "address": "Số 1 Đường XYZ, TP. Thái Nguyên",
                "map_url": "https://maps.example.com/venue"
            },
            "program_outline": [
                {"time": "18:00", "item": "Đón khách & Check-in"},
                {"time": "18:30", "item": "Khai mạc"},
                {"time": "19:00", "item": "Vinh danh & Tri ân"},
                {"time": "20:00", "item": "Gala & Networking"}
            ]
        },
        "rsvp": {
            "accept_url": "https://exp.example.com/rsvp/accept?id=INV123",
            "decline_url": "https://exp.example.com/rsvp/decline?id=INV123",
            "deadline": "2025-09-30"
        },
        "qr": {
            "qr_url": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV123",
            "value": "INV123"
        },
        "delivery": {
            "mode": "email",
            "email_subject": "Thiệp mời Lễ kỷ niệm 15 năm EXP Technology",
            "email_to": "guest@example.com",
            "file_name": "invite_INV123.html"
        },
        "branding": {
            "logo_url": "logo.jpeg",
            "primary_color": "#0B2A4A",
            "accent_color": "#1E88E5"
        },
        "meta": {
            "invitation_id": "INV123",
            "created_at": "2025-09-10T18:00:00",
            "notes": "Mẫu thử nghiệm"
        }
    }

@router.post("/preview")
async def preview_template(
    request_data: PreviewRequest,
    db: Session = Depends(get_db)
):
    """Preview template with sample data"""
    try:
        # Get event info
        event = db.query(Event).filter(Event.id == request_data.event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Create sample guest data for preview
        sample_guest = {
            "id": 0,
            "name": "Nguyễn Văn Mẫu",
            "email": "mau@example.com",
            "phone": "0123456789",
            "event_id": request_data.event_id,
            "rsvp_status": "pending"
        }
        
        # Create event data
        event_dict = {
            "id": event.id,
            "name": event.name,
            "event_date": event.event_date.isoformat() if event.event_date else None,
            "date": event.event_date.isoformat() if event.event_date else None,
            "time": None,  # Event model doesn't have time field
            "location": event.location,
            "description": event.description
        }
        
        # Generate invitation data
        invitation_data = invitation_service.generate_invitation_data(sample_guest, event_dict)
        
        # Apply customization if provided
        if request_data.customization:
            if 'primaryColor' in request_data.customization:
                invitation_data['branding']['primary_color'] = request_data.customization['primaryColor']
            if 'accentColor' in request_data.customization:
                invitation_data['branding']['accent_color'] = request_data.customization['accentColor']
        
        # Generate HTML with template type
        html_content = invitation_service.generate_html_invitation(invitation_data, request_data.template)
        
        return {
            "html_content": html_content,
            "invitation_data": invitation_data,
            "template": request_data.template,
            "customization": request_data.customization
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


