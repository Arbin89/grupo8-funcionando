require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const aiRoutes = require("./routes/aiRoutes");
const menuRoutes = require("./routes/menuRoutes");
const reportRoutes = require("./routes/reportRoutes");
const kitchenRoutes = require("./routes/kitchenRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

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

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/menu", menuRoutes);
app.use("/reports", reportRoutes);
app.use("/kitchen", kitchenRoutes);
app.use("/ai", aiRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});