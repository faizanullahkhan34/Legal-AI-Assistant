@echo off
echo ========================================
echo   Legal-AI Service Status
echo ========================================
echo.

docker-compose ps

echo.
echo ========================================
echo   Container Resource Usage
echo ========================================
echo.

docker stats --no-stream legal-ai-frontend legal-ai-backend legal-ai-redis legal-ai-ollama

echo.
pause
