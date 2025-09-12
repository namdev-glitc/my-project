#!/usr/bin/env python3
"""
Script để chạy FastAPI server
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Khởi động Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm")
    print("📱 API Documentation: http://localhost:8000/docs")
    print("🌐 Web Interface: http://localhost:8000")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )



