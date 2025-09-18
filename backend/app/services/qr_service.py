import qrcode
import os
import json
from io import BytesIO
from typing import Optional
import uuid

class QRService:
    def __init__(self, qr_images_dir: str = "qr_images"):
        self.qr_images_dir = qr_images_dir
        # Tạo thư mục nếu chưa tồn tại
        os.makedirs(self.qr_images_dir, exist_ok=True)
    
    def _sanitize(self, value: str) -> str:
        safe = ''.join(ch if ch.isalnum() or ch in ['-', '_'] else '_' for ch in value.strip())
        while '__' in safe:
            safe = safe.replace('__', '_')
        return safe or 'guest'

    def generate_qr_code(self, guest_id: int, guest_name: str, event_id: int) -> dict:
        """
        Tạo QR code cho khách mời
        """
        # Tạo unique ID cho QR code
        qr_id = str(uuid.uuid4())
        
        # Dữ liệu QR code (để lưu trong DB)
        qr_data = {
            "guest_id": guest_id,
            "guest_name": guest_name,
            "event_id": event_id,
            "qr_id": qr_id,
            "type": "guest_checkin"
        }
        
        # Tạo QR code với JSON data
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json.dumps(qr_data))  # Sử dụng JSON data
        qr.make(fit=True)
        
        # Tạo image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Lưu file
        safe_guest = self._sanitize(guest_name)
        filename = f"guest_{guest_id}_{safe_guest}_{qr_id}.png"
        filepath = os.path.join(self.qr_images_dir, filename)
        img.save(filepath)
        
        return {
            "qr_data": json.dumps(qr_data),
            "qr_image_path": filepath,
            "qr_id": qr_id
        }
    
    def generate_qr_code_for_invitation(self, guest_id: int, guest_name: str, event_id: int, event_name: str) -> dict:
        """
        Tạo QR code cho thiệp mời
        """
        # Dữ liệu cho thiệp mời
        invitation_data = {
            "guest_id": guest_id,
            "guest_name": guest_name,
            "event_id": event_id,
            "event_name": event_name,
            "type": "invitation",
            "url": f"https://exp-solution.io/invitation/{guest_id}"
        }
        
        # Tạo QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=12,
            border=4,
        )
        qr.add_data(str(invitation_data))
        qr.make(fit=True)
        
        # Tạo image với logo EXP
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Lưu file
        filename = f"invitation_{guest_id}.png"
        filepath = os.path.join(self.qr_images_dir, filename)
        img.save(filepath)
        
        return {
            "qr_data": str(invitation_data),
            "qr_image_path": filepath,
            "invitation_url": invitation_data["url"]
        }
    
    def validate_qr_code(self, qr_data: str) -> Optional[dict]:
        """
        Validate QR code data
        """
        try:
            import json
            data = json.loads(qr_data)
            
            # Kiểm tra các trường bắt buộc
            required_fields = ["guest_id", "event_id", "type"]
            if all(field in data for field in required_fields):
                return data
            return None
        except:
            return None
    
    def get_qr_image_path(self, guest_id: int) -> Optional[str]:
        """
        Lấy đường dẫn file QR code
        """
        # Tìm file QR code theo guest_id
        for filename in os.listdir(self.qr_images_dir):
            if filename.startswith(f"guest_{guest_id}_"):
                return os.path.join(self.qr_images_dir, filename)
        return None



