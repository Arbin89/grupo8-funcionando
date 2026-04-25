const express = require("express");
const axios = require("axios");
const pool = require("../config/db");

const router = express.Router();

function hasRealValue(value) {
  if (!value) return false;
  return !value.trim().toLowerCase().startsWith("pon_tu_");
}

function getAiClientConfig() {
  if (hasRealValue(process.env.GROQ_API_KEY)) {
    return {
      provider: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.1-8b-instant",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    };
  }

  if (hasRealValue(process.env.OPENROUTER_API_KEY)) {
    return {
      provider: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    };
  }

  return null;
}

function sendMissingAiConfig(res) {
  return res.status(503).json({
    ok: false,
    message: "Falta configurar GROQ_API_KEY o OPENROUTER_API_KEY en backend/.env",
    code: "AI_CONFIG_MISSING",
  });
}

function sendAiProviderError(res, error, fallbackMessage) {
  const upstreamStatus = error.response?.status;
  const status = upstreamStatus || 500;
  return res.status(status).json({
    ok: false,
    message: fallbackMessage,
    code: "AI_PROVIDER_ERROR",
    detail: error.response?.data || error.message,
  });
}

router.post("/resumen-dia", async (req, res) => {
  try {
    const {
      fecha,
      registrosProcesados,
      completados,
      pendientes,
      observacionClave,
    } = req.body;

    const aiConfig = getAiClientConfig();
    if (!aiConfig) {
      return sendMissingAiConfig(res);
    }

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
      aiConfig.url,
      {
        model: aiConfig.model,
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
      { headers: aiConfig.headers }
    );

    const resumen = response.data?.choices?.[0]?.message?.content;

    return res.json({
      ok: true,
      resumen: resumen || "No se pudo generar el resumen.",
    });
  } catch (error) {
    console.error("===== ERROR IA =====");
    console.error("Mensaje:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("====================");

    return sendAiProviderError(res, error, "No se pudo generar el resumen del día");
  }
});

router.get("/reporte-diario", async (req, res) => {
  try {
    const aiConfig = getAiClientConfig();
    if (!aiConfig) {
      return sendMissingAiConfig(res);
    }

    const { rows: rReservas } = await pool.query("SELECT COUNT(*) as total FROM reservations WHERE reservation_date = CURRENT_DATE");
    const { rows: rInventario } = await pool.query("SELECT * FROM inventory_items WHERE stock_available <= stock_minimum");
    const { rows: rMenu } = await pool.query("SELECT * FROM menu_items LIMIT 5");

    const prompt = `Actúa como el asistente del restaurante. Genera un reporte breve basado en estos datos:\nReservas hoy: ${rReservas[0].total}\nProductos en inventario bajo: ${rInventario.length}\nPor favor haz un pequeño resumen general de la operativa de hoy, en formato claro y usando listas si es necesario.`;

    const response = await axios.post(aiConfig.url, {
      model: aiConfig.model,
      messages: [{ role: "system", content: "Eres el asistente inteligente de un restaurante." }, { role: "user", content: prompt }]
    }, { headers: aiConfig.headers });

    res.json({
      reporte: response.data.choices[0].message.content,
      datos: { reservas: { total: parseInt(rReservas[0].total) }, inventarioBajo: rInventario, platosPopulares: rMenu }
    });
  } catch (error) {
    return sendAiProviderError(res, error, "No se pudo generar el reporte diario");
  }
});

router.get("/alertas-inventario", async (req, res) => {
  try {
    const aiConfig = getAiClientConfig();
    if (!aiConfig) {
      return sendMissingAiConfig(res);
    }

    const { rows: rInventario } = await pool.query("SELECT * FROM inventory_items WHERE stock_available <= stock_minimum");
    
    let prompt = "Tenemos todos los niveles de inventario en orden. Genera un mensaje positivo animando al equipo de cocina.";
    if (rInventario.length > 0) {
      const nombres = rInventario.map(i => i.name).join(", ");
      prompt = `Los siguientes ingredientes están en nivel crítico de inventario: ${nombres}. Escribe una alerta corta y profesional para que los gerentes hagan la compra urgente.`;
    }

    const response = await axios.post(aiConfig.url, {
      model: aiConfig.model,
      messages: [{ role: "system", content: "Eres el asistente inteligente de un restaurante." }, { role: "user", content: prompt }]
    }, { headers: aiConfig.headers });

    res.json({ alertas: response.data.choices[0].message.content, items: rInventario });
  } catch (error) {
    return sendAiProviderError(res, error, "No se pudieron generar las alertas de inventario");
  }
});

router.get("/sugerencias-menu", async (req, res) => {
  try {
    const aiConfig = getAiClientConfig();
    if (!aiConfig) {
      return sendMissingAiConfig(res);
    }

    const { rows: rMenu } = await pool.query("SELECT * FROM menu_items WHERE available = true LIMIT 10");
    const nombres = rMenu.map(i => i.name).join(", ");
    
    const prompt = `El menú actual tiene estos platos: ${nombres}. Genera 3 sugerencias innovadoras o combos especiales atractivos que el restaurante podría promover hoy.`;

    const response = await axios.post(aiConfig.url, {
      model: aiConfig.model,
      messages: [{ role: "system", content: "Eres el asistente inteligente de un restaurante." }, { role: "user", content: prompt }]
    }, { headers: aiConfig.headers });

    res.json({ sugerencias: response.data.choices[0].message.content });
  } catch (error) {
    return sendAiProviderError(res, error, "No se pudieron generar sugerencias de menu");
  }
});

router.post("/chat", async (req, res) => {
  try {
    const aiConfig = getAiClientConfig();
    if (!aiConfig) {
      return sendMissingAiConfig(res);
    }

    const { mensaje, contexto } = req.body;
    
    const response = await axios.post(aiConfig.url, {
      model: aiConfig.model,
      messages: [
        { role: "system", content: "Eres un útil asistente de Inteligencia Artificial para el sistema de restaurantes SIGER. Responde preguntas de usuarios con tono profesional." },
        { role: "user", content: mensaje }
      ]
    }, { headers: aiConfig.headers });

    res.json({ respuesta: response.data.choices[0].message.content });
  } catch (error) {
    return sendAiProviderError(res, error, "No se pudo procesar el chat de IA");
  }
});

module.exports = router;