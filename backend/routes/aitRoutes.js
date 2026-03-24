const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
  "/resumen-dia",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const {
        fecha,
        registrosProcesados,
        completados,
        pendientes,
        observacionClave,
      } = req.body;

      const prompt = `
Genera un resumen ejecutivo breve y formal en español para un administrador.

Datos del día:
- Fecha: ${fecha}
- Registros procesados: ${registrosProcesados}
- Completados: ${completados}
- Pendientes: ${pendientes}
- Observación clave: ${observacionClave}

Reglas:
- máximo 100 palabras
- tono profesional
- no inventes datos
- resume solo lo más importante
- termina con una recomendación breve
`;

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: process.env.OPENROUTER_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente que redacta resúmenes ejecutivos breves, claros y profesionales en español.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 220,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resumen = response.data.choices?.[0]?.message?.content;

      return res.json({
        ok: true,
        resumen: resumen || "No se pudo generar el resumen.",
      });
    } catch (error) {
      console.error(
        "Error IA:",
        error.response?.data || error.message
      );

      return res.status(500).json({
        ok: false,
        message: "No se pudo generar el resumen del día",
      });
    }
  }
);

module.exports = router;