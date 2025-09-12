import os
from datetime import datetime
from typing import Dict, Any
from jinja2 import Template
import qrcode
from io import BytesIO
import base64

class InvitationService:
    def __init__(self, templates_dir: str = "templates/invitations"):
        self.templates_dir = templates_dir
        os.makedirs(templates_dir, exist_ok=True)
    
    def generate_invitation_data(self, guest: Dict[str, Any], event: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tạo dữ liệu thiệp mời từ thông tin khách mời và sự kiện
        """
        invitation_id = f"INV{guest['id']:06d}"
        
        # Tạo QR code
        qr_data = {
            "guest_id": guest['id'],
            "guest_name": guest['name'],
            "event_id": event['id'],
            "invitation_id": invitation_id,
            "type": "invitation"
        }
        
        qr_code = self.generate_qr_code(str(qr_data))
        
        invitation_data = {
            "guest": {
                "title": guest.get('title', 'Mr'),
                "name": guest['name'],
                "role": guest.get('role', ''),
                "organization": guest.get('organization', ''),
                "tag": guest.get('tag', '')
            },
            "event": {
                "title": event['name'],
                "subtitle": "Lễ kỷ niệm 15 năm thành lập",
                "host_org": "EXP Technology Company Limited",
                "datetime": event['event_date'],
                "timezone": "Asia/Ho_Chi_Minh",
                "venue": {
                    "name": event.get('location', ''),
                    "address": event.get('address', ''),
                    "map_url": f"https://maps.google.com/?q={event.get('location', '')}"
                },
                "program_outline": self.parse_program_outline(event.get('agenda', ''))
            },
            "rsvp": {
                "accept_url": f"https://exp-solution.io/rsvp/accept?id={invitation_id}",
                "decline_url": f"https://exp-solution.io/rsvp/decline?id={invitation_id}",
                "deadline": self.calculate_rsvp_deadline(event['event_date'])
            },
            "qr": {
                "qr_url": qr_code,
                "value": invitation_id
            },
            "delivery": {
                "mode": "email",
                "email_subject": f"Thiệp mời Lễ kỷ niệm 15 năm EXP Technology - {guest['name']}",
                "email_to": guest.get('email', ''),
                "file_name": f"invite_{invitation_id}.html"
            },
            "branding": {
                "logo_url": "/static/logo.png",
                "primary_color": "#0B2A4A",
                "accent_color": "#1E88E5"
            },
            "meta": {
                "invitation_id": invitation_id,
                "created_at": datetime.now().isoformat(),
                "notes": "Thiệp mời tự động"
            }
        }
        
        return invitation_data
    
    def generate_qr_code(self, data: str) -> str:
        """
        Tạo QR code và trả về base64 string
        """
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    
    def parse_program_outline(self, agenda: str) -> list:
        """
        Parse agenda text thành program outline
        """
        if not agenda:
            return [
                {"time": "18:00", "item": "Đón khách & Check-in"},
                {"time": "18:30", "item": "Khai mạc"},
                {"time": "19:00", "item": "Vinh danh & Tri ân"},
                {"time": "20:00", "item": "Gala & Networking"}
            ]
        
        lines = agenda.split('\n')
        program = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Tìm pattern "HH:MM - Nội dung"
            if ' - ' in line:
                parts = line.split(' - ', 1)
                if len(parts) == 2:
                    time_part = parts[0].strip()
                    item_part = parts[1].strip()
                    
                    # Kiểm tra format thời gian
                    if ':' in time_part and len(time_part) <= 5:
                        program.append({
                            "time": time_part,
                            "item": item_part
                        })
        
        return program if program else [
            {"time": "18:00", "item": "Đón khách & Check-in"},
            {"time": "18:30", "item": "Khai mạc"},
            {"time": "19:00", "item": "Vinh danh & Tri ân"},
            {"time": "20:00", "item": "Gala & Networking"}
        ]
    
    def calculate_rsvp_deadline(self, event_date: str) -> str:
        """
        Tính deadline RSVP (7 ngày trước sự kiện)
        """
        try:
            event_dt = datetime.fromisoformat(event_date.replace('Z', '+00:00'))
            deadline_dt = event_dt.replace(hour=23, minute=59, second=59)
            deadline_dt = deadline_dt.replace(day=deadline_dt.day - 7)
            return deadline_dt.strftime('%Y-%m-%d')
        except:
            return "2025-09-30"
    
    def generate_html_invitation(self, invitation_data: Dict[str, Any]) -> str:
        """
        Tạo HTML thiệp mời từ dữ liệu
        """
        template_html = """
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ invitation_data.event.title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0B2A4A 0%, #1E88E5 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .invitation-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .header {
            background: linear-gradient(135deg, #0B2A4A 0%, #1E88E5 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #0B2A4A;
            position: relative;
            z-index: 1;
        }
        
        .event-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .event-subtitle {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .guest-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 4px solid #1E88E5;
        }
        
        .guest-name {
            font-size: 20px;
            font-weight: bold;
            color: #0B2A4A;
            margin-bottom: 5px;
        }
        
        .guest-role {
            color: #666;
            font-size: 14px;
        }
        
        .event-details {
            margin-bottom: 30px;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .detail-icon {
            width: 40px;
            height: 40px;
            background: #1E88E5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: white;
            font-size: 18px;
        }
        
        .detail-content h3 {
            color: #0B2A4A;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .detail-content p {
            color: #666;
            font-size: 14px;
        }
        
        .program {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .program h3 {
            color: #0B2A4A;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .program-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
        }
        
        .program-item:last-child {
            border-bottom: none;
        }
        
        .program-time {
            font-weight: bold;
            color: #1E88E5;
            min-width: 60px;
        }
        
        .program-item-text {
            color: #333;
            flex: 1;
            margin-left: 15px;
        }
        
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 15px;
            border: 3px solid #1E88E5;
            border-radius: 10px;
            padding: 10px;
            background: white;
        }
        
        .qr-code img {
            width: 100%;
            height: 100%;
        }
        
        .rsvp-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 30px 0;
        }
        
        .rsvp-btn {
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .rsvp-accept {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
        }
        
        .rsvp-accept:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
        }
        
        .rsvp-decline {
            background: linear-gradient(135deg, #dc3545, #e83e8c);
            color: white;
        }
        
        .rsvp-decline:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
        }
        
        .footer {
            background: #0B2A4A;
            color: white;
            padding: 20px 30px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #1E88E5;
            text-decoration: none;
        }
        
        .deadline {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        
        @media (max-width: 600px) {
            .invitation-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .event-title {
                font-size: 24px;
            }
            
            .rsvp-buttons {
                flex-direction: column;
            }
            
            .rsvp-btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="invitation-container">
        <div class="header">
            <div class="logo">EXP</div>
            <h1 class="event-title">{{ invitation_data.event.title }}</h1>
            <p class="event-subtitle">{{ invitation_data.event.subtitle }}</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Kính gửi {{ invitation_data.guest.title }} {{ invitation_data.guest.name }},
            </div>
            
            <div class="guest-info">
                <div class="guest-name">{{ invitation_data.guest.title }} {{ invitation_data.guest.name }}</div>
                {% if invitation_data.guest.role %}
                <div class="guest-role">{{ invitation_data.guest.role }}</div>
                {% endif %}
                {% if invitation_data.guest.organization %}
                <div class="guest-role">{{ invitation_data.guest.organization }}</div>
                {% endif %}
            </div>
            
            <div class="event-details">
                <div class="detail-item">
                    <div class="detail-icon">📅</div>
                    <div class="detail-content">
                        <h3>Thời gian</h3>
                        <p>{{ invitation_data.event.datetime | format_datetime }}</p>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">📍</div>
                    <div class="detail-content">
                        <h3>Địa điểm</h3>
                        <p>{{ invitation_data.event.venue.name }}</p>
                        <p>{{ invitation_data.event.venue.address }}</p>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">🏢</div>
                    <div class="detail-content">
                        <h3>Tổ chức</h3>
                        <p>{{ invitation_data.event.host_org }}</p>
                    </div>
                </div>
            </div>
            
            <div class="program">
                <h3>Chương trình sự kiện</h3>
                {% for item in invitation_data.event.program_outline %}
                <div class="program-item">
                    <span class="program-time">{{ item.time }}</span>
                    <span class="program-item-text">{{ item.item }}</span>
                </div>
                {% endfor %}
            </div>
            
            <div class="qr-section">
                <h3>QR Code Check-in</h3>
                <div class="qr-code">
                    <img src="{{ invitation_data.qr.qr_url }}" alt="QR Code">
                </div>
                <p>Vui lòng mang theo QR code này để check-in tại sự kiện</p>
            </div>
            
            <div class="deadline">
                <strong>Hạn phản hồi RSVP: {{ invitation_data.rsvp.deadline }}</strong>
            </div>
            
            <div class="rsvp-buttons">
                <a href="{{ invitation_data.rsvp.accept_url }}" class="rsvp-btn rsvp-accept">
                    ✅ Chấp nhận tham gia
                </a>
                <a href="{{ invitation_data.rsvp.decline_url }}" class="rsvp-btn rsvp-decline">
                    ❌ Từ chối tham gia
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>{{ invitation_data.event.host_org }}</strong></p>
            <p>Thiệp mời ID: {{ invitation_data.meta.invitation_id }}</p>
            <p>Tạo ngày: {{ invitation_data.meta.created_at | format_date }}</p>
            <p>Liên hệ: <a href="mailto:contact@exp-solution.io">contact@exp-solution.io</a></p>
        </div>
    </div>
</body>
</html>
        """
        
        template = Template(template_html)
        
        # Custom filters
        def format_datetime(dt_str):
            try:
                dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
                return dt.strftime('%H:%M, %d/%m/%Y')
            except:
                return dt_str
        
        def format_date(dt_str):
            try:
                dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
                return dt.strftime('%d/%m/%Y')
            except:
                return dt_str
        
        template.globals['format_datetime'] = format_datetime
        template.globals['format_date'] = format_date
        
        return template.render(invitation_data=invitation_data)
    
    def save_invitation_html(self, invitation_data: Dict[str, Any], filename: str = None) -> str:
        """
        Lưu thiệp mời HTML vào file
        """
        if not filename:
            filename = f"invite_{invitation_data['meta']['invitation_id']}.html"
        
        html_content = self.generate_html_invitation(invitation_data)
        filepath = os.path.join(self.templates_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        return filepath







