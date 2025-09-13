@echo off
echo ========================================
echo    EXP Technology - Guest Management System
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "python run.py"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"
timeout /t 3 /nobreak > nul

echo [3/3] Opening Browser...
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo    System Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo Email:    admin@exp-solution.io
echo Password: admin123
echo.
echo Press any key to exit...
pause > nul