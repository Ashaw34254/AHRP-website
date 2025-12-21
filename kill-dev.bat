@echo off
echo ========================================
echo  Stopping all Node.js processes...
echo ========================================
echo.

taskkill /F /IM node.exe 2>nul

if %errorlevel% == 0 (
    echo   [SUCCESS] All Node.js processes terminated
) else (
    echo   [INFO] No Node.js processes found
)

echo.
pause
