@echo off
echo Starting Backend and Frontend...
echo.

REM Start backend in new window
start "Backend Server" cmd /k "cd backend && yarn start:dev"

REM Wait 3 seconds before starting frontend
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Frontend Server" cmd /k "cd frontend && ng serve -o"

echo.
echo Backend and Frontend servers are starting...
echo Check the new windows for server status.
