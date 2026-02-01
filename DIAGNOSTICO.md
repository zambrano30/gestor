# 🔍 DIAGNÓSTICO - ¿Por qué no se puede agregar una venta?

## ✅ Checklist de Verificación

### 1. ¿La app está corriendo?
```powershell
npm run dev
# Debe mostrar: ✓ Local: http://localhost:5175/
```

### 2. ¿Las tablas están creadas?
Abre DevTools (F12) → Console y pega:
```javascript
// Verifica si la BD está conectada
fetch('https://xycaglwqgohvtwpcskzf.supabase.co/rest/v1/customers?limit=1', {
  headers: {
    'Authorization': 'Bearer sb_publishable_APiaqq1oHVD6RG1OyI1mTg_1bGDE9GU',
    'apikey': 'sb_publishable_APiaqq1oHVD6RG1OyI1mTg_1bGDE9GU'
  }
}).then(r => r.json()).then(console.log)
```

Si ves `"code":"404"` → **Las tablas NO existen**
Si ves `"data":[...]` → **Las tablas SÍ existen** ✅

### 3. Problemas Posibles

| Problema | Causa | Solución |
|----------|-------|---------|
| Panel de importación no aparece | BD no se verificó | Abre DevTools (F12) → Console y busca errores |
| "Tabla no encontrada" | SQL no importado | Importa database.sql en Supabase |
| "No puedo seleccionar cliente/producto" | Datos vacíos | Los datos de ejemplo no cargaron |
| El botón "Guardar Venta" no hace nada | Error silencioso | Abre DevTools (F12) → Console |

---

## 🚀 SOLUCIÓN PASO A PASO

### Paso 1: Verifica que tienes DevTools abierto
1. Presiona **F12**
2. Ve a la pestaña **Console**
3. Limpia cualquier error anterior (Ctrl + L)

### Paso 2: Abre DevTools y mira los errores
```
Deberías ver algo como:
✅ "Verificando base de datos..."
❌ O algún error rojo
```

**Si ves error:**
```
"relation "customers" does not exist"
"no existe la tabla customers"
"404 Not Found"
```

→ **SOLUCIÓN**: Importa el SQL (ver paso 3)

### Paso 3: Importa el SQL en Supabase (3 minutos)

**Opción A: Desde la App (Fácil)**
1. La app debería mostrar un panel azul diciendo "Importar Base de Datos"
2. Haz clic en "Copiar SQL al Portapapeles"
3. Haz clic en "Abrir Supabase"
4. Se abrirá Supabase en una nueva pestaña
5. Pega el SQL (Ctrl + V)
6. Haz clic en "RUN"
7. Vuelve a esta pestaña
8. Recarga (F5)

**Opción B: Manual**
1. Ve a: https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new
2. Abre `database.sql` en tu editor
3. Copia TODO (Ctrl + A, Ctrl + C)
4. Pega en Supabase (Ctrl + V)
5. Haz clic en RUN
6. Vuelve a la app
7. Recarga (F5)

### Paso 4: Verifica que funcionó
```javascript
// En DevTools Console:
fetch('https://xycaglwqgohvtwpcskzf.supabase.co/rest/v1/products?limit=1', {
  headers: {
    'Authorization': 'Bearer sb_publishable_APiaqq1oHVD6RG1OyI1mTg_1bGDE9GU',
    'apikey': 'sb_publishable_APiaqq1oHVD6RG1OyI1mTg_1bGDE9GU'
  }
}).then(r => r.json()).then(data => {
  if (data.data) console.log('✅ Tablas creadas!', data.data.length, 'productos');
  else console.log('❌ Error:', data);
})
```

Deberías ver: `✅ Tablas creadas! 5 productos`

---

## 🧪 PRUEBA COMPLETA DE LA APP

### Si las tablas existen:

1. **Abre la app**: http://localhost:5175/
2. **Verifica el dashboard**: Debe cargar sin errores
3. **Haz clic en "Nueva Venta"**
4. **Selecciona un cliente**: Debe haber 5 en la lista
5. **Selecciona un producto**: Debe haber 5 en la lista
6. **Cambia cantidad**: Usa los botones +/-
7. **El total debe actualizarse**: Automáticamente
8. **Haz clic en "Guardar Venta"**
9. **Debe volver al dashboard**: Y mostrar la venta en "Últimas Ventas"
10. **Ve a "Historial"**: Deberías ver todas las ventas

Si todo esto funciona → ✅ **ESTÁ LISTO**

---

## 🐛 DEBUGGING

### Si algo falla, abre DevTools (F12):

**Tab: Console**
- Busca errores rojos
- Copia el error exacto
- Pégalo aquí abajo

**Tab: Network**
- Recarga la página (F5)
- Busca requests a supabase.co
- Si están en rojo → error de conexión
- Si son verdes pero sin datos → tabla no existe

**Tab: Application**
- Local Storage
- Verifica que `.env.local` está siendo usado

---

## 📝 ERRORES COMUNES Y SOLUCIONES

### Error: "relation "customers" does not exist"
```
❌ Significado: Las tablas no están creadas
✅ Solución: Importa database.sql en Supabase
```

### Error: "403 Unauthorized"
```
❌ Significado: Las credenciales están mal
✅ Solución: Verifica .env.local
```

### Error: "Cannot read properties of undefined"
```
❌ Significado: Los datos no cargan
✅ Solución: Verifica que los productos existen en la BD
```

### El botón "Guardar" no hace nada
```
❌ Significado: Error silencioso en la consola
✅ Solución: Abre DevTools (F12) → Console y mira el error
```

---

## ✅ CHECKLIST FINAL

- [ ] npm run dev está corriendo
- [ ] Abro http://localhost:5175/ en el navegador
- [ ] Abro DevTools (F12)
- [ ] Veo si hay errores rojos en Console
- [ ] Si hay error de "tabla no existe" → Importo SQL
- [ ] Si está todo bien → Intento agregar una venta
- [ ] Verifico Console para errores

---

## 💬 SÍNTOMAS Y DIAGNÓSTICO

**"No aparece nada en la app"**
- Console mostrará errores
- Probablemente SQL no importado

**"Aparece el panel azul de importación"**
- Esto significa que la app detectó que no hay BD
- Haz clic en "Copiar SQL" → "Abrir Supabase" → Pega → RUN

**"Puedo ver la app pero no se carga nada"**
- Espera 5 segundos a que cargue
- Si no carga, abre Console (F12)
- Verás el error exacto

**"Puedo agregar pero dice error"**
- Abre Console (F12)
- Mira el error exacto
- Probablemente la venta se agregó pero falló al actualizar la lista

---

## 🎯 RESUMIDO

1. `npm run dev`
2. http://localhost:5175/
3. F12 (DevTools)
4. Si ves error de BD → Importa SQL
5. Si SQL está importado → Intenta agregar venta
6. Si falla → Mira error en Console

**Eso es todo.**
