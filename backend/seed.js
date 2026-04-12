const bcrypt = require("bcryptjs");
const pool = require("./config/db");
const menuItems = require("./data/defaultMenuItems");
require("dotenv").config();

async function seed() {
            // ── Platos del menú ──────────────────────────────
            for (const m of menuItems) {
                await pool.query(
                    `INSERT INTO menu_items (name, description, price, category, emoji, image_url, available)
                     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                    [m.name, m.description, m.price, m.category, m.emoji || "", m.image_url, m.available]
                );
            }
            console.log("✅ Platos del menú insertados");
    console.log("🌱 Iniciando seed...\n");

    // ── Usuarios ──────────────────────────────────────
    const users = [
        { name: "Admin Principal", email: "admin@siger.com", username: "admin", password: "admin123", role: "admin", status: "activo" },
        { name: "Carlos Mesero", email: "mesero@siger.com", username: "mesero", password: "mesero123", role: "mesero", status: "activo" },
        { name: "Laura Cocina", email: "cocina@siger.com", username: "cocina", password: "cocina123", role: "cocina", status: "activo" },
        { name: "María López", email: "maria@siger.com", username: "mlopez", password: "usuario123", role: "usuario", status: "activo" },
        { name: "Pedro Rodríguez", email: "pedro@siger.com", username: "prodrig", password: "usuario123", role: "mesero", status: "inactivo" },
    ];

    for (const u of users) {
        const hash = await bcrypt.hash(u.password, 10);
        await pool.query(
            `INSERT INTO users (name, email, username, password, role, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (email) DO NOTHING`,
            [u.name, u.email, u.username, hash, u.role, u.status]
        );
    }
    console.log("✅ Usuarios insertados");

    // ── Categorías de inventario ───────────────────────
    const cats = ["Carnes", "Lácteos", "Vegetales", "Bebidas", "Panadería"];
    for (const c of cats) {
        await pool.query(
            `INSERT INTO inventory_categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
            [c]
        );
    }
    const { rows: catRows } = await pool.query("SELECT id, name FROM inventory_categories");
    const catMap = Object.fromEntries(catRows.map((r) => [r.name, r.id]));
    console.log("✅ Categorías de inventario insertadas");

    // ── Productos de inventario ────────────────────────
    const items = [
        { name: "Carne de Res", cat: "Carnes", stock: 15, min: 5, price: 250.00 },
        { name: "Pechuga de Pollo", cat: "Carnes", stock: 20, min: 8, price: 120.00 },
        { name: "Filete de Cerdo", cat: "Carnes", stock: 4, min: 5, price: 180.00 },
        { name: "Queso Mozzarella", cat: "Lácteos", stock: 8, min: 3, price: 95.00 },
        { name: "Crema de Leche", cat: "Lácteos", stock: 6, min: 4, price: 60.00 },
        { name: "Leche Entera", cat: "Lácteos", stock: 12, min: 5, price: 45.00 },
        { name: "Lechuga Romana", cat: "Vegetales", stock: 25, min: 10, price: 25.00 },
        { name: "Tomate", cat: "Vegetales", stock: 30, min: 10, price: 20.00 },
        { name: "Cebolla", cat: "Vegetales", stock: 2, min: 8, price: 15.00 },
        { name: "Cerveza Artesanal", cat: "Bebidas", stock: 48, min: 12, price: 55.00 },
        { name: "Agua Mineral", cat: "Bebidas", stock: 36, min: 12, price: 18.00 },
        { name: "Jugo de Naranja", cat: "Bebidas", stock: 10, min: 6, price: 35.00 },
        { name: "Pan para Hamburguesa", cat: "Panadería", stock: 40, min: 20, price: 12.00 },
        { name: "Baguette", cat: "Panadería", stock: 15, min: 10, price: 20.00 },
    ];

    for (const it of items) {
        await pool.query(
            `INSERT INTO inventory_items (name, category_id, stock_available, stock_minimum, unit_price, status)
       VALUES ($1,$2,$3,$4,$5,'activo')`,
            [it.name, catMap[it.cat], it.stock, it.min, it.price]
        );
    }
    console.log("✅ Inventario insertado");

    // ── Reservaciones ──────────────────────────────────
    const reservations = [
        { customer_name: "Juan Pérez", email: "juan@email.com", phone: "809-555-0101", date: "2026-03-10", time: "19:00", people: 4, notes: "Mesa cerca de la ventana", status: "confirmada" },
        { customer_name: "Ana García", email: "ana@email.com", phone: "809-555-0202", date: "2026-03-11", time: "20:30", people: 2, notes: "Aniversario de bodas", status: "confirmada" },
        { customer_name: "Luis Martínez", email: "luis@email.com", phone: "809-555-0303", date: "2026-03-12", time: "13:00", people: 6, notes: "", status: "pendiente" },
        { customer_name: "Sofía Hernández", email: "sofia@email.com", phone: "809-555-0404", date: "2026-03-12", time: "21:00", people: 3, notes: "Alergia al mariscos", status: "pendiente" },
        { customer_name: "Diego Ramírez", email: "diego@email.com", phone: "809-555-0505", date: "2026-03-08", time: "18:30", people: 5, notes: "Cumpleaños", status: "cancelada" },
        { customer_name: "Camila Torres", email: "camila@email.com", phone: "809-555-0606", date: "2026-03-15", time: "20:00", people: 2, notes: "Cena romántica", status: "confirmada" },
    ];

    for (const r of reservations) {
        await pool.query(
            `INSERT INTO reservations (customer_name, email, phone, reservation_date, reservation_time, people, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [r.customer_name, r.email, r.phone, r.date, r.time, r.people, r.notes, r.status]
        );
    }
    console.log("✅ Reservaciones insertadas");

    // ── Reportes ───────────────────────────────────────
    const reports = [
        { name: "Carlos Méndez", email: "carlos@email.com", type: "Queja", description: "El servicio tardó más de 45 minutos en llegar.", status: "pendiente" },
        { name: "Rosa Jiménez", email: "rosa@email.com", type: "Sugerencia", description: "Sería genial tener opciones vegetarianas en el menú.", status: "revisado" },
        { name: "Ángel Vargas", email: "angel@email.com", type: "Error en el sistema", description: "No pude completar mi reservación en línea.", status: "resuelto" },
        { name: "Lucía Castillo", email: "lucia@email.com", type: "Sugerencia", description: "Podrían poner música en vivo los viernes.", status: "pendiente" },
        { name: "Mario Soto", email: "mario@email.com", type: "Queja", description: "El baño no estaba limpio a las 8pm.", status: "revisado" },
    ];

    for (const rp of reports) {
        await pool.query(
            `INSERT INTO reports (name, email, type, description, status) VALUES ($1,$2,$3,$4,$5)`,
            [rp.name, rp.email, rp.type, rp.description, rp.status]
        );
    }
    console.log("✅ Reportes insertados");

    console.log("\n🎉 Seed completado exitosamente!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Error en seed:", err.message);
    process.exit(1);
});
