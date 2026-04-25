import { Link, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  Bot,
  BookOpen,
  CalendarCheck,
  ChefHat,
  LayoutDashboard,
  FileBarChart,
  Sparkles,
  UtensilsCrossed,
  Package,
  Users,
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
      { label: "Usuarios",      icon: Users,        path: "/admin/usuarios" },
      { label: "Reservaciones", icon: CalendarCheck, path: "/admin/reservaciones" },
      { label: "Inventario",    icon: Package,       path: "/admin/inventario" },
      { label: "Menú",          icon: BookOpen,      path: "/admin/menu" },
      { label: "Cocina",        icon: ChefHat,       path: "/cocina" },
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
      { label: "Test IA",      icon: Bot,      path: "/admin/ia-test" },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="sticky top-[57px] flex h-[calc(100vh-57px)] w-[240px] shrink-0 flex-col overflow-y-auto border-r border-amber-200/70 bg-amber-50 dark:border-white/[0.07] dark:bg-[#0d0f14]">

      {/* Brand strip */}
      <div className="border-b border-amber-200/70 px-5 py-4 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5 text-base font-black tracking-tight text-slate-900 dark:text-white">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 ring-1 ring-orange-500/25">
            <UtensilsCrossed className="h-3.5 w-3.5 text-orange-400" />
          </div>
          SIGER Admin
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          <BadgeCheck className="h-3 w-3" />
          Acceso administrativo
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="mb-1.5 px-4 text-[10px] font-bold tracking-[0.14em] text-amber-900/70 dark:text-slate-600">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mx-2 mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-orange-500/12 text-white ring-1 ring-orange-500/20"
                      : "text-slate-700 hover:bg-amber-100/70 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/[0.04] dark:hover:text-slate-200"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      isActive ? "text-orange-400" : "text-slate-500 dark:text-slate-600"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom subtle line */}
      <div className="border-t border-amber-200/70 px-4 py-3 dark:border-white/[0.05]">
        <p className="text-[10px] text-slate-500 dark:text-slate-700">SIGER · Panel Admin</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
