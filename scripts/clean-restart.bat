@echo off
echo ========================================
echo  Aurora Horizon RP - Full Clean Restart
echo ========================================
echo.

echo [1/5] Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Removing build artifacts...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
echo   - Build artifacts cleared

echo [3/5] Reinstalling dependencies...
call npm install --legacy-peer-deps
echo   - Dependencies installed

echo [4/5] Clearing TypeScript cache...
if exist "tsconfig.tsbuildinfo" del /f /q "tsconfig.tsbuildinfo"

echo [5/5] Starting fresh development server...
echo.
echo ========================================
echo  Server starting on http://localhost:3000
echo ========================================
echo.

npm run dev
