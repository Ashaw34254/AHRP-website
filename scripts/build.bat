@echo off
title AHRP Website Build
cd /d "%~dp0\.."

echo ========================================
echo   AHRP Website Build
echo ========================================
echo.

if not exist "node_modules\" goto :install
echo [1/3] Dependencies already installed, skipping...
goto :prisma

:install
echo [1/3] Installing dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 goto :fail

:prisma
echo [2/3] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% neq 0 goto :fail
echo.

echo [3/3] Building Next.js app...
call npm run build
if %ERRORLEVEL% neq 0 goto :fail

echo.
echo ========================================
echo   BUILD SUCCESSFUL
echo ========================================
echo.
pause
exit /b 0

:fail
echo.
echo ========================================
echo   BUILD FAILED
echo ========================================
echo.
pause
exit /b 1
