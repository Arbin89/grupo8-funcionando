const API_URL = "http://localhost:3000";

// Tipo de respuesta que devuelve el backend al iniciar sesión
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    role: string;
    status: string;
  };
}

// Función para hacer login contra el backend
export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
};