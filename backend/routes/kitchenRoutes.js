const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Genera número de orden único: ORD-XXXXXX
const genOrderNumber = () => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${rand}`;
};

// ── GET /kitchen/orders ─ lista todas las órdenes con sus items (sin auth para la vista de cocina)
router.get("/orders", async (req, res) => {
    try {
        const orders = await pool.query(
            `SELECT * FROM kitchen_orders ORDER BY created_at DESC`
        );
        // Para cada orden, obtener sus items
        const result = await Promise.all(
            orders.rows.map(async (order) => {
                const items = await pool.query(
                    `SELECT * FROM kitchen_order_items WHERE kitchen_order_id = $1`,
                    [order.id]
                );
                return { ...order, items: items.rows };
            })
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener órdenes", error: error.message });
    }
});

// ── POST /kitchen/orders ─ crear nueva orden (público, desde el menú)
router.post("/orders", async (req, res) => {
    const client = await pool.connect();
    try {
        const { items, notes, table_number } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío" });
        }

        await client.query("BEGIN");

        let orderNumber;
        let attempts = 0;
        // Asegurar order_number único
        while (attempts < 5) {
            orderNumber = genOrderNumber();
            const exists = await client.query(
                `SELECT id FROM kitchen_orders WHERE order_number = $1`,
                [orderNumber]
            );
            if (exists.rows.length === 0) break;
            attempts++;
        }

        const orderNotes = [
            table_number ? `Mesa: ${table_number}` : null,
            notes || null,
        ].filter(Boolean).join(" | ");

        const orderResult = await client.query(
            `INSERT INTO kitchen_orders (order_number, status, notes)
       VALUES ($1, 'pendiente', $2) RETURNING *`,
            [orderNumber, orderNotes || null]
        );
        const order = orderResult.rows[0];

        for (const item of items) {
            await client.query(
                `INSERT INTO kitchen_order_items (kitchen_order_id, item_name, item_emoji, item_image_url, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [order.id, item.name, item.emoji || "", item.image_url || "", item.quantity, item.price]
            );
        }

        await client.query("COMMIT");

        const fullOrder = await pool.query(
            `SELECT * FROM kitchen_orders WHERE id = $1`,
            [order.id]
        );
        const fullItems = await pool.query(
            `SELECT * FROM kitchen_order_items WHERE kitchen_order_id = $1`,
            [order.id]
        );

        res.status(201).json({
            message: "Orden enviada a cocina",
            order: { ...fullOrder.rows[0], items: fullItems.rows },
        });
    } catch (error) {
        await client.query("ROLLBACK");
        res.status(500).json({ message: "Error al crear la orden", error: error.message });
    } finally {
        client.release();
    }
});

// ── PUT /kitchen/orders/:id/status ─ actualizar estado de una orden
router.put("/orders/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pendiente", "en_proceso", "lista", "entregada"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        const result = await pool.query(
            `UPDATE kitchen_orders SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        res.json({ message: "Estado actualizado", order: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estado", error: error.message });
    }
});

module.exports = router;
