@echo off
cd /d "%~dp0\.."
npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo Build failed with error code %ERRORLEVEL%
)
echo.
pause
