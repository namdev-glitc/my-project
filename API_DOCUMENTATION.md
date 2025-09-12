# 📚 API Documentation

## 🔗 Base URL
```
http://localhost:8000/api
```

## 📋 Endpoints Overview

### Guests Management
- `GET /guests/` - Lấy danh sách khách mời
- `GET /guests/{id}` - Lấy thông tin khách mời
- `POST /guests/` - Tạo khách mời mới
- `PUT /guests/{id}` - Cập nhật khách mời
- `DELETE /guests/{id}` - Xóa khách mời
- `POST /guests/{id}/rsvp` - Cập nhật RSVP
- `POST /guests/{id}/checkin` - Check-in khách mời
- `GET /guests/{id}/qr` - Lấy QR code
- `POST /guests/import` - Import từ file
- `GET /guests/stats/summary` - Thống kê khách mời

### Events Management
- `GET /events/` - Lấy danh sách sự kiện
- `GET /events/{id}` - Lấy thông tin sự kiện
- `POST /events/` - Tạo sự kiện mới
- `PUT /events/{id}` - Cập nhật sự kiện
- `DELETE /events/{id}` - Xóa sự kiện
- `GET /events/{id}/stats` - Thống kê sự kiện

## 📝 Detailed API Reference

### 1. Guests API

#### GET /guests/
Lấy danh sách khách mời với bộ lọc

**Query Parameters:**
```json
{
  "skip": 0,           // Số bản ghi bỏ qua (pagination)
  "limit": 100,        // Số bản ghi trả về
  "event_id": 1,       // ID sự kiện
  "rsvp_status": "accepted", // Trạng thái RSVP
  "organization": "ICTU",     // Tên tổ chức
  "checked_in": true          // Trạng thái check-in
}
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Mr",
    "name": "Nguyễn Văn A",
    "role": "CEO",
    "organization": "Công ty ABC",
    "tag": "ABC",
    "email": "nguyenvana@abc.com",
    "phone": "0123456789",
    "qr_code": "{\"guest_id\": 1, \"event_id\": 1, \"type\": \"guest_checkin\"}",
    "qr_image_path": "qr_images/guest_1_abc123.png",
    "rsvp_status": "accepted",
    "rsvp_response_date": "2024-01-15T10:30:00",
    "rsvp_notes": "Sẽ tham gia đúng giờ",
    "checked_in": true,
    "check_in_time": "2024-01-15T18:00:00",
    "check_in_location": "Lobby",
    "created_at": "2024-01-10T09:00:00",
    "updated_at": "2024-01-15T18:00:00",
    "event_id": 1
  }
]
```

#### POST /guests/
Tạo khách mời mới

**Request Body:**
```json
{
  "title": "Mr",
  "name": "Nguyễn Văn A",
  "role": "CEO",
  "organization": "Công ty ABC",
  "tag": "ABC",
  "email": "nguyenvana@abc.com",
  "phone": "0123456789",
  "event_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Mr",
  "name": "Nguyễn Văn A",
  "role": "CEO",
  "organization": "Công ty ABC",
  "tag": "ABC",
  "email": "nguyenvana@abc.com",
  "phone": "0123456789",
  "qr_code": "{\"guest_id\": 1, \"event_id\": 1, \"type\": \"guest_checkin\"}",
  "qr_image_path": "qr_images/guest_1_abc123.png",
  "rsvp_status": "pending",
  "checked_in": false,
  "created_at": "2024-01-10T09:00:00",
  "updated_at": "2024-01-10T09:00:00",
  "event_id": 1
}
```

#### POST /guests/{id}/rsvp
Cập nhật RSVP cho khách mời

**Request Body:**
```json
{
  "rsvp_status": "accepted",
  "rsvp_notes": "Sẽ tham gia đúng giờ"
}
```

**Response:**
```json
{
  "id": 1,
  "rsvp_status": "accepted",
  "rsvp_response_date": "2024-01-15T10:30:00",
  "rsvp_notes": "Sẽ tham gia đúng giờ",
  "updated_at": "2024-01-15T10:30:00"
}
```

#### POST /guests/{id}/checkin
Check-in khách mời

**Request Body:**
```json
{
  "check_in_location": "Lobby"
}
```

**Response:**
```json
{
  "id": 1,
  "checked_in": true,
  "check_in_time": "2024-01-15T18:00:00",
  "check_in_location": "Lobby",
  "updated_at": "2024-01-15T18:00:00"
}
```

#### POST /guests/import
Import danh sách khách mời từ file

**Request:**
- Content-Type: `multipart/form-data`
- File: CSV/Excel/JSON file
- event_id: ID sự kiện

**Response:**
```json
{
  "message": "Đã import thành công 10 khách mời",
  "guests": [
    {
      "id": 1,
      "name": "Nguyễn Văn A",
      "organization": "Công ty ABC"
    }
  ]
}
```

