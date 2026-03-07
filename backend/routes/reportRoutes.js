const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/*
  GET /reports
  Lista todos los reportes (solo admin)
*/
router.get("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT * FROM reports
      ORDER BY created_at DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener reportes", error: error.message });
    }
});

/*
  GET /reports/:id
  Obtiene un reporte por id (solo admin)
*/
router.get("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM reports WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el reporte", error: error.message });
    }
});

/*
  POST /reports
  Crea un reporte nuevo (cualquier usuario autenticado o público)
*/
router.post("/", async (req, res) => {
    try {
        const { name, email, type, description } = req.body;

        if (!name || !email || !description) {
            return res.status(400).json({ message: "Nombre, correo y descripción son requeridos" });
        }

        const result = await pool.query(`
      INSERT INTO reports (name, email, type, description, status)
      VALUES ($1, $2, $3, $4, 'pendiente')
      RETURNING *
    `, [name, email, type || "Otro", description]);

        res.status(201).json({ message: "Reporte enviado correctamente", report: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el reporte", error: error.message });
    }
});

/*
  PUT /reports/:id
  Actualiza el estado de un reporte (solo admin)
*/
router.put("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, type, description, status } = req.body;

        const result = await pool.query(`
      UPDATE reports
      SET name = $1,
          email = $2,
          type = $3,
          description = $4,
          status = $5
      WHERE id = $6
      RETURNING *
    `, [name, email, type, description, status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        res.json({ message: "Reporte actualizado", report: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el reporte", error: error.message });
    }
});

/*
  DELETE /reports/:id
  Elimina un reporte (solo admin)
*/
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM reports WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        res.json({ message: "Reporte eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el reporte", error: error.message });
    }
});

module.exports = router;
