#!/bin/bash

echo "🚀 Thiết lập Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm"
echo "=================================================="

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 không được tìm thấy. Vui lòng cài đặt Python 3.8+"
    exit 1
fi

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js không được tìm thấy. Vui lòng cài đặt Node.js 16+"
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm không được tìm thấy. Vui lòng cài đặt npm"
    exit 1
fi

echo "✅ Đã kiểm tra các yêu cầu hệ thống"

# Cài đặt Backend
echo "📦 Cài đặt Backend dependencies..."
cd backend
python3 -m pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies đã được cài đặt"
else
    echo "❌ Lỗi cài đặt Backend dependencies"
    exit 1
fi

# Cài đặt Frontend
echo "📦 Cài đặt Frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies đã được cài đặt"
else
    echo "❌ Lỗi cài đặt Frontend dependencies"
    exit 1
fi

# Tạo thư mục cần thiết
echo "📁 Tạo thư mục cần thiết..."
cd ..
mkdir -p backend/qr_images
mkdir -p backend/static
mkdir -p logs

# Copy file cấu hình
echo "⚙️ Thiết lập cấu hình..."
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

echo "✅ Thiết lập hoàn tất!"
echo ""
echo "🚀 Để chạy ứng dụng:"
echo "1. Backend: cd backend && python run.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "📱 Truy cập:"
echo "- API: http://localhost:8000"
echo "- Frontend: http://localhost:3000"
echo "- API Docs: http://localhost:8000/docs"







