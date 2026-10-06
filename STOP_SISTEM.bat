@echo off
title Ragada Tobacco Supply Chain OS - Shutdown
echo ========================================================
echo   Menghentikan Server Ragada Tobacco Supply Chain
echo ========================================================
echo.

:: Cari PID proses yang mendengarkan di port 8002
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8002 ^| findstr LISTENING') do (
    echo Menghentikan proses PID: %%a ...
    taskkill /F /PID %%a >nul 2>nul
)

echo [OK] Seluruh layanan backend berhasil dihentikan.
timeout /t 2 >nul
exit
