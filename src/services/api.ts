const API_URL = "http://localhost:3000";

// Obtiene el token guardado al iniciar sesión
const getToken = () => localStorage.getItem("token");

// Función genérica para hacer peticiones al backend
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};