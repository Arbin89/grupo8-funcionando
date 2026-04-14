import { useState } from "react";
import { resumenDia } from "../services/aiService";

const ResumenDiaIA = () => {
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState("");

  const handleGenerarResumen = async () => {
    setLoading(true);
    setResumen("");

    try {
      const response = await resumenDia({
        fecha: new Date().toLocaleDateString("es-DO"),
        registrosProcesados: 42,
        completados: 31,
        pendientes: 11,
        observacionClave: "Hubo mayor actividad en horas de la tarde.",
      });

      if (response.ok && response.resumen) {
        setResumen(response.resumen);
      } else {
        setResumen("No se pudo generar el resumen.");
      }
    } catch (error) {
      setResumen("Ocurrió un error al generar el resumen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-2">Resumen del día con IA</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Genera un resumen ejecutivo automático con base en la actividad del día.
      </p>

      <button
        onClick={handleGenerarResumen}
        disabled={loading}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Generando..." : "Generar resumen"}
      </button>

      <div className="mt-4 rounded-lg border bg-background p-4 min-h-[110px]">
        <p className="text-sm whitespace-pre-line">
          {resumen || "Aquí aparecerá el resumen generado por IA."}
        </p>
      </div>
    </div>
  );
};

export default ResumenDiaIA