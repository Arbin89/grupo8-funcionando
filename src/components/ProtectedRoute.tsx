import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  console.log("ProtectedRoute token:", token);

  if (!token) {
    console.log("No hay token, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  console.log("Token encontrado, dejando pasar");
  return <>{children}</>;
};

export default ProtectedRoute;