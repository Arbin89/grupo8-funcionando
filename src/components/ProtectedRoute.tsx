import { Navigate } from "react-router-dom";
import { getToken, isTokenExpired, clearSession, getUserRole } from "../services/tokenService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = getToken();

  // Si no hay token o el token está expirado, redirigir a login
  if (!token || isTokenExpired(token)) {
    if (token) {
      // Si el token existe pero está expirado, limpiar la sesión
      clearSession();
    }
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige roles específicos, valida autorización.
  if (allowedRoles && allowedRoles.length > 0) {
    const role = getUserRole();
    const isAllowed = !!role && allowedRoles.map((r) => r.toLowerCase()).includes(role);
    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;