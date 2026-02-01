# 🔍 VERIFICACIÓN DE SUPABASE

## Estado Actual

Tu Supabase **está configurado** en:
- **URL**: https://xycaglwqgohvtwpcskzf.supabase.co
- **Proyecto ID**: xycaglwqgohvtwpcskzf

## ✅ Cómo Verificar que Todo Funciona

### Opción 1: Botón en la Aplicación (Lo más fácil)
1. Abre la aplicación: `npm run dev`
2. En la esquina inferior derecha, hay un botón **⚙️ morado**
3. Haz clic para ver el estado completo de Supabase

### Opción 2: Consola del Navegador
1. Abre la aplicación: `npm run dev`
2. Presiona `F12` para abrir DevTools
3. Abre la pestaña "Console"
4. Deberías ver mensajes con ✅ si todo está bien

## 📋 Qué Se Verifica

El sistema automáticamente verifica:

```
✅ Cliente Supabase inicializado
✅ Variables de entorno configuradas
✅ Conexión a la base de datos
✅ Tabla: customers
✅ Tabla: products
✅ Tabla: categories
✅ Tabla: sales
✅ Tabla: suppliers
✅ RLS (Row Level Security) configurado
```

## 🔴 Si Algo Falla

### Error: "relation does not exist"
**Significa**: La tabla no existe en la base de datos

**Solución**:
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto `xycaglwqgohvtwpcskzf`
3. Abre **SQL Editor** (lado izquierdo)
4. Haz clic en **New Query**
5. Abre el archivo `/database.sql` de este proyecto
6. Copia TODO el contenido
7. Pégalo en Supabase
8. Haz clic en **RUN** (botón azul abajo)
9. Espera a que termine
10. Recarga la aplicación (Ctrl+R o Cmd+R)

### Error: "Invalid credentials"
**Significa**: Las keys de Supabase son incorrectas

**Solución**:
1. Ve a https://app.supabase.com
2. Abre tu proyecto
3. Ve a **Settings** (engranaje abajo a la izquierda)
4. En la izquierda, haz clic en **API**
5. Copia:
   - **Project URL** → Copia en `.env.local` como `VITE_SUPABASE_URL`
   - **anon public** (bajo "Project API keys") → Copia como `VITE_SUPABASE_ANON_KEY`
6. Recarga la aplicación

## 📊 Variables de Entorno

El archivo `.env.local` debe verse así:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xycaglwqgohvtwpcskzf.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_APiaqq1oHVD6RG1OyI1mTg_1bGDE9GU
```

## 🧪 Verificación Manual en Terminal

Si quieres verificar desde la terminal:

```powershell
# Entra al directorio del proyecto
cd d:\Freelance\Gestor_de_ventas

# Abre Node.js interactivo
node

# Copia esto en la consola de Node:
import { checkSupabaseConnection } from './src/lib/check-supabase.js'
await checkSupabaseConnection()
```

## 📞 Contacto con Supabase

Si necesitas ayuda:
- **Documentación**: https://supabase.com/docs
- **Status Page**: https://status.supabase.com
- **Discord Community**: https://discord.supabase.com

---

**Última actualización**: 31 de Enero, 2026

Nota: Si cambias las credenciales, **siempre recarga la aplicación completamente** con Ctrl+Shift+R (limpia cache).
