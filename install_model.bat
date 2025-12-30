@echo off
echo ========================================
echo   Installing Ollama AI Model
echo ========================================
echo.
echo Available models:
echo   - llama2 (7B parameters, general purpose)
echo   - mistral (7B parameters, fast and efficient)
echo   - llama2:13b (13B parameters, more accurate)
echo   - codellama (code-focused)
echo.

set /p MODEL_NAME="Enter model name (default: llama2): "

if "%MODEL_NAME%"=="" set MODEL_NAME=llama2

echo.
echo Pulling model: %MODEL_NAME%
echo This may take several minutes depending on your internet speed...
echo.

docker exec -it legal-ai-ollama ollama pull %MODEL_NAME%

echo.
echo ========================================
echo Model %MODEL_NAME% installed successfully!
echo ========================================
echo.
pause
