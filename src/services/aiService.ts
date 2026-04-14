import { apiRequest } from "./api";

export interface ResumenDiaPayload {
  fecha: string;
  registrosProcesados: number;
  completados: number;
  pendientes: number;
  observacionClave: string;
}

export interface ResumenDiaResponse {
  ok: boolean;
  resumen?: string;
  message?: string;
}

export const generarResumenDia = async (
  data: ResumenDiaPayload
): Promise<ResumenDiaResponse> => {
  return await apiRequest("/ai/resumen-dia", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getReporteDiario = async () => {
  return await apiRequest("/ai/reporte-diario");
};

export const getAlertasInventario = async () => {
  return await apiRequest("/ai/alertas-inventario");
};

export const getSugerenciasMenu = async () => {
  return await apiRequest("/ai/sugerencias-menu");
};

export const chat = async (mensaje: string, contexto?: string) => {
  return await apiRequest("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ mensaje, contexto }),
  });
};