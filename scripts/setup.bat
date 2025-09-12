@echo off
echo 🚀 Thiết lập Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm
echo ==================================================

REM Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python không được tìm thấy. Vui lòng cài đặt Python 3.8+
    pause
    exit /b 1
)

REM Kiểm tra Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js không được tìm thấy. Vui lòng cài đặt Node.js 16+
    pause
    exit /b 1
)

REM Kiểm tra npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm không được tìm thấy. Vui lòng cài đặt npm
    pause
    exit /b 1
)

echo ✅ Đã kiểm tra các yêu cầu hệ thống

REM Cài đặt Backend
echo 📦 Cài đặt Backend dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Lỗi cài đặt Backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies đã được cài đặt

REM Cài đặt Frontend
echo 📦 Cài đặt Frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Lỗi cài đặt Frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies đã được cài đặt

REM Tạo thư mục cần thiết
echo 📁 Tạo thư mục cần thiết...
cd ..
if not exist backend\qr_images mkdir backend\qr_images
if not exist backend\static mkdir backend\static
if not exist logs mkdir logs

REM Copy file cấu hình
echo ⚙️ Thiết lập cấu hình...
copy backend\env.example backend\.env
copy frontend\env.example frontend\.env

echo ✅ Thiết lập hoàn tất!
echo.
echo 🚀 Để chạy ứng dụng:
echo 1. Backend: cd backend ^&^& python run.py
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo 📱 Truy cập:
echo - API: http://localhost:8000
echo - Frontend: http://localhost:3000
echo - API Docs: http://localhost:8000/docs
echo.
pause







