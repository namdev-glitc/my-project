# 🎉 Tính năng Thiệp mời

## 📋 Tổng quan

Hệ thống đã được tích hợp tính năng **tạo thiệp mời tự động** dựa trên mẫu bạn cung cấp. Tính năng này cho phép tạo thiệp mời HTML đẹp mắt cho từng khách mời với đầy đủ thông tin sự kiện.

## ✨ Tính năng chính

### 1. **Tạo thiệp mời tự động**
- Tự động tạo thiệp mời HTML từ dữ liệu khách mời và sự kiện
- Sử dụng mẫu thiết kế chuyên nghiệp với theme EXP Technology
- Responsive design, hiển thị đẹp trên mọi thiết bị

### 2. **Tích hợp QR Code**
- Tự động tạo QR code cho mỗi thiệp mời
- QR code chứa thông tin check-in của khách mời
- Hiển thị QR code trực tiếp trong thiệp mời

### 3. **Nút RSVP trực tiếp**
- Nút "Chấp nhận tham gia" và "Từ chối tham gia"
- Link trực tiếp đến hệ thống RSVP
- Hạn phản hồi RSVP tự động tính toán

### 4. **Thông tin sự kiện chi tiết**
- Tên sự kiện và mô tả
- Thời gian và địa điểm
- Chương trình sự kiện (tự động parse từ agenda)
- Thông tin liên hệ

### 5. **Branding EXP Technology**
- Logo và màu sắc theo thương hiệu
- Thiết kế chuyên nghiệp, hiện đại
- Gradient và hiệu ứng đẹp mắt

## 🚀 Cách sử dụng

### 1. **Truy cập trang Thiệp mời**
- Vào menu "Thiệp mời" trong sidebar
- Chọn khách mời từ danh sách
- Nhấn "Tạo thiệp mời"

### 2. **Xem trước thiệp mời**
- Hệ thống sẽ hiển thị preview thiệp mời
- Có thể xem mẫu thiệp mời trước khi tạo
- Responsive preview trên desktop và mobile

### 3. **Tải xuống thiệp mời**
- Nhấn "Tải xuống" để lưu file HTML
- File được lưu với tên `invite_INV{ID}.html`
- Có thể gửi qua email cho khách mời

### 4. **Tạo hàng loạt**
- Nhấn "Tạo tất cả" để tạo thiệp mời cho tất cả khách mời
- Hệ thống sẽ tạo và lưu tất cả file HTML
- Hiển thị tiến trình và kết quả

## 📁 Cấu trúc dữ liệu

### Mẫu dữ liệu thiệp mời:
```json
{
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
    "qr_url": "data:image/png;base64,...",
    "value": "INV123"
  },
  "delivery": {
    "mode": "email",
    "email_subject": "Thiệp mời Lễ kỷ niệm 15 năm EXP Technology",
    "email_to": "guest@example.com",
    "file_name": "invite_INV123.html"
  },
  "branding": {
    "logo_url": "/static/logo.png",
    "primary_color": "#0B2A4A",
    "accent_color": "#1E88E5"
  },
  "meta": {
    "invitation_id": "INV123",
    "created_at": "2025-09-10T18:00:00",
    "notes": "Thiệp mời tự động"
  }
}
```

## 🔧 API Endpoints

### 1. **Tạo thiệp mời cho khách mời**
```http
GET /api/invitations/generate/{guest_id}
```

### 2. **Tạo thiệp mời cho tất cả khách mời**
```http
GET /api/invitations/generate-all?event_id=1
```

### 3. **Xem trước mẫu thiệp mời**
```http
GET /api/invitations/preview
```

### 4. **Tải xuống thiệp mời**
```http
GET /api/invitations/download/{guest_id}
```

### 5. **Lấy mẫu dữ liệu**
```http
GET /api/invitations/template
```

## 🎨 Thiết kế

### **Màu sắc:**
- **Primary**: #0B2A4A (Dark blue)
- **Accent**: #1E88E5 (Light blue)
- **Background**: Gradient từ dark blue đến light blue
- **Text**: White trên background tối, dark trên background sáng

### **Typography:**
- **Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold, lớn hơn
- **Body**: Regular, dễ đọc

### **Layout:**
- **Container**: 600px max-width, centered
- **Responsive**: Mobile-first design
- **Cards**: Rounded corners, shadows
- **Buttons**: Gradient, hover effects

## 📱 Responsive Design

### **Desktop (> 1024px):**
- 2 cột layout
- Full preview
- Sidebar navigation

### **Tablet (768px - 1024px):**
- 1 cột layout
- Compact preview
- Collapsible sidebar

### **Mobile (< 768px):**
- Single column
- Stacked layout
- Touch-friendly buttons

## 🔄 Workflow

1. **Chọn khách mời** → Từ danh sách khách mời
2. **Tạo thiệp mời** → Hệ thống tự động tạo HTML
3. **Xem trước** → Preview thiệp mời
4. **Tải xuống** → Lưu file HTML
5. **Gửi email** → Gửi cho khách mời
6. **RSVP** → Khách mời phản hồi qua link
7. **Check-in** → Sử dụng QR code tại sự kiện

## 🚀 Cải tiến trong tương lai

- [ ] **Email integration** - Gửi thiệp mời tự động qua email
- [ ] **PDF export** - Xuất thiệp mời dưới dạng PDF
- [ ] **Custom templates** - Tùy chỉnh mẫu thiệp mời
- [ ] **Bulk email** - Gửi hàng loạt thiệp mời
- [ ] **RSVP tracking** - Theo dõi trạng thái RSVP
- [ ] **Analytics** - Thống kê mở email, click link

---

**Lưu ý**: Tính năng thiệp mời đã được tích hợp hoàn chỉnh vào hệ thống. Bạn có thể sử dụng ngay sau khi khởi động ứng dụng!







