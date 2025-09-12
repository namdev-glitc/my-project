# Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm

## 📋 Mô tả Dự án
Hệ thống quản lý khách mời cho sự kiện lễ kỷ niệm 15 năm với các tính năng:
- Quản lý danh sách khách mời
- Tạo QR code cho từng khách
- Hệ thống RSVP (phản hồi tham gia)
- Check-in sự kiện bằng QR code
- Báo cáo thống kê

## 🛠️ Tech Stack
- **Backend**: FastAPI + SQLite
- **Frontend**: React + TypeScript
- **UI Theme**: EXP Techno Logy Design
- **QR Code**: qrcode library
- **Authentication**: JWT

## 📁 Cấu trúc Dự án
```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── tests/
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Main pages
│   │   ├── services/       # API calls
│   │   └── styles/         # CSS/SCSS
│   └── package.json
├── docs/                   # Documentation
└── scripts/                # Deployment scripts
```

## 🚀 Cài đặt và Chạy

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📊 Dữ liệu Mẫu
- File `guests.json` chứa 32 khách mời thực tế
- Các tổ chức: ICTU, Hachitech, EcomElite, Biva, GTE, v.v.

## 🎨 Theme
Sử dụng theme dựa trên logo EXP Techno Logy với:
- Gradient: Cyan → Indigo → Magenta
- Font: Sans-serif hiện đại
- Background: Xanh đậm với hiệu ứng hạt nhiễu

