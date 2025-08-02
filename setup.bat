@echo off
setlocal enabledelayedexpansion

REM AM Translations Helper - Project Setup Script (Windows)
REM This script ensures the project is properly initialized regardless of sync method

echo 🚀 AM Translations Helper - Project Setup
echo ==========================================

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo [INFO] Visit: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js found: %NODE_VERSION%

REM Check if npm is installed
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm found: %NPM_VERSION%

echo.

REM Clean existing installation if needed
echo [INFO] Cleaning existing installation...
if exist "node_modules" (
    echo [INFO] Removing existing node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo [INFO] Removing existing package-lock.json...
    del package-lock.json
)
if exist ".next" (
    echo [INFO] Removing existing .next build directory...
    rmdir /s /q .next
)
echo [SUCCESS] Cleanup completed

REM Install dependencies
echo [INFO] Installing project dependencies...
npm install --verbose
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully

echo.

REM Verify TypeScript configuration
echo [INFO] Verifying TypeScript configuration...
npm run type-check
if %errorlevel% neq 0 (
    echo [WARNING] TypeScript errors found - attempting to fix...
    REM Note: Windows doesn't have sed, so manual fixes may be needed
    echo [INFO] Please check src/app/layout.tsx for font import issues
)

REM Build the project
echo [INFO] Building the project...
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Project built successfully

echo.

echo [SUCCESS] 🎉 Project setup completed successfully!
echo.
echo [INFO] You can now run the following commands:
echo   npm run dev    - Start development server
echo   npm run build  - Build for production
echo   npm run start  - Start production server
echo   npm run lint   - Run linting
echo.

REM Ask if user wants to start dev server
set /p START_DEV="Would you like to start the development server now? (y/n): "
if /i "%START_DEV%"=="y" (
    echo [INFO] Starting development server...
    echo [INFO] The application will be available at: http://localhost:3000
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    npm run dev
) else (
    echo [INFO] Setup complete! Run 'npm run dev' when ready to start development.
)

pause 