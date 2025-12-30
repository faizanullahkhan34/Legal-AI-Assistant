@echo off
echo ========================================
echo   Legal-AI Docker Deployment
echo ========================================
echo.
echo Starting all services (Frontend, Backend, Redis, Ollama)...
echo.

REM Start all services in detached mode
docker-compose up --build -d

echo.
echo Waiting for services to become healthy...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   Checking Service Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo   Setting up Ollama AI Models
echo ========================================
echo.
echo Checking if Ollama models are installed...
echo This may take a few minutes on first run...
echo.

REM Wait for Ollama to be fully ready
timeout /t 5 /nobreak >nul

REM Pull the AI model (change 'llama2' to your preferred model)
echo Pulling AI model (llama2)...
docker exec -it legal-ai-ollama ollama pull llama2

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your Legal-AI Assistant is now running:
echo.
echo   Frontend:     http://localhost:5173
echo   Backend API:  http://localhost:8000/docs
echo   Health Check: http://localhost:8000/health
echo.
echo To view logs:      docker-compose logs -f
echo To stop services:  docker-compose down
echo.
echo ========================================
pause
