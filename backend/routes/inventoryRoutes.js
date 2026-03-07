const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// ─────────────────────────────────────────────
//  CATEGORÍAS
// ─────────────────────────────────────────────

/*  GET /inventory/categories  – Listar todas */
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory_categories ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías", error: error.message });
  }
});

/*  POST /inventory/categories  – Crear */
router.post("/categories", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "El nombre es requerido" });

    const result = await pool.query(
      "INSERT INTO inventory_categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json({ message: "Categoría creada", category: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
    }
    res.status(500).json({ message: "Error al crear categoría", error: error.message });
  }
});

/*  DELETE /inventory/categories/:id  – Eliminar */
router.delete("/categories/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM inventory_categories WHERE id = $1", [id]);
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría", error: error.message });
  }
});

// ─────────────────────────────────────────────
//  PRODUCTOS / ITEMS
// ─────────────────────────────────────────────

/*  GET /inventory/items  – Listar todos (con nombre de categoría) */
router.get("/items", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        i.id,
        i.name,
        i.stock_available,
        i.stock_minimum,
        i.unit_price,
        i.status,
        i.created_at,
        i.category_id,
        c.name AS category_name
      FROM inventory_items i
      LEFT JOIN inventory_categories c ON i.category_id = c.id
      ORDER BY i.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener items", error: error.message });
  }
});

/*  GET /inventory/items/:id  – Obtener uno */
router.get("/items/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT
        i.*,
        c.name AS category_name
      FROM inventory_items i
      LEFT JOIN inventory_categories c ON i.category_id = c.id
      WHERE i.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener item", error: error.message });
  }
});

/*  POST /inventory/items  – Crear */
router.post("/items", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, category_id, stock_available, stock_minimum, unit_price, status } = req.body;

    if (!name) return res.status(400).json({ message: "El nombre es requerido" });

    const result = await pool.query(`
      INSERT INTO inventory_items
        (name, category_id, stock_available, stock_minimum, unit_price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      name,
      category_id || null,
      stock_available ?? 0,
      stock_minimum ?? 0,
      unit_price ?? 0,
      status || "activo",
    ]);

    res.status(201).json({ message: "Item creado", item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error al crear item", error: error.message });
  }
});

/*  PUT /inventory/items/:id  – Actualizar */
router.put("/items/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, stock_available, stock_minimum, unit_price, status } = req.body;

    const result = await pool.query(`
      UPDATE inventory_items
      SET
        name           = $1,
        category_id    = $2,
        stock_available = $3,
        stock_minimum  = $4,
        unit_price     = $5,
        status         = $6
      WHERE id = $7
      RETURNING *
    `, [name, category_id || null, stock_available, stock_minimum, unit_price, status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }
    res.json({ message: "Item actualizado", item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar item", error: error.message });
  }
});

/*  DELETE /inventory/items/:id  – Eliminar */
router.delete("/items/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM inventory_items WHERE id = $1", [id]);
    res.json({ message: "Item eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar item", error: error.message });
  }
});

module.exports = router;
