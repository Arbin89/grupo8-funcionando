const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware.js");

const router = express.Router();

/*
  GET /users
  Obtiene todos los usuarios
  Solo admin puede ver la lista
*/
router.get("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, username, role, status, created_at
      FROM users
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
});

/*
  GET /users/:id
  Obtiene un usuario por su id
  Solo admin
*/
router.get("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT id, name, email, username, role, status, created_at
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
});

/*
  POST /users
  Crea un usuario nuevo
  Solo admin
*/
router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, email, username, password, role, status } = req.body;

    // Encriptamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (name, email, username, password, role, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, username, role, status, created_at
      `,
      [name, email, username, hashedPassword, role, status || "activo"]
    );

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear usuario",
      error: error.message,
    });
  }
});

/*
  PUT /users/:id
  Actualiza datos básicos del usuario
  Solo admin
*/
router.put("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, username, role, status } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET name = $1,
          email = $2,
          username = $3,
          role = $4,
          status = $5
      WHERE id = $6
      RETURNING id, name, email, username, role, status, created_at
      `,
      [name, email, username, role, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json({
      message: "Usuario actualizado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
});

/*
  DELETE /users/:id
  Elimina un usuario
  Solo admin
*/
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
});

module.exports = router;
