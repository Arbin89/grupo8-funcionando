import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarRange,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Users,
  TrendingUp,
  Activity,
  ChefHat,
  Package,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Reservaciones",
    value: "1,243",
    sub: "+28 hoy",
    icon: CalendarRange,
    accent: "text-indigo-400",
    ring: "ring-indigo-500/20",
    glow: "bg-indigo-500/8",
    border: "border-indigo-500/20",
    trend: "+2.3%",
  },
  {
    label: "Órdenes",
    value: "5,847",
    sub: "+142 hoy",
    icon: ShoppingCart,
    accent: "text-sky-400",
    ring: "ring-sky-500/20",
    glow: "bg-sky-500/8",
    border: "border-sky-500/20",
    trend: "+4.1%",
  },
  {
    label: "Usuarios activos",
    value: "324",
    sub: "+12% vs mes anterior",
    icon: Users,
    accent: "text-emerald-400",
    ring: "ring-emerald-500/20",
    glow: "bg-emerald-500/8",
    border: "border-emerald-500/20",
    trend: "+12%",
  },
  {
    label: "Ingresos mensuales",
    value: "$45,230",
    sub: "+8% vs mes anterior",
    icon: DollarSign,
    accent: "text-amber-400",
    ring: "ring-amber-500/20",
    glow: "bg-amber-500/8",
    border: "border-amber-500/20",
    trend: "+8%",
  },
];

const quickActions = [
  {
    label: "Gestionar usuarios",
    description: "Altas, bajas y permisos",
    path: "/admin/usuarios",
    icon: Users,
    accent: "text-indigo-400",
    border: "border-indigo-500/20",
    hover: "hover:border-indigo-500/40 hover:bg-indigo-500/5",
  },
  {
    label: "Reservaciones",
    description: "Calendario y estados",
    path: "/admin/reservaciones",
    icon: CalendarRange,
    accent: "text-sky-400",
    border: "border-sky-500/20",
    hover: "hover:border-sky-500/40 hover:bg-sky-500/5",
  },
  {
    label: "Inventario",
    description: "Stock y categorías",
    path: "/admin/inventario",
    icon: Package,
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
    hover: "hover:border-emerald-500/40 hover:bg-emerald-500/5",
  },
  {
    label: "Cocina",
    description: "Órdenes en producción",
    path: "/cocina",
    icon: ChefHat,
    accent: "text-orange-400",
    border: "border-orange-500/20",
    hover: "hover:border-orange-500/40 hover:bg-orange-500/5",
  },
];

const activities = [
  {
    title: "Nuevo usuario registrado",
    desc: "Juan Pérez se registró en el sistema",
    time: "Hace 5 min",
    badge: "Usuario",
    badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    dot: "bg-indigo-400",
  },
  {
    title: "Nueva orden completada",
    desc: "Orden #5847 fue procesada exitosamente",
    time: "Hace 12 min",
    badge: "Cocina",
    badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    dot: "bg-orange-400",
  },
  {
    title: "Reserva confirmada",
    desc: "Mesa para 6 personas — 19:30",
    time: "Hace 25 min",
    badge: "Reservas",
    badgeColor: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    dot: "bg-sky-400",
  },
  {
    title: "Usuario inactivo",
    desc: "María García no ha iniciado sesión en 30 días",
    time: "Hace 1 hora",
    badge: "Alerta",
    badgeColor: "bg-red-500/10 text-red-300 border-red-500/20",
    dot: "bg-red-400",
  },
  {
    title: "Nuevo pedido",
    desc: "Orden #5846 fue creada",
    time: "Hace 2 horas",
    badge: "Operación",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">

      {/* ── Background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[480px] w-[480px] rounded-full bg-indigo-600/6 blur-[130px]" />
        <div className="absolute right-[-4%] top-[20%] h-[380px] w-[380px] rounded-full bg-sky-600/5 blur-[120px]" />
        <div className="absolute bottom-[8%] left-[40%] h-[320px] w-[320px] rounded-full bg-emerald-600/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-5 px-5 py-8 md:px-8">

        {/* ── Page header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400/70">
              Restaurante
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Panel de Administración
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Vista ejecutiva del estado operativo en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3.5 py-2 text-sm font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <UserCheck className="h-4 w-4" />
            Sistema activo
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`group relative overflow-hidden rounded-2xl border ${s.border} bg-[#111318] p-5 transition-all hover:border-white/15`}
            >
              {/* Subtle glow on hover */}
              <div className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${s.glow}`} />

              <div className="relative flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {s.label}
                  </p>
                  <p className="mt-2 text-4xl font-black tabular-nums text-white">{s.value}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">{s.sub}</span>
                  </div>
                </div>
                <div className={`rounded-xl p-2.5 ring-1 ${s.ring} ${s.glow}`}>
                  <s.icon className={`h-5 w-5 ${s.accent}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom grid: Quick actions + Activity ── */}
        <div className="grid gap-4 lg:grid-cols-5">

          {/* Quick actions — 2 cols */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/[0.07] bg-[#111318] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-400" />
                <h2 className="text-sm font-bold text-white">Accesos rápidos</h2>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => navigate(action.path)}
                    className={`group flex flex-col gap-3 rounded-xl border ${action.border} bg-white/[0.025] p-4 text-left transition-all ${action.hover}`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10`}>
                      <action.icon className={`h-4 w-4 ${action.accent}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{action.label}</p>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity feed — 3 cols */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/[0.07] bg-[#111318] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <h2 className="text-sm font-bold text-white">Actividad reciente</h2>
                </div>
                <span className="text-xs text-slate-600">Últimas 24 horas</span>
              </div>

              <div className="relative space-y-0">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-white/[0.06]" />

                {activities.map((activity, i) => (
                  <div key={i} className="relative flex gap-4 py-3">
                    {/* Dot */}
                    <div className="relative z-10 mt-1 flex-shrink-0">
                      <span className={`block h-3.5 w-3.5 rounded-full ring-2 ring-[#111318] ${activity.dot}`} />
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-100">{activity.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{activity.desc}</p>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${activity.badgeColor}`}>
                          {activity.badge}
                        </span>
                        <span className="text-[10px] text-slate-600">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
