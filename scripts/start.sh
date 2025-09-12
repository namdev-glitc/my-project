#!/bin/bash

echo "🚀 Khởi động Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm"
echo "=================================================="

# Kiểm tra xem backend đã chạy chưa
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend đã chạy tại http://localhost:8000"
else
    echo "🔄 Khởi động Backend..."
    cd backend
    python3 run.py &
    BACKEND_PID=$!
    cd ..
    sleep 5
fi

# Kiểm tra xem frontend đã chạy chưa
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend đã chạy tại http://localhost:3000"
else
    echo "🔄 Khởi động Frontend..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    sleep 3
fi

echo ""
echo "📱 Ứng dụng đã sẵn sàng:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
echo ""
echo "Nhấn Ctrl+C để dừng tất cả services"

# Hàm cleanup khi thoát
cleanup() {
    echo ""
    echo "🛑 Đang dừng services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "✅ Đã dừng tất cả services"
    exit 0
}

# Bắt tín hiệu thoát
trap cleanup SIGINT SIGTERM

# Chờ vô hạn
while true; do
    sleep 1
done







