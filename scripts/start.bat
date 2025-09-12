@echo off
echo 🚀 Khởi động Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm
echo ==================================================

REM Kiểm tra xem backend đã chạy chưa
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend đã chạy tại http://localhost:8000
) else (
    echo 🔄 Khởi động Backend...
    start "Backend" cmd /k "cd backend && python run.py"
    timeout /t 5 /nobreak >nul
)

REM Kiểm tra xem frontend đã chạy chưa
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend đã chạy tại http://localhost:3000
) else (
    echo 🔄 Khởi động Frontend...
    start "Frontend" cmd /k "cd frontend && npm start"
    timeout /t 3 /nobreak >nul
)

echo.
echo 📱 Ứng dụng đã sẵn sàng:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Documentation: http://localhost:8000/docs
echo.
echo Nhấn Ctrl+C để dừng tất cả services
pause







