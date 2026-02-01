# Importar Base de Datos en Supabase

## Pasos para Importar el Esquema SQL

### 1. Acceder a Supabase
- Ve a https://supabase.com
- Inicia sesión con tu cuenta
- Selecciona tu proyecto (xycaglwqgohvtwpcskzf)

### 2. Ir al SQL Editor
- En el panel lateral izquierdo, haz clic en **SQL Editor**
- O presiona `Ctrl + K` para abrir el buscador de comandos

### 3. Crear Nueva Query
- Haz clic en el botón **New Query** (+ verde)
- Se abrirá un editor SQL en blanco

### 4. Copiar el Contenido del Archivo
- Abre el archivo `database.sql` en tu editor
- Selecciona TODO el contenido (Ctrl + A)
- Cópialo (Ctrl + C)

### 5. Pegar en Supabase
- En el editor SQL de Supabase, pega el contenido (Ctrl + V)
- Verifica que todo esté completo

### 6. Ejecutar el Script
- Haz clic en el botón **RUN** (botón azul de play en la esquina inferior derecha)
- O presiona `Ctrl + Enter`

### 7. Verificar la Ejecución
- Deberías ver un mensaje de éxito
- En el panel "Tables" (izquierda) aparecerán:
  - ✅ customers
  - ✅ categories
  - ✅ products
  - ✅ sales
  - ✅ sales_details
  - ✅ stock_movements
  - ✅ suppliers
  - ✅ purchases
  - ✅ purchases_details
  - ✅ users
  - ✅ daily_reports

## Qué se Crea

### Tablas (11 total)
- **customers** - Clientes de la panadería
- **categories** - Categorías de productos
- **products** - Inventario de productos
- **sales** - Registro de ventas
- **sales_details** - Detalles de cada venta
- **stock_movements** - Movimientos de inventario
- **suppliers** - Proveedores
- **purchases** - Compras a proveedores
- **purchases_details** - Detalles de compras
- **users** - Usuarios del sistema
- **daily_reports** - Reportes diarios

### Índices (8 total)
- Para optimizar búsquedas por customer, product, fecha, etc.

### Vistas (3 total)
- **latest_sales** - Últimas ventas con detalles completos
- **current_stock** - Estado actual del inventario
- **sales_by_category** - Ventas agrupadas por categoría

### Datos de Ejemplo
- 5 categorías de productos
- 5 clientes
- 5 productos con stock
- 3 proveedores

## Próximos Pasos

Una vez importado:

1. ✅ La aplicación cargará automáticamente los datos
2. ✅ Podrás crear nuevas ventas desde la interfaz
3. ✅ Los datos se guardarán en Supabase

## Solución de Problemas

### Error: "CREATE EXTENSION failed"
- Supabase ya tiene las extensiones habilitadas, esto es normal
- Ignora este error y continúa

### Error: "relation already exists"
- Significa que las tablas ya existen
- Puedes ejecutar el script nuevamente sin problemas
- O borrar las tablas primero desde la interfaz

### La aplicación no carga datos
- Verifica que las credenciales en `.env.local` sean correctas
- Revisa la consola del navegador (F12) para errores
- Comprueba que las tablas se crearon en Supabase

## Contacto

Si necesitas ayuda, verifica que:
- ✅ `.env.local` tiene las credenciales correctas
- ✅ El servidor de desarrollo está corriendo (`npm run dev`)
- ✅ Las tablas se crearon en Supabase SQL Editor
