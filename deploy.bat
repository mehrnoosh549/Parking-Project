@echo off
REM Smart Parking System - Windows Deployment Script
REM This script will set up and run the parking system on Windows

title Smart Parking System - Local Deployment

echo.
echo 🚗 Smart Parking System - Local Deployment
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ index.html not found. Please run this script from the project directory.
    pause
    exit /b 1
)

echo ✅ Found project files

REM Check for Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=python
    echo ✅ Python found
) else (
    python3 --version >nul 2>&1
    if %errorlevel% == 0 (
        set PYTHON_CMD=python3
        echo ✅ Python 3 found
    ) else (
        set PYTHON_CMD=
        echo ⚠️ Python not found
    )
)

REM Check for Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    npm --version >nul 2>&1
    if %errorlevel% == 0 (
        set NODE_AVAILABLE=true
        echo ✅ Node.js and npm found
    ) else (
        set NODE_AVAILABLE=false
        echo ⚠️ npm not found
    )
) else (
    set NODE_AVAILABLE=false
    echo ⚠️ Node.js not found
)

echo.
echo Choose deployment method:
echo 1) Python HTTP Server (Simple, recommended)
echo 2) Node.js Development Server (Advanced features)
echo 3) Just open in browser (No server)
echo 4) Auto-detect best option
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto python_server
if "%choice%"=="2" goto node_server
if "%choice%"=="3" goto browser_only
if "%choice%"=="4" goto auto_detect

echo ❌ Invalid choice. Please run the script again.
pause
exit /b 1

:python_server
if "%PYTHON_CMD%"=="" (
    echo ❌ Python not available. Try option 2 or 3.
    pause
    exit /b 1
)
echo.
echo ℹ️ Starting Python HTTP server on port 8000...
echo.
echo 🌐 Your parking system will be available at:
echo    http://localhost:8000
echo.
echo ℹ️ Press Ctrl+C to stop the server
echo ==========================================
echo.
start http://localhost:8000
%PYTHON_CMD% -m http.server 8000
goto end

:node_server
if "%NODE_AVAILABLE%"=="false" (
    echo ❌ Node.js not available. Try option 1 or 3.
    pause
    exit /b 1
)
echo.
echo ℹ️ Installing Node.js dependencies...
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.
echo ℹ️ Starting Node.js development server...
echo.
echo 🌐 Your parking system will be available at:
echo    http://localhost:3000
echo.
echo ℹ️ Press Ctrl+C to stop the server
echo ==========================================
echo.
call npm start
goto end

:browser_only
echo.
echo ℹ️ Opening index.html directly in browser...
start index.html
echo ✅ Opened in browser
echo ⚠️ Note: Some features may not work without a server
echo.
pause
goto end

:auto_detect
echo.
echo ℹ️ Auto-detecting best deployment method...
if "%NODE_AVAILABLE%"=="true" (
    echo ℹ️ Using Node.js (best option available)
    goto node_server
) else if not "%PYTHON_CMD%"=="" (
    echo ℹ️ Using Python HTTP server
    goto python_server
) else (
    echo ℹ️ Opening directly in browser
    start index.html
    echo ⚠️ Consider installing Python or Node.js for better experience
    pause
)

:end
echo.
echo Thank you for using Smart Parking System!
pause