-- =========================
-- TABLA DE USUARIOS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'cocina', 'mesero', 'usuario')),
    status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE RESERVACIONES
-- =========================
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    people INT NOT NULL CHECK (people > 0),
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('confirmada', 'pendiente', 'cancelada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE CATEGORÍAS DE INVENTARIO
-- =========================
CREATE TABLE IF NOT EXISTS inventory_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE PRODUCTOS DE INVENTARIO
-- =========================
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES inventory_categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    stock_available INT NOT NULL DEFAULT 0 CHECK (stock_available >= 0),
    stock_minimum INT NOT NULL DEFAULT 0 CHECK (stock_minimum >= 0),
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE ÓRDENES DE COCINA
-- =========================
CREATE TABLE IF NOT EXISTS kitchen_orders (
    id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(id) ON DELETE SET NULL,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_proceso', 'lista', 'entregada')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE DETALLE DE ÓRDENES DE COCINA
-- =========================
CREATE TABLE IF NOT EXISTS kitchen_order_items (
    id SERIAL PRIMARY KEY,
    kitchen_order_id INT NOT NULL REFERENCES kitchen_orders(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    item_emoji VARCHAR(10) DEFAULT '',
    item_image_url TEXT DEFAULT '',
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    notes TEXT
);

-- =========================
-- TABLA DE LOGS / REPORTES
-- =========================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE MENÚ
-- =========================
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(50) NOT NULL DEFAULT 'General',
    emoji VARCHAR(10) DEFAULT '🍽️',
    image_url TEXT DEFAULT '',
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE REPORTES DE USUARIOS
-- =========================
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Otro',
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'revisado', 'resuelto')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);