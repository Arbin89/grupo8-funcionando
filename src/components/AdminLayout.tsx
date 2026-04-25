import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";
import { LogOut } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  // Cierra sesión borrando datos guardados
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-card border-b px-6 py-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Bienvenido, Administrador Sistema
        </span>

 
      </div>

      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-background overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;