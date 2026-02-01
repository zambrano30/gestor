-- PanaderiaPro Database Schema
-- Complete SQL schema for bakery sales management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.settings.jwt_secret" = 'your-secret-key';

-- ============================================
-- TABLES
-- ============================================

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 5,
    sku VARCHAR(100) UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    sale_date DATE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Details Table
CREATE TABLE IF NOT EXISTS sales_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Movements Table
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100),
    contact_person VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    purchase_number VARCHAR(50) UNIQUE NOT NULL,
    purchase_date DATE NOT NULL,
    delivery_date DATE,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases Details Table
CREATE TABLE IF NOT EXISTS purchases_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Reports Table
CREATE TABLE IF NOT EXISTS daily_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_date DATE NOT NULL UNIQUE,
    total_sales DECIMAL(10, 2) DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    total_purchases DECIMAL(10, 2) DEFAULT 0,
    purchases_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_sales_details_sale_id ON sales_details(sale_id);
CREATE INDEX idx_sales_details_product_id ON sales_details(product_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date);

-- ============================================
-- VIEWS
-- ============================================

-- Latest Sales View
CREATE OR REPLACE VIEW latest_sales AS
SELECT 
    s.id,
    s.sale_number,
    s.sale_date,
    s.total,
    s.status,
    c.name as customer_name,
    c.email as customer_email,
    p.name as product_name,
    sd.quantity,
    sd.unit_price,
    s.created_at
FROM sales s
LEFT JOIN customers c ON s.customer_id = c.id
LEFT JOIN sales_details sd ON s.id = sd.sale_id
LEFT JOIN products p ON sd.product_id = p.id
ORDER BY s.created_at DESC;

-- Current Stock View
CREATE OR REPLACE VIEW current_stock AS
SELECT 
    p.id,
    p.name,
    p.sku,
    c.name as category,
    p.stock,
    p.minimum_stock,
    p.unit_price,
    (p.stock * p.unit_price) as total_value,
    CASE 
        WHEN p.stock <= p.minimum_stock THEN 'LOW'
        WHEN p.stock > p.minimum_stock * 2 THEN 'HIGH'
        ELSE 'NORMAL'
    END as stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.active = TRUE
ORDER BY p.stock ASC;

-- Sales by Category View
CREATE OR REPLACE VIEW sales_by_category AS
SELECT 
    c.id,
    c.name,
    COUNT(sd.id) as items_sold,
    SUM(sd.quantity) as total_quantity,
    SUM(sd.subtotal) as total_revenue
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN sales_details sd ON p.id = sd.product_id
GROUP BY c.id, c.name
ORDER BY total_revenue DESC NULLS LAST;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Categories
INSERT INTO categories (name, description) VALUES
('Pan y Bollos', 'Panes artesanales y bollos frescos'),
('Medialunas', 'Medialunas de manteca y jamón'),
('Tartas y Pasteles', 'Tartas personalizadas y pasteles'),
('Galletas', 'Galletas y bizcochos'),
('Productos Dietéticos', 'Panes y productos sin gluten')
ON CONFLICT DO NOTHING;

-- Customers
INSERT INTO customers (name, email, phone, city, active) VALUES
('Juan García López', 'juan@example.com', '1234567890', 'Buenos Aires', TRUE),
('María González Rodríguez', 'maria@example.com', '0987654321', 'La Plata', TRUE),
('Carlos Martínez Pérez', 'carlos@example.com', '1122334455', 'Buenos Aires', TRUE),
('Ana Fernández López', 'ana@example.com', '5566778899', 'Quilmes', TRUE),
('Roberto Sánchez García', 'roberto@example.com', '9988776655', 'Avellaneda', TRUE)
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO products (name, description, category_id, unit_price, stock, minimum_stock, sku, active) VALUES
('Pan de Molde', 'Pan de molde tostado', (SELECT id FROM categories WHERE name = 'Pan y Bollos' LIMIT 1), 150.00, 50, 10, 'PAN001', TRUE),
('Medialunas x6', 'Caja de 6 medialunas de manteca', (SELECT id FROM categories WHERE name = 'Medialunas' LIMIT 1), 120.00, 30, 5, 'MED001', TRUE),
('Tarta Fresas', 'Tarta de fresas con crema', (SELECT id FROM categories WHERE name = 'Tartas y Pasteles' LIMIT 1), 350.00, 10, 2, 'TAR001', TRUE),
('Galletas de Vainilla', 'Galletas caseras de vainilla', (SELECT id FROM categories WHERE name = 'Galletas' LIMIT 1), 80.00, 40, 8, 'GAL001', TRUE),
('Pan sin Gluten', 'Pan integral sin gluten', (SELECT id FROM categories WHERE name = 'Productos Dietéticos' LIMIT 1), 200.00, 15, 3, 'DIM001', TRUE)
ON CONFLICT DO NOTHING;

-- Suppliers
INSERT INTO suppliers (name, email, phone, city, contact_person, active) VALUES
('Molino Central', 'ventas@molinocentral.com', '1234567890', 'Buenos Aires', 'Juan Pérez', TRUE),
('Lácteos Premium', 'info@lacteospremi.com', '0987654321', 'La Plata', 'María López', TRUE),
('Distribuidora de Frutas', 'distribución@frutas.com', '1122334455', 'Mercado Central', 'Carlos García', TRUE)
ON CONFLICT DO NOTHING;

-- Expenses
INSERT INTO expenses (amount, category, description, expense_date) VALUES
(350.00, 'Insumos', 'Compra de harina y azúcar', CURRENT_DATE),
(120.00, 'Servicios', 'Pago de electricidad', CURRENT_DATE),
(80.00, 'Transporte', 'Flete de mercadería', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to products
CREATE POLICY "Allow public read on products" ON products
    FOR SELECT USING (active = TRUE);

-- Policy for authenticated insert on sales
CREATE POLICY "Allow authenticated to insert sales" ON sales
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated select on sales
CREATE POLICY "Allow authenticated to select sales" ON sales
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for public read/insert on expenses
CREATE POLICY "Allow public read on expenses" ON expenses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on expenses" ON expenses
    FOR INSERT WITH CHECK (true);

-- ============================================
-- END OF SCHEMA
-- ============================================
