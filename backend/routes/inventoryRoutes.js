const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

const selectInventoryItemById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      items.id,
      items.name,
      items.category_id,
      categories.name AS category_name,
      items.stock_available,
      items.stock_minimum,
      items.unit_price,
      items.status,
      items.created_at
    FROM inventory_items items
    LEFT JOIN inventory_categories categories
      ON categories.id = items.category_id
    WHERE items.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const getOrCreateCategoryId = async (categoryName) => {
  if (!categoryName || !categoryName.trim()) {
    return null;
  }

  const normalizedName = categoryName.trim();

  const existingCategory = await pool.query(
    `
    SELECT id
    FROM inventory_categories
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
    `,
    [normalizedName]
  );

  if (existingCategory.rows.length > 0) {
    return existingCategory.rows[0].id;
  }

  const createdCategory = await pool.query(
    `
    INSERT INTO inventory_categories (name)
    VALUES ($1)
    RETURNING id
    `,
    [normalizedName]
  );

  return createdCategory.rows[0].id;
};

router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        items.id,
        items.name,
        items.category_id,
        categories.name AS category_name,
        items.stock_available,
        items.stock_minimum,
        items.unit_price,
        items.status,
        items.created_at
      FROM inventory_items items
      LEFT JOIN inventory_categories categories
        ON categories.id = items.category_id
      ORDER BY items.id ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener inventario",
      error: error.message,
    });
  }
});

router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, created_at
      FROM inventory_categories
      ORDER BY name ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener categorias",
      error: error.message,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await selectInventoryItemById(id);

    if (!item) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener producto",
      error: error.message,
    });
  }
});

router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const {
      name,
      category_name,
      stock_available,
      stock_minimum,
      unit_price,
      status,
    } = req.body;

    const categoryId = await getOrCreateCategoryId(category_name);

    const result = await pool.query(
      `
      INSERT INTO inventory_items
      (name, category_id, stock_available, stock_minimum, unit_price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [
        name,
        categoryId,
        stock_available ?? 0,
        stock_minimum ?? 0,
        unit_price ?? 0,
        status || "activo",
      ]
    );

    const item = await selectInventoryItemById(result.rows[0].id);

    res.status(201).json({
      message: "Producto creado correctamente",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear producto",
      error: error.message,
    });
  }
});

router.put("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_name,
      stock_available,
      stock_minimum,
      unit_price,
      status,
    } = req.body;

    const categoryId = await getOrCreateCategoryId(category_name);

    const result = await pool.query(
      `
      UPDATE inventory_items
      SET name = $1,
          category_id = $2,
          stock_available = $3,
          stock_minimum = $4,
          unit_price = $5,
          status = $6
      WHERE id = $7
      RETURNING id
      `,
      [
        name,
        categoryId,
        stock_available ?? 0,
        stock_minimum ?? 0,
        unit_price ?? 0,
        status || "activo",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    const item = await selectInventoryItemById(id);

    res.json({
      message: "Producto actualizado correctamente",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
});

router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM inventory_items WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
});

module.exports = router;
