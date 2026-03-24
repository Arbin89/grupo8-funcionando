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