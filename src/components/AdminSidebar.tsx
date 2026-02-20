import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Package,
  ChefHat,
  FileBarChart,
  LogOut,
  UtensilsCrossed,
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
      { label: "Cocina", icon: ChefHat, path: "/admin/cocina" },
    ],
  },
  {
    title: "REPORTES",
    items: [
      { label: "Reportes", icon: FileBarChart, path: "/admin/reportes" },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="admin-sidebar w-[180px] min-h-screen flex flex-col text-primary-foreground">
      <div className="p-4 flex items-center gap-2 font-bold text-lg border-b border-primary-foreground/10">
        <UtensilsCrossed className="w-5 h-5" />
        SIGER Admin
      </div>

      <div className="flex-1 py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-4 text-[10px] font-semibold tracking-wider text-primary-foreground/40 mb-2">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary-foreground bg-primary-foreground/10 border-l-2 border-primary-foreground"
                      : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"
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

      <div className="p-4 border-t border-primary-foreground/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div>
            <p className="text-xs text-primary-foreground/50">Administrador</p>
            <p className="text-sm font-medium">Admin</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full bg-destructive text-destructive-foreground text-sm py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
