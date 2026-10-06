@echo off
setlocal enabledelayedexpansion
title Ragada Tobacco Supply Chain OS - Launcher

echo ========================================================
echo   RAGADA TOBACCO SUPPLY CHAIN OS
echo   Enterprise Multi-Echelon Cigarette Logistics System
echo ========================================================
echo.

:: Pindah ke direktori tempat skrip ini berada
cd /d "%~dp0"

:: 1. Periksa apakah server backend sudah berjalan di port 8002
netstat -ano | findstr :8002 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [OK] Server backend sudah aktif di port 8002.
) else (
    echo [..] Menjalankan server backend di latar belakang...
    cd backend
    start /min "Ragada SupplyChain Backend" python run_backend.py
    cd ..
    
    :: Tunggu hingga port 8002 siap (maksimal 10 detik)
    echo [..] Menunggu inisialisasi database dan server...
    set /a count=0
    :wait_loop
    ping 127.0.0.1 -n 2 >nul
    netstat -ano | findstr :8002 | findstr LISTENING >nul
    if %errorlevel% equ 0 goto server_ready
    set /a count+=1
    if !count! lss 10 goto wait_loop

    :server_ready
    echo [OK] Server backend siap dan terverifikasi.
)

:: 2. Buka Aplikasi di Browser Kiosk / App Mode
echo [..] Membuka Dashboard Ragada Supply Chain...

set APP_URL=http://localhost:8002

:: Coba jalankan Google Chrome dalam App Mode (Jendela Mandiri Tanpa Baris URL)
where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start "" chrome --app=%APP_URL%
    goto finish
)

:: Coba jalankan Microsoft Edge dalam App Mode
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start "" msedge --app=%APP_URL%
    goto finish
)

:: Jika tidak ada Chrome/Edge, buka di browser default Windows
start %APP_URL%

:finish
echo [SUKSES] Aplikasi berhasil dibuka.
ping 127.0.0.1 -n 2 >nul
exit
