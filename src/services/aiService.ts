import { apiRequest } from "./api";

export interface ResumenDiaParams {
  fecha: string;
  registrosProcesados: number;
  completados: number;
  pendientes: number;
  observacionClave: string;
}

export async function resumenDia(
  datos: ResumenDiaParams
): Promise<{ ok: boolean; resumen: string }> {
  return apiRequest("/ai/resumen-dia", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export async function getReporteDiario(): Promise<{
  reporte: string;
  fecha: string;
  datos: any;
}> {
  return apiRequest("/ai/reporte-diario");
}

export async function getAlertasInventario(): Promise<{
  alertas: string;
  items: any[];
}> {
  return apiRequest("/ai/alertas-inventario");
}

export async function getSugerenciasMenu(): Promise<{ sugerencias: string }> {
  return apiRequest("/ai/sugerencias-menu");
}

export async function chat(
  mensaje: string,
  contexto?: string
): Promise<{ respuesta: string }> {
  return apiRequest("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ mensaje, contexto }),
  });
}
