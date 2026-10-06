@echo off
setlocal
title Installer Shortcut Desktop - Ragada Tobacco Supply Chain OS

echo ===================================================================
echo     INSTALLER DESKTOP SHORTCUT - RAGADA TOBACCO SUPPLY CHAIN OS
echo ===================================================================
echo.
echo Sedang mendaftarkan aplikasi ke Desktop Windows Anda...

set "CURRENT_DIR=%~dp0"
if "%CURRENT_DIR:~-1%"=="\" set "CURRENT_DIR=%CURRENT_DIR:~0,-1%"

set "TARGET_BAT=%CURRENT_DIR%\START_SISTEM.bat"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "SHORTCUT_PATH=%DESKTOP_DIR%\Ragada Supply Chain OS.lnk"

:: 1. Buat Shortcut Desktop Menggunakan PowerShell WScript.Shell
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell; " ^
    "$s = $ws.CreateShortcut('%SHORTCUT_PATH%'); " ^
    "$s.TargetPath = '%TARGET_BAT%'; " ^
    "$s.WorkingDirectory = '%CURRENT_DIR%'; " ^
    "$s.Description = 'Ragada Tobacco SupplyChain OS - Sistem Inventori & Logistik Rokok'; " ^
    "$s.Save()"

if %errorlevel% equ 0 (
    echo.
    echo [SUKSES] Ikon shortcut berhasil dibuat di Desktop:
    echo "%SHORTCUT_PATH%"
    echo.
    echo Sekarang Anda atau pembeli cukup melakukan DOBEL-KLIK ikon tersebut
    echo di Desktop untuk langsung membuka sistem.
    echo.
) else (
    echo [GAGAL] Terjadi kendala saat membuat shortcut.
)

:: 2. Selesai
echo Tekan tombol apa saja untuk menutup jendela ini...
pause >nul
exit