### 2. Events API

#### GET /events/
Lấy danh sách sự kiện

**Query Parameters:**
```json
{
  "skip": 0,
  "limit": 100,
  "is_active": true
}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Lễ kỷ niệm 15 năm EXP Techno Logy",
    "description": "Sự kiện kỷ niệm 15 năm thành lập công ty",
    "event_date": "2024-12-15T18:00:00",
    "location": "Trung tâm Hội nghị Quốc gia",
    "address": "Số 1 Thăng Long, Nam Từ Liêm, Hà Nội",
    "agenda": "18:00 - Đón khách\n18:30 - Khai mạc\n19:00 - Tiệc buffet",
    "dress_code": "Lịch sự",
    "contact_person": "Nguyễn Văn A",
    "contact_phone": "0123456789",
    "contact_email": "contact@exp-solution.io",
    "is_active": true,
    "registration_open": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### POST /events/
Tạo sự kiện mới

**Request Body:**
```json
{
  "name": "Lễ kỷ niệm 15 năm EXP Techno Logy",
  "description": "Sự kiện kỷ niệm 15 năm thành lập công ty",
  "event_date": "2024-12-15T18:00:00",
  "location": "Trung tâm Hội nghị Quốc gia",
  "address": "Số 1 Thăng Long, Nam Từ Liêm, Hà Nội",
  "agenda": "18:00 - Đón khách\n18:30 - Khai mạc\n19:00 - Tiệc buffet",
  "dress_code": "Lịch sự",
  "contact_person": "Nguyễn Văn A",
  "contact_phone": "0123456789",
  "contact_email": "contact@exp-solution.io"
}
```

### 3. Statistics API

#### GET /guests/stats/summary
Lấy thống kê tổng quan khách mời

**Response:**
```json
{
  "total_guests": 100,
  "checked_in": 85,
  "rsvp_accepted": 90,
  "rsvp_declined": 5,
  "rsvp_pending": 5,
  "check_in_rate": 85.0
}
```

#### GET /events/{id}/stats
Lấy thống kê chi tiết sự kiện

**Response:**
```json
{
  "event": {
    "id": 1,
    "name": "Lễ kỷ niệm 15 năm EXP Techno Logy",
    "event_date": "2024-12-15T18:00:00",
    "location": "Trung tâm Hội nghị Quốc gia"
  },
  "guests": {
    "total": 100,
    "checked_in": 85,
    "rsvp_accepted": 90,
    "rsvp_declined": 5,
    "rsvp_pending": 5,
    "check_in_rate": 85.0
  },
  "organizations": [
    {
      "name": "ICTU",
      "count": 25
    },
    {
      "name": "Hachitech",
      "count": 20
    }
  ]
}
```

## 🔐 Authentication

Hiện tại API chưa có authentication. Trong tương lai sẽ thêm:
- JWT tokens
- API keys
- Role-based access control

## 📊 Error Handling

### Error Response Format
```json
{
  "detail": "Error message",
  "status_code": 400,
  "timestamp": "2024-01-15T10:30:00"
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🧪 Testing

### Test với cURL

#### Tạo khách mời
```bash
curl -X POST "http://localhost:8000/api/guests/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mr",
    "name": "Nguyễn Văn A",
    "role": "CEO",
    "organization": "Công ty ABC",
    "event_id": 1
  }'
```

#### Cập nhật RSVP
```bash
curl -X POST "http://localhost:8000/api/guests/1/rsvp" \
  -H "Content-Type: application/json" \
  -d '{
    "rsvp_status": "accepted",
    "rsvp_notes": "Sẽ tham gia đúng giờ"
  }'
```

#### Check-in khách mời
```bash
curl -X POST "http://localhost:8000/api/guests/1/checkin" \
  -H "Content-Type: application/json" \
  -d '{
    "check_in_location": "Lobby"
  }'
```

## 📱 Frontend Integration

### Axios Example
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy danh sách khách mời
const getGuests = async () => {
  const response = await api.get('/guests/');
  return response.data;
};

// Tạo khách mời mới
const createGuest = async (guestData) => {
  const response = await api.post('/guests/', guestData);
  return response.data;
};

// Cập nhật RSVP
const updateRSVP = async (guestId, rsvpData) => {
  const response = await api.post(`/guests/${guestId}/rsvp`, rsvpData);
  return response.data;
};
```

## 🔄 Rate Limiting

Hiện tại chưa có rate limiting. Trong tương lai sẽ thêm:
- 100 requests/minute per IP
- 1000 requests/hour per API key

## 📈 Monitoring

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "API đang hoạt động bình thường",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

**Lưu ý**: API documentation này được tạo tự động từ FastAPI. Để xem documentation tương tác, truy cập: http://localhost:8000/docs







