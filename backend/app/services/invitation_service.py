import os
from datetime import datetime
from typing import Dict, Any
from jinja2 import Template, Environment
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
                "datetime": event.get('event_date', event.get('date')),
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
    
    def generate_html_invitation(self, invitation_data: Dict[str, Any], template_type: str = "elegant") -> str:
        """
        Tạo HTML thiệp mời từ dữ liệu với template khác nhau
        """
        # Chọn template dựa trên template_type
        if template_type == "elegant":
            template_html = self._get_elegant_template()
        elif template_type == "modern":
            template_html = self._get_modern_template()
        elif template_type == "classic":
            template_html = self._get_classic_template()
        elif template_type == "festive":
            template_html = self._get_festive_template()
        else:
            template_html = self._get_elegant_template()
        
        # Render template với Jinja2
        env = Environment()
        
        # Register custom filters
        def format_datetime(value):
            if not value:
                return ""
            try:
                dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                return dt.strftime("%d/%m/%Y lúc %H:%M")
            except:
                return str(value)
        
        def format_date(value):
            if not value:
                return ""
            try:
                dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                return dt.strftime("%d/%m/%Y")
            except:
                return str(value)
        
        env.filters['format_datetime'] = format_datetime
        env.filters['format_date'] = format_date
        
        template = env.from_string(template_html)
        return template.render(invitation_data=invitation_data)
    
    def _get_elegant_template(self) -> str:
        """
        Template thanh lịch - Thiết kế sang trọng
        """
        return """
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
            font-family: 'Georgia', 'Times New Roman', serif;
            background: radial-gradient(1200px 800px at 50% -200px, #1b2454 0%, #150f2e 50%, #0a0a1a 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .invitation-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
            position: relative;
            border: 1px solid rgba(212,175,55,0.35); /* gold foil */
        }

        /* soft vignette and subtle pattern */
        .invitation-container::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%),
                        radial-gradient(120% 80% at 50% 120%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 40%);
            pointer-events: none;
        }

        /* inner subtle border to create depth */
        .invitation-container::after {
            content: '';
            position: absolute;
            inset: 12px;
            border-radius: 14px;
            border: 1px solid rgba(212,175,55,0.25);
            pointer-events: none;
        }
        
        .header {
            background: linear-gradient(135deg, #101935 0%, #291b5c 60%, #3b1f6d 100%);
            color: #fff8e7;
            padding: 48px 30px 36px;
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

        /* corner ornaments */
        .ornament {
            position: absolute;
            width: 80px;
            height: 80px;
            opacity: .5;
            pointer-events: none;
            background-repeat: no-repeat;
            background-size: contain;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,.3));
        }
        .ornament.tl { left: 8px; top: 8px; transform: rotate(0deg); }
        .ornament.br { right: 8px; bottom: 8px; transform: rotate(180deg); }
        .ornament.tl, .ornament.br {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M2 62 Q24 40 24 24 Q24 10 38 2" fill="none" stroke="%23d4af37" stroke-width="2"/><circle cx="40" cy="2" r="2" fill="%23f3e8a3"/></svg>');
        }
        
        .logo {
            width: 88px;
            height: 44px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #fff8e7;
            position: relative;
            z-index: 1;
            border: 2px solid rgba(212,175,55,0.55);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15), 0 6px 18px rgba(0,0,0,0.35);
        }
        
        .event-title {
            font-size: 30px;
            font-weight: 700;
            margin-bottom: 6px;
            position: relative;
            z-index: 1;
            color: #fff8e7;
        }
        
        .event-subtitle {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            color: #efe7cf;
        }

        .date-badge {
            display: inline-block;
            margin-top: 14px;
            padding: 6px 12px;
            border: 1px solid rgba(212,175,55,.6);
            border-radius: 999px;
            color: #fff8e7;
            font-size: 12px;
            letter-spacing: .5px;
            background: linear-gradient(135deg, rgba(212,175,55,.25), rgba(255,255,255,.08));
        }
        
        .content {
            padding: 40px 30px;
        }

        /* divider with diamond */
        .divider { position: relative; margin: 24px auto; height: 1px; background: linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,.5) 50%, rgba(212,175,55,0) 100%);}        
        .divider .diamond { position: absolute; left: 50%; top: -5px; width: 10px; height: 10px; background: linear-gradient(135deg, #d4af37, #f3e8a3); transform: translateX(-50%) rotate(45deg); box-shadow: 0 2px 6px rgba(0,0,0,.2);}        
        
        .greeting {
            font-size: 18px;
            color: #2a2a2a;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .guest-info {
            background: #fbfbfb;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 4px solid rgba(212,175,55,0.85);
        }
        
        .guest-name {
            font-size: 20px;
            font-weight: 700;
            color: #1b2454;
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
            background: linear-gradient(135deg, #c79c2b, #e6c972);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: #1b2454;
            font-size: 18px;
        }
        
        .detail-content h3 {
            color: #1b2454;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .detail-content p {
            color: #666;
            font-size: 14px;
        }
        
        .program {
            background: #fbfbfb;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border: 1px solid rgba(212,175,55,0.25);
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
            font-weight: 700;
            color: #1b2454;
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
            background: #ffffff;
            border-radius: 10px;
            border: 1px solid rgba(212,175,55,0.25);
        }
        
        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 15px;
            border: 3px solid rgba(212,175,55,0.85);
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
            background: linear-gradient(135deg, #d4af37, #f3e8a3);
            color: #1b2454;
            border: 1px solid rgba(212,175,55,0.9);
        }
        
        .rsvp-accept:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(212,175,55,0.35);
        }

        /* sheen effect */
        .rsvp-accept::after { content:''; position:absolute; inset:0; border-radius:25px; background: linear-gradient(120deg, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.0) 70%); transform: translateX(-100%); transition: transform .8s ease; }
        .rsvp-accept:hover::after { transform: translateX(100%); }
        
        .rsvp-decline {
            background: transparent;
            color: #1b2454;
            border: 1px solid #cbd0df;
            backdrop-filter: blur(4px);
        }
        
        .rsvp-decline:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }
        
        .footer {
            background: #101935;
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
            background: #fffaf1;
            border: 1px solid rgba(212,175,55,0.4);
            color: #5d4a12;
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
            <div class="date-badge">{{ invitation_data.event.datetime | format_datetime }}</div>
            <div class="ornament tl"></div>
            <div class="ornament br"></div>
        </div>
        
        <div class="content">
            <div class="divider"><span class="diamond"></span></div>
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
    
    def _get_modern_template(self) -> str:
        """
        Template hiện đại - Phong cách trẻ trung
        """
        return """
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
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: linear-gradient(45deg, #2D3748 0%, #4299E1 50%, #38B2AC 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .invitation-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            position: relative;
        }
        
        .header {
            background: linear-gradient(135deg, #2D3748 0%, #4299E1 100%);
            color: white;
            padding: 50px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .logo {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #38B2AC, #4299E1);
            border-radius: 20px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 900;
            color: white;
            position: relative;
            z-index: 1;
            transform: rotate(-5deg);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .event-title {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            letter-spacing: -1px;
        }
        
        .event-subtitle {
            font-size: 18px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            font-weight: 300;
        }
        
        .content {
            padding: 50px 30px;
        }
        
        .greeting {
            font-size: 20px;
            color: #2D3748;
            margin-bottom: 40px;
            text-align: center;
            font-weight: 600;
        }
        
        .info-grid {
            display: grid;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .info-card {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 16px;
            padding: 25px;
            border-left: 4px solid #4299E1;
            transition: transform 0.3s ease;
        }
        
        .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .info-title {
            font-size: 16px;
            font-weight: 700;
            color: #2D3748;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .info-value {
            font-size: 18px;
            color: #4a5568;
            font-weight: 500;
        }
        
        .program {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 40px;
        }
        
        .program h3 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .program-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .program-item:last-child {
            border-bottom: none;
        }
        
        .program-time {
            font-weight: 700;
            font-size: 16px;
            min-width: 80px;
        }
        
        .program-activity {
            flex: 1;
            margin-left: 20px;
            font-size: 16px;
        }
        
        .rsvp-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .rsvp-button {
            display: inline-block;
            background: linear-gradient(135deg, #4299E1 0%, #38B2AC 100%);
            color: white;
            padding: 18px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(66, 153, 225, 0.3);
        }
        
        .rsvp-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(66, 153, 225, 0.4);
        }
        
        .qr-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 20px;
        }
        
        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 20px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .footer {
            background: #2D3748;
            color: white;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .footer a {
            color: #4299E1;
            text-decoration: none;
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
                Xin chào {{ invitation_data.guest.title }} {{ invitation_data.guest.name }}! 🚀
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-title">📅 Thời gian</div>
                    <div class="info-value">{{ invitation_data.event.datetime | format_datetime }}</div>
                </div>
                
                <div class="info-card">
                    <div class="info-title">📍 Địa điểm</div>
                    <div class="info-value">{{ invitation_data.event.venue.name }}</div>
                </div>
                
                <div class="info-card">
                    <div class="info-title">🏢 Tổ chức</div>
                    <div class="info-value">{{ invitation_data.event.host_org }}</div>
                </div>
            </div>
            
            <div class="program">
                <h3>🎯 Chương trình</h3>
                {% for item in invitation_data.event.program_outline %}
                <div class="program-item">
                    <div class="program-time">{{ item.time }}</div>
                    <div class="program-activity">{{ item.item }}</div>
                </div>
                {% endfor %}
            </div>
            
            <div class="rsvp-section">
                <a href="{{ invitation_data.rsvp.rsvp_url }}" class="rsvp-button">
                    ✨ Xác nhận tham gia
                </a>
                <p style="margin-top: 15px; color: #666; font-size: 14px;">
                    Hạn chót: {{ invitation_data.rsvp.deadline | format_date }}
                </p>
            </div>
            
            <div class="qr-section">
                <h3 style="color: #2D3748; margin-bottom: 20px;">📱 QR Code Check-in</h3>
                <img src="{{ invitation_data.qr_code }}" alt="QR Code" class="qr-code">
                <p style="color: #666; font-size: 14px;">
                    Quét mã QR để check-in nhanh chóng
                </p>
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
    
    def _get_classic_template(self) -> str:
        """
        Template cổ điển - Truyền thống
        """
        return """
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
            font-family: 'Times New Roman', serif;
            background: #1A202C;
            min-height: 100vh;
            padding: 20px;
        }
        
        .invitation-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 0;
            overflow: hidden;
            box-shadow: 0 0 0 2px #718096, 0 0 0 4px #1A202C;
            position: relative;
        }
        
        .header {
            background: #1A202C;
            color: white;
            padding: 60px 40px;
            text-align: center;
            position: relative;
        }
        
        .logo {
            width: 120px;
            height: 120px;
            background: white;
            border: 3px solid #718096;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: #1A202C;
            position: relative;
            z-index: 1;
        }
        
        .event-title {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            letter-spacing: 2px;
        }
        
        .event-subtitle {
            font-size: 18px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            font-style: italic;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .greeting {
            font-size: 20px;
            color: #2D3748;
            margin-bottom: 40px;
            text-align: center;
            font-style: italic;
        }
        
        .info-section {
            margin-bottom: 40px;
        }
        
        .info-item {
            display: flex;
            margin-bottom: 20px;
            align-items: center;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 15px;
        }
        
        .info-label {
            font-weight: bold;
            color: #1A202C;
            min-width: 120px;
            font-size: 16px;
        }
        
        .info-value {
            font-size: 16px;
            color: #4a5568;
            flex: 1;
        }
        
        .program {
            background: #f7fafc;
            border: 2px solid #718096;
            padding: 30px;
            margin-bottom: 40px;
        }
        
        .program h3 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 25px;
            text-align: center;
            color: #1A202C;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .program-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #cbd5e0;
        }
        
        .program-item:last-child {
            border-bottom: none;
        }
        
        .program-time {
            font-weight: bold;
            font-size: 16px;
            color: #1A202C;
            min-width: 80px;
        }
        
        .program-activity {
            flex: 1;
            margin-left: 20px;
            font-size: 16px;
            color: #4a5568;
        }
        
        .rsvp-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            border: 2px solid #718096;
        }
        
        .rsvp-button {
            display: inline-block;
            background: #1A202C;
            color: white;
            padding: 15px 40px;
            border: 2px solid #718096;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .rsvp-button:hover {
            background: white;
            color: #1A202C;
        }
        
        .qr-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            border: 2px solid #e2e8f0;
        }
        
        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 20px;
            border: 2px solid #718096;
        }
        
        .footer {
            background: #1A202C;
            color: white;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .footer a {
            color: #718096;
            text-decoration: none;
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
                Kính gửi {{ invitation_data.guest.title }} {{ invitation_data.guest.name }}
            </div>
            
            <div class="info-section">
                <div class="info-item">
                    <div class="info-label">Thời gian:</div>
                    <div class="info-value">{{ invitation_data.event.datetime | format_datetime }}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Địa điểm:</div>
                    <div class="info-value">{{ invitation_data.event.venue.name }}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">Tổ chức:</div>
                    <div class="info-value">{{ invitation_data.event.host_org }}</div>
                </div>
            </div>
            
            <div class="program">
                <h3>Chương trình</h3>
                {% for item in invitation_data.event.program_outline %}
                <div class="program-item">
                    <div class="program-time">{{ item.time }}</div>
                    <div class="program-activity">{{ item.item }}</div>
                </div>
                {% endfor %}
            </div>
            
            <div class="rsvp-section">
                <a href="{{ invitation_data.rsvp.rsvp_url }}" class="rsvp-button">
                    Xác nhận tham gia
                </a>
                <p style="margin-top: 15px; color: #666; font-size: 14px;">
                    Hạn chót: {{ invitation_data.rsvp.deadline | format_date }}
                </p>
            </div>
            
            <div class="qr-section">
                <h3 style="color: #1A202C; margin-bottom: 20px;">QR Code Check-in</h3>
                <img src="{{ invitation_data.qr_code }}" alt="QR Code" class="qr-code">
                <p style="color: #666; font-size: 14px;">
                    Quét mã QR để check-in
                </p>
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
    
    def _get_festive_template(self) -> str:
        """
        Template lễ hội - Vui tươi
        """
        return """
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
            font-family: 'Comic Sans MS', cursive, sans-serif;
            background: linear-gradient(45deg, #C53030 0%, #F56565 25%, #F6AD55 50%, #68D391 75%, #4FD1C7 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .invitation-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
        }
        
        .header {
            background: linear-gradient(135deg, #C53030 0%, #F56565 100%);
            color: white;
            padding: 50px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .logo {
            width: 100px;
            height: 100px;
            background: linear-gradient(45deg, #F6AD55, #68D391);
            border-radius: 50%;
            margin: 30px auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: white;
            position: relative;
            z-index: 1;
            animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        .event-title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .event-subtitle {
            font-size: 18px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            font-weight: 600;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 22px;
            color: #2D3748;
            margin-bottom: 30px;
            text-align: center;
            font-weight: bold;
        }
        
        .info-grid {
            display: grid;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-card {
            background: linear-gradient(135deg, #FFF5F5 0%, #FED7D7 100%);
            border-radius: 20px;
            padding: 20px;
            border: 3px solid #F56565;
            transition: transform 0.3s ease;
        }
        
        .info-card:hover {
            transform: scale(1.05);
        }
        
        .info-title {
            font-size: 16px;
            font-weight: bold;
            color: #C53030;
            margin-bottom: 8px;
        }
        
        .info-value {
            font-size: 18px;
            color: #2D3748;
            font-weight: 600;
        }
        
        .program {
            background: linear-gradient(135deg, #68D391 0%, #4FD1C7 100%);
            color: white;
            border-radius: 25px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .program h3 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .program-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 2px solid rgba(255,255,255,0.3);
        }
        
        .program-item:last-child {
            border-bottom: none;
        }
        
        .program-time {
            font-weight: bold;
            font-size: 16px;
            min-width: 80px;
        }
        
        .program-activity {
            flex: 1;
            margin-left: 20px;
            font-size: 16px;
        }
        
        .rsvp-section {
            text-align: center;
            margin: 30px 0;
        }
        
        .rsvp-button {
            display: inline-block;
            background: linear-gradient(135deg, #F6AD55 0%, #68D391 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(246, 173, 85, 0.4);
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .rsvp-button:hover {
            transform: scale(1.1);
        }
        
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #FED7D7 0%, #FFF5F5 100%);
            border-radius: 25px;
            border: 3px solid #F56565;
        }
        
        .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 20px;
            border-radius: 20px;
            border: 4px solid #F56565;
        }
        
        .footer {
            background: linear-gradient(135deg, #C53030 0%, #F56565 100%);
            color: white;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .footer a {
            color: #FED7D7;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="invitation-container">
        <div class="header">
            <div class="logo">🎉</div>
            <h1 class="event-title">{{ invitation_data.event.title }}</h1>
            <p class="event-subtitle">{{ invitation_data.event.subtitle }}</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Chào mừng {{ invitation_data.guest.title }} {{ invitation_data.guest.name }}! 🎊
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-title">🕐 Thời gian</div>
                    <div class="info-value">{{ invitation_data.event.datetime | format_datetime }}</div>
                </div>
                
                <div class="info-card">
                    <div class="info-title">🏢 Địa điểm</div>
                    <div class="info-value">{{ invitation_data.event.venue.name }}</div>
                </div>
                
                <div class="info-card">
                    <div class="info-title">🎈 Tổ chức</div>
                    <div class="info-value">{{ invitation_data.event.host_org }}</div>
                </div>
            </div>
            
            <div class="program">
                <h3>🎪 Chương trình vui vẻ</h3>
                {% for item in invitation_data.event.program_outline %}
                <div class="program-item">
                    <div class="program-time">{{ item.time }}</div>
                    <div class="program-activity">{{ item.item }}</div>
                </div>
                {% endfor %}
            </div>
            
            <div class="rsvp-section">
                <a href="{{ invitation_data.rsvp.rsvp_url }}" class="rsvp-button">
                    🎉 Tham gia ngay!
                </a>
                <p style="margin-top: 15px; color: #666; font-size: 14px;">
                    Hạn chót: {{ invitation_data.rsvp.deadline | format_date }}
                </p>
            </div>
            
            <div class="qr-section">
                <h3 style="color: #C53030; margin-bottom: 20px;">📱 QR Code Check-in</h3>
                <img src="{{ invitation_data.qr_code }}" alt="QR Code" class="qr-code">
                <p style="color: #666; font-size: 14px;">
                    Quét mã QR để check-in siêu nhanh! 🚀
                </p>
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








