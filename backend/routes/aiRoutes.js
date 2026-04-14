const express = require("express");
const { askAI } = require("../services/aiService");
const pool = require("../config/db");

const router = express.Router();

// POST /ai/resumen-dia
router.post("/resumen-dia", async (req, res) => {
  try {
    const { fecha, registrosProcesados, completados, pendientes, observacionClave } = req.body;

    const systemPrompt =
      "Eres un asistente que redacta resúmenes ejecutivos breves, claros y profesionales en español.";

    const userMessage = `
Genera un resumen ejecutivo breve y formal en español para un administrador de restaurante.

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

    const resumen = await askAI(systemPrompt, userMessage);

    return res.json({ ok: true, resumen });
  } catch (error) {
    console.error("Error /ai/resumen-dia:", error.message);
    return res.status(500).json({
      ok: false,
      message: "No se pudo generar el resumen",
      error: error.message,
    });
  }
});

// GET /ai/reporte-diario
router.get("/reporte-diario", async (req, res) => {
  try {
    const [resA, resB, resC] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) as total,
                SUM(CASE WHEN status='confirmada' THEN 1 ELSE 0 END) as confirmadas
         FROM reservations
         WHERE reservation_date = CURRENT_DATE`
      ),
      pool.query(
        `SELECT ii.name, ii.stock_available, ii.stock_minimum, ic.name as categoria
         FROM inventory_items ii
         LEFT JOIN inventory_categories ic ON ii.category_id = ic.id
         WHERE ii.stock_available <= ii.stock_minimum
         ORDER BY ii.stock_available ASC
         LIMIT 8`
      ),
      pool.query(
        `SELECT koi.item_name, COUNT(*) as total_pedidos
         FROM kitchen_order_items koi
         JOIN kitchen_orders ko ON koi.kitchen_order_id = ko.id
         WHERE ko.created_at::date = CURRENT_DATE
         GROUP BY koi.item_name
         ORDER BY total_pedidos DESC
         LIMIT 5`
      ),
    ]);

    const reservas = resA.rows[0];
    const inventarioBajo = resB.rows;
    const platosPopulares = resC.rows;

    const systemPrompt =
      "Eres un asistente de gestión de restaurantes. Redactas reportes diarios claros, concisos y útiles en español, con emojis relevantes.";

    const userMessage = `
Genera un reporte diario completo para el restaurante en español con emojis. Máximo 300 palabras.

📋 RESERVAS HOY:
- Total: ${reservas.total}
- Confirmadas: ${reservas.confirmadas || 0}

📦 INVENTARIO BAJO (stock <= mínimo):
${inventarioBajo.length === 0 ? "Ningún item con stock crítico." : inventarioBajo.map((i) => `- ${i.name} (${i.categoria}): ${i.stock_available} disponible, mínimo ${i.stock_minimum}`).join("\n")}

🍽️ PLATOS MÁS PEDIDOS HOY:
${platosPopulares.length === 0 ? "Sin pedidos registrados hoy." : platosPopulares.map((p) => `- ${p.item_name}: ${p.total_pedidos} pedidos`).join("\n")}

Incluye: resumen ejecutivo, puntos críticos a atender y recomendaciones para el turno.
`;

    const reporte = await askAI(systemPrompt, userMessage);

    const fecha = new Date().toISOString().split("T")[0];

    return res.json({
      reporte,
      fecha,
      datos: { reservas, inventarioBajo, platosPopulares },
    });
  } catch (error) {
    console.error("Error /ai/reporte-diario:", error.message);
    return res.status(500).json({ message: "No se pudo generar el reporte", error: error.message });
  }
});

// GET /ai/alertas-inventario
router.get("/alertas-inventario", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ii.name, ii.stock_available, ii.stock_minimum, ii.unit_price, ic.name as categoria
       FROM inventory_items ii
       LEFT JOIN inventory_categories ic ON ii.category_id = ic.id
       WHERE ii.stock_available <= ROUND(ii.stock_minimum * 1.5)
         AND ii.status = 'activo'
       ORDER BY ii.stock_available ASC`
    );

    const items = result.rows;

    if (items.length === 0) {
      return res.json({
        alertas: "✅ Todo el inventario está en niveles óptimos.",
        items: [],
      });
    }

    const systemPrompt =
      "Eres un experto en gestión de inventario de restaurantes. Analizas niveles de stock y generas alertas claras con prioridades y acciones concretas en español.";

    const userMessage = `
Analiza este inventario y genera un reporte de alertas con prioridades (crítico/bajo/precaución) y acciones concretas para cada item.

Inventario con stock bajo o en precaución:
${items.map((i) => `- ${i.name} (${i.categoria}): stock ${i.stock_available}, mínimo ${i.stock_minimum}, precio unitario $${i.unit_price}`).join("\n")}

Clasifica cada item y da recomendaciones específicas de reabastecimiento.
`;

    const alertas = await askAI(systemPrompt, userMessage);

    return res.json({ alertas, items });
  } catch (error) {
    console.error("Error /ai/alertas-inventario:", error.message);
    return res.status(500).json({ message: "No se pudo generar alertas", error: error.message });
  }
});

// GET /ai/sugerencias-menu
router.get("/sugerencias-menu", async (req, res) => {
  try {
    const [resInv, resMenu] = await Promise.all([
      pool.query(
        `SELECT name, stock_available
         FROM inventory_items
         WHERE stock_available > stock_minimum AND status = 'activo'
         ORDER BY stock_available DESC
         LIMIT 12`
      ),
      pool.query(
        `SELECT name, category, price
         FROM menu_items
         WHERE available = true
         LIMIT 20`
      ),
    ]);

    const ingredientes = resInv.rows;
    const menu = resMenu.rows;

    const systemPrompt =
      "Eres un chef creativo y experto en gastronomía. Sugieres especiales del día basados en ingredientes disponibles. Responde siempre en español.";

    const userMessage = `
Con base en los ingredientes disponibles y el menú actual, sugiere exactamente 3 especiales del día creativos para el restaurante.

Ingredientes disponibles (con buen stock):
${ingredientes.map((i) => `- ${i.name}: ${i.stock_available} unidades`).join("\n")}

Menú actual:
${menu.map((m) => `- ${m.name} (${m.category}): $${m.price}`).join("\n")}

Para cada especial incluye:
1. Nombre creativo del plato
2. Ingredientes principales (de la lista disponible)
3. Precio sugerido

Presenta los 3 especiales de forma atractiva y apetitosa.
`;

    const sugerencias = await askAI(systemPrompt, userMessage);

    return res.json({ sugerencias });
  } catch (error) {
    console.error("Error /ai/sugerencias-menu:", error.message);
    return res.status(500).json({ message: "No se pudo generar sugerencias", error: error.message });
  }
});

// POST /ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { mensaje, contexto } = req.body;

    const systemPrompt =
      "Eres un asistente experto para el equipo de un restaurante. Ayudas con gestión de mesas, tiempos de cocción, sustituciones de ingredientes, técnicas culinarias y operaciones diarias. Responde siempre en español, claro, breve y práctico.";

    const userMessage = contexto ? `Contexto: ${contexto}\n\n${mensaje}` : mensaje;

    const respuesta = await askAI(systemPrompt, userMessage);

    return res.json({ respuesta });
  } catch (error) {
    console.error("Error /ai/chat:", error.message);
    return res.status(500).json({ message: "No se pudo procesar el mensaje", error: error.message });
  }
});

module.exports = router;
