@echo off
echo ===================================================
echo   Starting AI Trading Coach Application Stack...
echo ===================================================

echo.
echo [1/4] Starting Redis via Docker...
docker-compose up -d

echo.
echo [2/4] Starting Python AI Engine (Port 8000)...
start "AI Engine (Python)" cmd /k "cd stock_trading_ai_engine && uv run uvicorn app.main:app --reload
"

echo.
echo [3/4] Starting Java Backend (Port 8080)...
start "Backend Gateway (Java)" cmd /k "cd Ai_Trading_Coach_backend && mvnw spring-boot:run"

echo.
echo [4/4] Starting React Frontend (Port 5173)...
start "React UI (Frontend)" cmd /k "cd Ai_Trading_UI\ai-trading-ui && npm run dev"

echo.
echo ===================================================
echo All services have been launched in separate windows!
echo It may take about 30 seconds for Java to fully boot.
echo ===================================================
pause
