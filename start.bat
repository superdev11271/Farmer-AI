@echo off
echo Starting Invoice Automation System...
echo.

echo Starting Flask Backend...
cd backend
start "Flask Backend" cmd /k "python app.py"
cd ..

echo.
echo Starting React Frontend with Vite...
cd frontend
start "React Frontend" cmd /k "npm run dev"
cd ..

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause > nul 