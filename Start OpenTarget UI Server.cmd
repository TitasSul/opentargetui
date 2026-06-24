@echo off
setlocal

cd /d "%~dp0"

if "%OPENTARGETUI_PORT%"=="" set "OPENTARGETUI_PORT=4747"

echo OpenTarget UI local server
echo URL: http://localhost:%OPENTARGETUI_PORT%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20+ is required.
  echo Install Node.js from https://nodejs.org, then double-click this file again.
  echo.
  pause
  exit /b 1
)

where pnpm >nul 2>nul
if errorlevel 1 (
  where corepack >nul 2>nul
  if errorlevel 1 (
    echo pnpm is required, and Corepack is not available.
    echo Install Node.js 20+ from https://nodejs.org, then double-click this file again.
    echo.
    pause
    exit /b 1
  )
  echo Enabling pnpm...
  call corepack enable >nul 2>nul
  call corepack prepare pnpm@10.25.0 --activate
)

where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm is required, and Corepack could not enable it.
  echo Run: corepack enable
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call pnpm install --frozen-lockfile
  if errorlevel 1 goto fail
)

echo Building server...
call pnpm --filter @opentargetui/core build
if errorlevel 1 goto fail
call pnpm --filter @opentargetui/mcp-server build
if errorlevel 1 goto fail

echo.
echo Server is starting. Keep this window open while using extension sync.
echo Press Control-C to stop.
echo.
call pnpm --filter @opentargetui/mcp-server start
if errorlevel 1 goto fail

exit /b 0

:fail
echo.
echo Server launcher failed.
pause
exit /b 1
