const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/*
  GET /menu
  Lista todos los platos del menú (público)
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM menu_items
      ORDER BY category ASC, name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el menú", error: error.message });
  }
});

/*
  GET /menu/:id
  Obtiene un plato por id
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM menu_items WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plato no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el plato", error: error.message });
  }
});

/*
  POST /menu
  Crea un plato nuevo (solo admin)
*/
router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, description, price, category, emoji, image_url, available } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Nombre y precio son requeridos" });
    }

    const result = await pool.query(`
      INSERT INTO menu_items (name, description, price, category, emoji, image_url, available)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      name,
      description || "",
      price,
      category || "General",
      emoji || "🍽️",
      image_url || "",
      available !== undefined ? available : true,
    ]);

    res.status(201).json({ message: "Plato creado", item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el plato", error: error.message });
  }
});

/*
  PUT /menu/:id
  Actualiza un plato (solo admin)
*/
router.put("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, emoji, image_url, available } = req.body;

    const result = await pool.query(`
      UPDATE menu_items
      SET name = $1,
          description = $2,
          price = $3,
          category = $4,
          emoji = $5,
          image_url = $6,
          available = $7
      WHERE id = $8
      RETURNING *
    `, [name, description, price, category, emoji, image_url || "", available, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plato no encontrado" });
    }

    res.json({ message: "Plato actualizado", item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el plato", error: error.message });
  }
});

/*
  DELETE /menu/:id
  Elimina un plato (solo admin)
*/
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM menu_items WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plato no encontrado" });
    }

    res.json({ message: "Plato eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el plato", error: error.message });
  }
});

module.exports = router;
