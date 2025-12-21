@echo off
echo ========================================
echo  AHRP Website - Development Server
echo  Restart Script
echo ========================================
echo.

echo [1/4] Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo   - .next folder cleared
)

echo [3/4] Clearing node_modules cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo   - node_modules cache cleared
)

echo [4/4] Starting development server...
echo.
echo ========================================
echo  Server starting on http://localhost:3000
echo  Press Ctrl+C to stop
echo ========================================
echo.

npm run dev
