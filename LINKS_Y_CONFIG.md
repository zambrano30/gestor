# 🔗 Links y Configuración Rápida

## 🌐 URLs

### Desarrollo Local
- **Aplicación:** http://localhost:5175/
- **Vite HMR:** http://localhost:5175/ (auto-refresh)

### Supabase
- **Dashboard:** https://supabase.com/
- **Tu Proyecto:** https://app.supabase.com/project/xycaglwqgohvtwpcskzf
- **SQL Editor:** https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new
- **Auth:** https://app.supabase.com/project/xycaglwqgohvtwpcskzf/auth/users

---

## 🔐 Credenciales

### Supabase
```
URL: https://xycaglwqgohvtwpcskzf.supabase.co
Anon Key: sb_publishable_APiaqq1oHVD6RG1OyI1mTg_1bGDE9GU
```

Archivo: `.env.local` ✅ (ya configurado)

---

## 📂 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `.env.local` | Variables de entorno de Supabase |
| `database.sql` | Esquema SQL (⚠️ importar a Supabase) |
| `src/lib/supabase.js` | Cliente Supabase |
| `src/lib/database.js` | Funciones de BD (14 helpers) |
| `src/pages/Sales.jsx` | Componente principal (Supabase) |
| `src/pages/Login.jsx` | Login (tema oscuro) |
| `tailwind.config.js` | Configuración de Tailwind |
| `vite.config.js` | Configuración de Vite |

---

## ⚡ Comandos Rápidos

```bash
# Iniciar desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Limpiar node_modules y reinstalar
rm -Recurse node_modules; npm install

# Matar todos los procesos de node
Get-Process -Name node | Stop-Process
```

---

## 🚀 Proceso de Importación SQL

### Opción 1: Interfaz Web (Recomendado)
1. Ve a: https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new
2. Copia todo de `database.sql`
3. Pega en el editor
4. Clic en RUN
5. ¡Listo!

### Opción 2: CLI de Supabase
```bash
# Instalar CLI (si no lo tienes)
npm install -g supabase

# Ejecutar migraciones
supabase db push
```

---

## 📋 Checklist de Configuración

### Backend
- [x] Supabase proyecto creado
- [x] Credenciales en `.env.local`
- [x] Cliente Supabase configurado (`supabase.js`)
- [ ] SQL importado en Supabase (PENDIENTE)

### Frontend
- [x] React + Vite
- [x] Tailwind CSS
- [x] Lucide Icons
- [x] Sales.jsx integrado
- [x] Login.jsx con tema oscuro

### Base de Datos
- [ ] Tablas creadas (PENDIENTE)
- [ ] Datos de ejemplo cargados (PENDIENTE)
- [ ] Índices creados (PENDIENTE)
- [ ] Vistas creadas (PENDIENTE)

### Aplicación
- [x] Dev server configurado
- [x] Build funciona
- [x] Sin errores de compilación

---

## 🐛 Debug

### Ver logs de Supabase
```javascript
// En la consola del navegador (F12)
import { supabase } from './lib/supabase.js'
console.log(supabase)
```

### Verificar variables de entorno
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### Ver estado de la aplicación
- Abre DevTools (F12)
- Tab: Console (para errores)
- Tab: Network (para requests a Supabase)
- Tab: Application → Local Storage (para tokens)

---

## 📊 Tabla de Funciones de BD

| Función | Tabla | Acción |
|---------|-------|--------|
| `fetchCustomers()` | customers | SELECT |
| `addCustomer()` | customers | INSERT |
| `fetchProducts()` | products | SELECT |
| `updateProductStock()` | products | UPDATE |
| `createSale()` | sales + details | INSERT |
| `fetchSales()` | sales | SELECT |
| `fetchLatestSales()` | sales | SELECT (últimas 50) |
| `updateSaleStatus()` | sales | UPDATE |
| `fetchCategories()` | categories | SELECT |
| `addStockMovement()` | stock_movements | INSERT |
| `fetchSuppliers()` | suppliers | SELECT |
| `addSupplier()` | suppliers | INSERT |
| `createPurchase()` | purchases + details | INSERT |
| `fetchPurchases()` | purchases | SELECT |

---

## 🎯 Próximo Paso

**⚠️ IMPORTANTE: Importar SQL en Supabase**

1. Abre: https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new
2. Copia: `database.sql`
3. Ejecuta en Supabase
4. ¡Listo!

Después:
```bash
npm run dev
# Abre http://localhost:5175
# ¡A usar!
```

---

## 💡 Tips

- Si el puerto 5175 está en uso, Vite automáticamente usa otro
- Los datos se guardan en Supabase, no localmente
- Cada venta crea un registro en `sales` y `sales_details`
- El balance se calcula sumando todas las ventas
- La app es completamente responsiva

---

## 🆘 Ayuda Rápida

### "Port is in use"
```powershell
Get-Process -Name node | Stop-Process -Force
npm run dev
```

### "Cannot find module"
```bash
npm install
npm run dev
```

### "Supabase connection error"
- Verifica `.env.local`
- Revisa las credenciales en Supabase
- Abre DevTools (F12) → Console

### "No data appearing"
- ¿Importaste el SQL?
- ¿Creaste ventas en la app?
- ¿Verifica la tabla `sales` en Supabase

---

**¿Necesitas ayuda? Revisa los archivos:**
- `README_SETUP.md` - Guía completa
- `IMPORTAR_SQL.md` - Pasos detallados
- `database.sql` - Esquema de BD

---

Última actualización: 31 de Enero de 2026
