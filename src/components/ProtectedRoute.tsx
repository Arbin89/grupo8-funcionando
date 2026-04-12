import { Navigate } from "react-router-dom";
import { getToken, isTokenExpired, clearSession } from "../services/tokenService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getToken();

  // Si no hay token o el token está expirado, redirigir a login
  if (!token || isTokenExpired(token)) {
    if (token) {
      // Si el token existe pero está expirado, limpiar la sesión
      clearSession();
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;