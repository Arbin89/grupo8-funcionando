import { getToken, isTokenExpired, clearSession } from "./tokenService";

const API_URL = "http://localhost:3000";

// Función genérica para hacer peticiones al backend
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getToken();

  // Verificar si el token está expirado
  if (token && isTokenExpired(token)) {
    clearSession();
    throw new Error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  try {
    const data = await response.json();

    // Si el backend devuelve 401, significa que el token es inválido
    if (response.status === 401) {
      clearSession();
      throw new Error(
        data.message || 
        "Token inválido o expirado. Por favor, inicia sesión nuevamente."
      );
    }

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status} en la petición`);
    }

    return data;
  } catch (error) {
    // Si no se puede parsear JSON, es un error del servidor
    if (error instanceof SyntaxError) {
      throw new Error("Error al conectar con el servidor");
    }
    throw error;
  }
};