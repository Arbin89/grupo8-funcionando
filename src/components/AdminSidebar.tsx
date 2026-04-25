import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSession } from "../services/tokenService";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Package,
  ChefHat,
  FileBarChart,
  LogOut,
  UtensilsCrossed,
  BookOpen,
  Sparkles,
  Bot
} from "lucide-react";

const sidebarSections = [
  {
    title: "INICIO",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    ],
  },
  {
    title: "GESTIÓN",
    items: [
      { label: "Usuarios", icon: Users, path: "/admin/usuarios" },
      { label: "Reservaciones", icon: CalendarCheck, path: "/admin/reservaciones" },
      { label: "Inventario", icon: Package, path: "/admin/inventario" },
      { label: "Menú", icon: BookOpen, path: "/admin/menu" },
      { label: "Cocina", icon: ChefHat, path: "/cocina" },
    ],
  },
  {
    title: "REPORTES",
    items: [
      { label: "Reportes", icon: FileBarChart, path: "/admin/reportes" },
    ],
  },
  {
    title: "INTELIGENCIA ARTIFICIAL",
    items: [
      { label: "Asistente IA", icon: Sparkles, path: "/admin/ia" },
      { label: "Test IA", icon: Bot, path: "/admin/ia-test" },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar w-[180px] min-h-screen flex flex-col text-sidebar-foreground">
      <div className="p-4 flex items-center gap-2 font-bold text-lg border-b border-sidebar-foreground/10">
        <UtensilsCrossed className="w-5 h-5" />
        SIGER Admin
      </div>

      <div className="flex-1 py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-4 text-[10px] font-semibold tracking-wider text-sidebar-foreground/40 mb-2">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isActive
                      ? "text-sidebar-foreground bg-sidebar-accent/20 border-l-2 border-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5"
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-foreground/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div>
            <p className="text-xs text-sidebar-foreground/50">Administrador</p>
            <p className="text-sm font-medium">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-destructive text-destructive-foreground text-sm py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
