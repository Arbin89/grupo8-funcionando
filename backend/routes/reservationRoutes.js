const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/*
  GET /reservations
  Obtiene todas las reservas
  Cualquier usuario autenticado puede verlas
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM reservations
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reservas",
      error: error.message,
    });
  }
});

/*
  GET /reservations/:id
  Obtiene una reserva por id
*/
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM reservations WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reserva",
      error: error.message,
    });
  }
});

/*
  POST /reservations
  Crea una reserva nueva
*/
router.post("/", async (req, res) => {
  try {
    const {
      customer_name,
      email,
      phone,
      reservation_date,
      reservation_time,
      people,
      notes,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO reservations
      (customer_name, email, phone, reservation_date, reservation_time, people, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        customer_name,
        email,
        phone,
        reservation_date,
        reservation_time,
        people,
        notes,
        status || "pendiente",
      ]
    );

    res.status(201).json({
      message: "Reserva creada correctamente",
      reservation: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear reserva",
      error: error.message,
    });
  }
});
/*
  PUT /reservations/:id
  Actualiza una reserva existente
*/
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_name,
      email,
      phone,
      reservation_date,
      reservation_time,
      people,
      notes,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE reservations
      SET customer_name = $1,
          email = $2,
          phone = $3,
          reservation_date = $4,
          reservation_time = $5,
          people = $6,
          notes = $7,
          status = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        customer_name,
        email,
        phone,
        reservation_date,
        reservation_time,
        people,
        notes,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    res.json({
      message: "Reserva actualizada correctamente",
      reservation: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar reserva",
      error: error.message,
    });
  }
});

/*
  DELETE /reservations/:id
  Elimina una reserva
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM reservations WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    res.json({
      message: "Reserva eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar reserva",
      error: error.message,
    });
  }
});

module.exports = router;