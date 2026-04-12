const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// Ruta para crear un usuario admin inicial.
// Esta ruta es temporal y luego la quitaremos o protegeremos.
router.post("/seed-admin", async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body;

    // Encriptamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (name, email, username, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, username, role, status, created_at
      `,
      [name, email, username, hashedPassword, role]
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

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscamos el usuario por username
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    // Si no existe, devolvemos error
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    const user = result.rows[0];

    // Comparamos la contraseña enviada con la encriptada guardada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    // Creamos token JWT con datos básicos del usuario
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      "siger_secreto_2026",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el login",
      error: error.message,
    });
  }
});

module.exports = router;