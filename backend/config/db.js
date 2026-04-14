const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Creamos un pool de conexiones a PostgreSQL.
// Esto permite reutilizar conexiones y trabajar mejor que con una sola conexión fija.
const pool = new Pool({
  host: process.env.DB_HOST,       // Host de la base de datos
  port: process.env.DB_PORT,       // Puerto de PostgreSQL
  user: process.env.DB_USER,       // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña
  database: process.env.DB_NAME,   // Nombre de la base de datos
});

// Exportamos el pool para usarlo en rutas, controladores, etc.
module.exports = pool;