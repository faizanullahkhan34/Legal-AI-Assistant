@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Legal-AI Complete Deployment Script
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Check available ports
echo Checking if required ports are available...
netstat -ano | findstr ":5173" >nul
if not errorlevel 1 (
    echo [WARNING] Port 5173 is already in use!
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "!CONTINUE!"=="y" exit /b 1
)

netstat -ano | findstr ":8000" >nul
if not errorlevel 1 (
    echo [WARNING] Port 8000 is already in use!
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "!CONTINUE!"=="y" exit /b 1
)

echo [OK] Ports are available
echo.

REM Ask deployment type
echo Select deployment type:
echo   1. Development (default)
echo   2. Production
echo.
set /p DEPLOY_TYPE="Enter choice (1 or 2): "

if "%DEPLOY_TYPE%"=="2" (
    set COMPOSE_FILE=docker-compose.prod.yml
    echo.
    echo [INFO] Using production configuration
    echo.
    if not exist .env.production (
        echo [WARNING] .env.production not found!
        echo Creating from template...
        copy .env.template .env.production
        echo.
        echo [ACTION REQUIRED] Please edit .env.production with your settings
        echo Press any key when ready...
        pause >nul
    )
) else (
    set COMPOSE_FILE=docker-compose.yml
    echo.
    echo [INFO] Using development configuration
    echo.
)

REM Stop existing containers
echo Stopping existing containers (if any)...
docker-compose -f %COMPOSE_FILE% down >nul 2>&1
echo.

REM Start deployment
echo ========================================
echo   Building and Starting Services
echo ========================================
echo.
echo This may take several minutes on first run...
echo.

docker-compose -f %COMPOSE_FILE% up --build -d

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start services!
    echo Check the logs with: docker-compose logs
    pause
    exit /b 1
)

echo.
echo [OK] Services started successfully
echo.

REM Wait for services to be healthy
echo Waiting for services to become healthy...
echo This may take up to 2 minutes...
echo.

set /a COUNTER=0
set /a MAX_WAIT=120

:wait_loop
docker-compose -f %COMPOSE_FILE% ps | findstr "healthy" >nul
if not errorlevel 1 (
    set /a COUNTER+=5
    if !COUNTER! geq %MAX_WAIT% (
        echo.
        echo [WARNING] Services taking longer than expected
        echo Continuing anyway...
        goto setup_ollama
    )
    timeout /t 5 /nobreak >nul
    echo Waiting... (!COUNTER!s / %MAX_WAIT%s^)
    goto wait_loop
)

:setup_ollama
echo.
echo ========================================
echo   Setting up Ollama AI Models
echo ========================================
echo.

REM Check if Ollama container is running
docker ps | findstr "legal-ai-ollama" >nul
if errorlevel 1 (
    echo [ERROR] Ollama container is not running!
    echo Check logs with: docker-compose logs ollama
    goto finish
)

echo Available AI models:
echo   1. llama2 (7B - Recommended for general use)
echo   2. mistral (7B - Fast and efficient)
echo   3. llama2:13b (13B - More accurate, requires more RAM)
echo   4. Skip model installation
echo.

set /p MODEL_CHOICE="Select model to install (1-4): "

if "%MODEL_CHOICE%"=="1" set MODEL_NAME=llama2
if "%MODEL_CHOICE%"=="2" set MODEL_NAME=mistral
if "%MODEL_CHOICE%"=="3" set MODEL_NAME=llama2:13b
if "%MODEL_CHOICE%"=="4" goto finish

if not defined MODEL_NAME set MODEL_NAME=llama2

echo.
echo Installing model: %MODEL_NAME%
echo This will download 4-7GB of data. Please be patient...
echo.

docker exec -it legal-ai-ollama ollama pull %MODEL_NAME%

if errorlevel 1 (
    echo.
    echo [WARNING] Failed to install model
    echo You can install it later using: install_model.bat
) else (
    echo.
    echo [OK] Model installed successfully!
)

:finish
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
echo   Ollama API:   http://localhost:11434
echo.
echo Useful commands:
echo   View logs:        view_logs.bat
echo   Check status:     check_status.bat
echo   Install model:    install_model.bat
echo   Stop services:    stop_app.bat
echo.
echo ========================================

REM Open browser
set /p OPEN_BROWSER="Open application in browser? (y/n): "
if /i "%OPEN_BROWSER%"=="y" (
    start http://localhost:5173
)

echo.
pause
