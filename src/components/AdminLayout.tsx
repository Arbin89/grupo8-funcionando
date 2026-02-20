import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-card border-b px-6 py-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Bienvenido, Administrador Sistema</span>
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-destructive border border-destructive px-3 py-1 rounded-md hover:bg-destructive hover:text-destructive-foreground transition"
        >
          <LogOut className="w-3 h-3" />
          Cerrar sesión
        </Link>
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
