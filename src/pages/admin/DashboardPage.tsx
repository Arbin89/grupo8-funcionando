import { ClipboardList, ShoppingCart, Users, DollarSign } from "lucide-react";
import ResumenDiaIA from "../../components/resumenDiaIA.tsx";

const stats = [
  { label: "RESERVACIONES", value: "1243", sub: "↑ 28 hoy", icon: ClipboardList, color: "border-primary" },
  { label: "ÓRDENES", value: "5847", sub: "↑ 142 hoy", icon: ShoppingCart, color: "border-info" },
  { label: "USUARIOS ACTIVOS", value: "324", sub: "↑ 12% vs mes anterior", icon: Users, color: "border-success" },
  { label: "INGRESOS MENSUALES", value: "$45,230", sub: "↑ 8% vs mes anterior", icon: DollarSign, color: "border-warning" },
];

const quickActions = [
  { label: "Gestionar Usuarios", color: "from-primary to-info" },
  { label: "Ver Reservaciones", color: "from-destructive to-warning" },
  { label: "Inventario", color: "from-info to-primary" },
  { label: "Cocina", color: "from-success to-info" },
];

const activities = [
  { title: "Nuevo usuario registrado", desc: "Juan Pérez se registró en el sistema", time: "Hace 5 min", emoji: "👤" },
  { title: "Nueva orden completada", desc: "Orden #5847 fue procesada", time: "Hace 12 min", emoji: "📦" },
  { title: "Reserva confirmada", desc: "Mesa para 6 personas - 19:30", time: "Hace 25 min", emoji: "📋" },
  { title: "Usuario inactivo", desc: "María García no ha iniciado sesión en 30 días", time: "Hace 1 hora", emoji: "⚠️" },
  { title: "Nuevo pedido", desc: "Orden #5846 fue creada", time: "Hace 2 horas", emoji: "🛒" },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Bienvenido de vuelta, Administrador</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-card rounded-xl p-5 border-l-4 ${s.color} shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-success mt-1">{s.sub}</p>
              </div>
              <s.icon className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className={`bg-gradient-to-r ${a.color} text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">📊 Actividad Reciente</h2>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
<ResumenDiaIA />
export default DashboardPage;
