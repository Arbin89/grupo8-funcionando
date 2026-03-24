const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const aiRoutes = require("./routes/aiRoutes");
// Importamos las rutas
const authRoutes = require("./routes/authRoutes");

const app = express();

// Permite peticiones desde el frontend
app.use(cors());

// Permite enviar y recibir JSON
app.use(express.json());


// Ruta base para probar que el backend está vivo
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Backend funcionando 🚀",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de autenticación
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/ai", aiRoutes);

// Iniciamos el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
