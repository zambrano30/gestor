@echo off
REM PanaderiaPro - Quick Setup Script for Windows
REM This script helps you set up everything quickly

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║            PanaderiaPro - Setup Rápido                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo   Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detectado

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no está instalado
    pause
    exit /b 1
)

echo ✓ npm detectado
echo.

REM Menu
echo Selecciona una opción:
echo.
echo 1. Instalar dependencias (npm install)
echo 2. Iniciar servidor de desarrollo (npm run dev)
echo 3. Compilar para producción (npm run build)
echo 4. Ver instrucciones de importación SQL
echo 5. Abrir Supabase en el navegador
echo 6. Mostrar estructura del proyecto
echo 0. Salir
echo.

set /p choice="Elige una opción (0-6): "

if "%choice%"=="1" (
    echo.
    echo 📦 Instalando dependencias...
    call npm install
    echo ✓ Dependencias instaladas
    pause
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Iniciando servidor de desarrollo...
    echo    Abre: http://localhost:5175/
    echo.
    call npm run dev
) else if "%choice%"=="3" (
    echo.
    echo 🏗️  Compilando para producción...
    call npm run build
    echo ✓ Build completado
    pause
) else if "%choice%"=="4" (
    echo.
    echo 📝 INSTRUCCIONES DE IMPORTACIÓN SQL
    echo ════════════════════════════════════
    echo.
    echo Opción A - Importación Manual (Recomendado)
    echo ─────────────────────────────────────────
    echo 1. Ve a: https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new
    echo 2. Abre: database.sql en tu editor
    echo 3. Copia TODO el contenido
    echo 4. Pégalo en Supabase SQL Editor
    echo 5. Haz clic en RUN
    echo 6. Espera a que termine
    echo 7. Abre http://localhost:5175/
    echo.
    echo Opción B - Usando npm (Automático)
    echo ───────────────────────────────────
    echo 1. npm run copy-sql
    echo 2. El SQL se copiará al portapapeles
    echo 3. Ve a Supabase y pega
    echo.
    echo Opción C - Desde la App
    echo ──────────────────────
    echo 1. npm run dev
    echo 2. Verás un panel de importación
    echo 3. Haz clic en "Importar Ahora"
    echo.
    pause
) else if "%choice%"=="5" (
    echo.
    echo 🌐 Abriendo Supabase...
    start https://app.supabase.com/project/xycaglwqgohvtwpcskzf
) else if "%choice%"=="6" (
    echo.
    echo 📁 Estructura del Proyecto
    echo ════════════════════════════
    echo.
    tree /F
    echo.
    pause
) else (
    echo Saliendo...
    exit /b 0
)

goto menu
