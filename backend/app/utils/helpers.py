from datetime import datetime
from typing import Optional
import re

def format_phone_number(phone: str) -> str:
    """
    Format số điện thoại Việt Nam
    """
    if not phone:
        return ""
    
    # Loại bỏ tất cả ký tự không phải số
    phone = re.sub(r'\D', '', phone)
    
    # Thêm mã quốc gia nếu cần
    if phone.startswith('0'):
        phone = '+84' + phone[1:]
    elif not phone.startswith('+84'):
        phone = '+84' + phone
    
    return phone

def validate_email(email: str) -> bool:
    """
    Validate email format
    """
    if not email:
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def generate_guest_code(guest_id: int, event_id: int) -> str:
    """
    Tạo mã khách mời duy nhất
    """
    timestamp = datetime.now().strftime("%Y%m%d")
    return f"EXP{event_id:03d}{guest_id:04d}{timestamp}"

def format_datetime(dt: datetime) -> str:
    """
    Format datetime cho hiển thị
    """
    if not dt:
        return ""
    
    return dt.strftime("%d/%m/%Y %H:%M")

def clean_text(text: str) -> str:
    """
    Làm sạch text
    """
    if not text:
        return ""
    
    # Loại bỏ khoảng trắng thừa
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Loại bỏ ký tự đặc biệt không cần thiết
    text = re.sub(r'[^\w\s@.-]', '', text)
    
    return text

def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Cắt ngắn text nếu quá dài
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length-3] + "..."

def get_rsvp_status_color(status: str) -> str:
    """
    Lấy màu sắc cho trạng thái RSVP
    """
    colors = {
        "pending": "#ffc107",    # Vàng
        "accepted": "#28a745",   # Xanh lá
        "declined": "#dc3545"    # Đỏ
    }
    return colors.get(status, "#6c757d")  # Xám mặc định

def get_checkin_status_color(checked_in: bool) -> str:
    """
    Lấy màu sắc cho trạng thái check-in
    """
    return "#28a745" if checked_in else "#6c757d"



