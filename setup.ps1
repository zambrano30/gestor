# PanaderiaPro - Setup PowerShell Script
# Usage: .\setup.ps1

param(
    [string]$action = "menu"
)

function Show-Banner {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║            PanaderioPro - Setup Rápido                     ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Menu {
    Write-Host "Selecciona una opción:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. Instalar dependencias (npm install)" -ForegroundColor White
    Write-Host "  2. Iniciar servidor (npm run dev)" -ForegroundColor White
    Write-Host "  3. Compilar para producción (npm run build)" -ForegroundColor White
    Write-Host "  4. Ver instrucciones SQL" -ForegroundColor White
    Write-Host "  5. Abrir Supabase" -ForegroundColor White
    Write-Host "  6. Ver estructura del proyecto" -ForegroundColor White
    Write-Host "  7. Verificar base de datos" -ForegroundColor White
    Write-Host "  0. Salir" -ForegroundColor White
    Write-Host ""
}

function Install-Dependencies {
    Write-Host ""
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
    Write-Host ""
    npm install
    Write-Host ""
    Write-Host "✓ Dependencias instaladas" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar"
}

function Start-DevServer {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Blue
    Write-Host "   Abre: http://localhost:5175/" -ForegroundColor Cyan
    Write-Host ""
    npm run dev
}

function Build-Production {
    Write-Host ""
    Write-Host "🏗️  Compilando para producción..." -ForegroundColor Blue
    Write-Host ""
    npm run build
    Write-Host ""
    Write-Host "✓ Build completado" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar"
}

function Show-SqlInstructions {
    Write-Host ""
    Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "📝 INSTRUCCIONES DE IMPORTACIÓN SQL" -ForegroundColor Cyan
    Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "OPCIÓN A - Importación Manual (Recomendado)" -ForegroundColor Yellow
    Write-Host "───────────────────────────────────────────" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new" -ForegroundColor White
    Write-Host "2. Abre: database.sql en tu editor" -ForegroundColor White
    Write-Host "3. Copia TODO el contenido (Ctrl + A, Ctrl + C)" -ForegroundColor White
    Write-Host "4. Pégalo en Supabase SQL Editor (Ctrl + V)" -ForegroundColor White
    Write-Host "5. Haz clic en RUN (botón azul)" -ForegroundColor White
    Write-Host "6. Espera a que termine" -ForegroundColor White
    Write-Host "7. ¡Listo! Abre http://localhost:5175/" -ForegroundColor White
    Write-Host ""
    
    Write-Host "OPCIÓN B - Desde la Aplicación" -ForegroundColor Yellow
    Write-Host "──────────────────────────────" -ForegroundColor Yellow
    Write-Host "1. npm run dev" -ForegroundColor White
    Write-Host "2. Se abrirá un panel de importación" -ForegroundColor White
    Write-Host "3. Haz clic en 'Importar Ahora'" -ForegroundColor White
    Write-Host "4. Espera a que termine" -ForegroundColor White
    Write-Host "5. ¡Listo!" -ForegroundColor White
    Write-Host ""
    
    Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Read-Host "Presiona Enter para continuar"
}

function Open-Supabase {
    Write-Host ""
    Write-Host "🌐 Abriendo Supabase..." -ForegroundColor Blue
    Start-Process "https://app.supabase.com/project/xycaglwqgohvtwpcskzf"
    Start-Sleep -Milliseconds 2000
}

function Show-Structure {
    Write-Host ""
    Write-Host "📁 Estructura del Proyecto" -ForegroundColor Cyan
    Write-Host ""
    
    $structure = @"
d:\Freelance\Gestor_de_ventas\
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Sales.jsx
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── database.js
│   │   └── test-db.js
│   ├── components/
│   │   └── AdminPanel.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── scripts/
│   ├── migrate.js
│   └── copy-sql.js
├── .env.local (✓ Configurado)
├── database.sql (✓ Listo para importar)
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README*.md (Documentación)
"@
    
    Write-Host $structure -ForegroundColor White
    Read-Host "Presiona Enter para continuar"
}

function Test-Database {
    Write-Host ""
    Write-Host "🧪 Verificando Base de Datos..." -ForegroundColor Blue
    Write-Host ""
    
    $envPath = ".env.local"
    
    if (-not (Test-Path $envPath)) {
        Write-Host "❌ .env.local no encontrado" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        return
    }
    
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "VITE_SUPABASE_URL=(.+)") {
        $url = $matches[1].Trim()
        Write-Host "✓ Supabase URL configurada" -ForegroundColor Green
        Write-Host "  $($url.Substring(0,40))..." -ForegroundColor Cyan
    } else {
        Write-Host "❌ URL no configurada" -ForegroundColor Red
    }
    
    if ($envContent -match "VITE_SUPABASE_ANON_KEY=(.+)") {
        Write-Host "✓ Anon Key configurada" -ForegroundColor Green
    } else {
        Write-Host "❌ Anon Key no configurada" -ForegroundColor Red
    }
    
    if (Test-Path "database.sql") {
        $size = (Get-Item "database.sql").Length
        Write-Host "✓ database.sql existe ($([math]::Round($size/1024, 2)) KB)" -ForegroundColor Green
    } else {
        Write-Host "❌ database.sql no encontrado" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "Presiona Enter para continuar"
}

# Main loop
do {
    Show-Banner
    Show-Menu
    
    $choice = Read-Host "Elige una opción"
    
    switch ($choice) {
        "1" { Install-Dependencies }
        "2" { Start-DevServer }
        "3" { Build-Production }
        "4" { Show-SqlInstructions }
        "5" { Open-Supabase }
        "6" { Show-Structure }
        "7" { Test-Database }
        "0" { 
            Write-Host ""
            Write-Host "¡Hasta luego!" -ForegroundColor Green
            exit
        }
        default {
            Write-Host ""
            Write-Host "❌ Opción no válida" -ForegroundColor Red
        }
    }
    
    Write-Host ""
} while ($true)
