# 🚀 INICIAR AQUÍ - Guía Rápida

## Lo Único Que Necesitas Saber

### 1️⃣ IMPORTAR LA BASE DE DATOS (5 minutos)

**Opción A - Lo más fácil (Recomendado):**

```powershell
# Abre PowerShell en la carpeta del proyecto y escribe:
.\setup.ps1

# Selecciona opción 4 "Ver instrucciones SQL"
# Sigue los pasos exactos
```

**Opción B - Manual directo:**

1. Abre este link: https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new
2. Abre el archivo `database.sql` en tu editor
3. Selecciona TODO el contenido (Ctrl + A)
4. Cópialo (Ctrl + C)
5. En Supabase, pega en el editor (Ctrl + V)
6. Haz clic en el botón azul "RUN" en la esquina inferior derecha
7. Espera 30 segundos a que termine

✅ **¡Listo! Ahora tienes la base de datos creada**

---

### 2️⃣ INICIAR LA APLICACIÓN

```powershell
npm run dev
```

Luego abre: http://localhost:5175

---

### 3️⃣ PRUEBA QUE FUNCIONA

- Verás el dashboard
- Haz clic en "Nueva Venta"
- Selecciona un cliente (hay 5 de ejemplo)
- Selecciona un producto (hay 5 de ejemplo)
- Cambia la cantidad
- Haz clic en "Guardar Venta"
- ¡Deberías verla en el dashboard!

---

## ❓ ¿Qué Significan Estos Archivos?

| Archivo | Para qué sirve |
|---------|---------------|
| `setup.ps1` | Script para hacer todo fácil (PowerShell) |
| `database.sql` | La base de datos (IMPORTAR en Supabase) |
| `src/pages/Sales.jsx` | La app principal |
| `.env.local` | Las credenciales (ya están) |

---

## 🎯 ÚNICOS PASOS NECESARIOS

1. **Importar SQL** (5 min) - Click derecho en Supabase
2. **npm run dev** (5 seg) - Iniciar la app
3. **Usar la app** (∞ tiempo) - ¡Disfruta!

---

## 🚨 PROBLEMAS COMUNES

### "Tabla no encontrada" o "Relation does not exist"
→ No importaste el SQL aún. Vuelve al paso 1.

### "Port 5175 already in use"
→ 
```powershell
Get-Process -Name node | Stop-Process -Force
npm run dev
```

### "Cannot find module"
→ 
```powershell
npm install
npm run dev
```

### No aparecen los datos
→ Abre DevTools (F12) → Console y verifica si hay errores rojos

---

## ✨ LA APLICACIÓN INCLUYE

✅ Dashboard con balance en tiempo real  
✅ Formulario para crear ventas  
✅ Historial de ventas  
✅ Interfaz oscura profesional  
✅ 100% responsive (móvil/desktop)  
✅ Datos precargados (5 clientes, 5 productos)  
✅ Base de datos en Supabase  

---

## 📞 RESUMEN EN UNA LÍNEA

**Importa el SQL en Supabase, ejecuta `npm run dev`, ¡y listo!**

---

Eso es todo. Nada complicado. Solo esos pasos.
