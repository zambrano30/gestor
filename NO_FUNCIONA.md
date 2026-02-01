# ❌ NO FUNCIONA - SOLUCIÓN RÁPIDA

## El problema
No puedes agregar una venta porque **la base de datos no está importada**.

## La solución (3 pasos)

### 1. Abre la app
```powershell
npm run dev
# Abre: http://localhost:5175/
```

### 2. Verás un panel AZUL
Haz clic en uno de estos botones:

- 🟢 **"Copiar SQL al Portapapeles"** → Copia todo
- 🔵 **"Abrir Supabase"** → Se abrirá Supabase

### 3. En Supabase
1. Pega el SQL (Ctrl + V)
2. Haz clic en **RUN**
3. Espera 30 segundos

### 4. Vuelve a la app
Presiona F5 (recarga)

## ✅ Ahora ya puedes agregar ventas

---

## Si NO ves el panel azul
1. Abre DevTools: **F12**
2. Ve a **Console**
3. Busca el error ROJO
4. Probablemente dice: `"relation 'customers' does not exist"`

→ Importa el SQL de todas formas:
https://app.supabase.com/project/xycaglwqgohvtwpcskzf/sql/new

---

**Eso es todo. 3 pasos.**
