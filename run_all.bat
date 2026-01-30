@echo off
title Academy Course System
echo ===================================================
echo     KHOI DONG DU AN ACADEMY COURSE SYSTEM
echo ===================================================

echo 1. Dang khoi dong Backend (Spring Boot)...
start "Backend Server (Port 8080)" cmd /k "cd BackEndCourse && mvnw spring-boot:run"

echo 2. Dang khoi dong AI Service (Python)...
start "AI Service (Port 5001)" cmd /k "cd AICourse && pip install -r requirements.txt && python AImain.py"

echo 3. Dang khoi dong Frontend (Next.js)...
start "Frontend Web (Port 3000)" cmd /k "cd FrontendCourse && npm install --legacy-peer-deps && npm run dev"

echo ===================================================
echo DA KICH HOAT CA 3 TERMINAL!
echo - Vui long cho khoang 1-2 phut de cac dich vu khoi dong xong.
echo - Sau do truy cap: http://localhost:3000
echo ===================================================
pause
