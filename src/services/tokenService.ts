// Servicio para gestionar tokens y refrescos automáticos

export interface TokenPayload {
  id: number;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Decodifica un JWT sin verificar la firma (solo para leer el payload)
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    return null;
  }
};

// Verifica si el token está próximo a expirar (dentro de 1 minuto)
export const isTokenExpiring = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const expiresAt = decoded.exp * 1000; // convertir a milisegundos
  const now = Date.now();
  const oneMinute = 60 * 1000;
  
  return (expiresAt - now) < oneMinute;
};

// Verifica si el token ya expiró
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const expiresAt = decoded.exp * 1000;
  const now = Date.now();
  
  return now > expiresAt;
};

// Obtiene el token del localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Guarda el token en localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token.trim()); // Importante: eliminar espacios
};

// Limpia el token del localStorage
export const clearToken = (): void => {
  localStorage.removeItem("token");
};

// Obtiene datos del usuario del localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Guarda datos del usuario en localStorage
export const saveUser = (user: any): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Limpia datos del usuario
export const clearUser = (): void => {
  localStorage.removeItem("user");
};

// Limpia toda la sesión
export const clearSession = (): void => {
  clearToken();
  clearUser();
};
