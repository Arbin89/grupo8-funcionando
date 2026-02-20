import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Reservation = {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  time: string;
  people: number;
  notes?: string;
  status: "CONFIRMADA" | "PENDIENTE" | "CANCELADA";
};

const reservations: Reservation[] = [
  { id: "#1001", date: "24/2/2026", name: "Juan García", email: "juan@example.com", phone: "+34 612 345 678", time: "19:30", people: 4, notes: "Cumpleaños", status: "CONFIRMADA" },
  { id: "#1002", date: "25/2/2026", name: "María López", email: "maria@example.com", phone: "+34 698 765 432", time: "13:00", people: 2, status: "CONFIRMADA" },
  { id: "#1003", date: "26/2/2026", name: "Carlos Rodríguez", email: "carlos@example.com", phone: "+34 654 321 987", time: "20:00", people: 6, status: "PENDIENTE" },
  { id: "#1004", date: "27/2/2026", name: "Ana Martínez", email: "ana@example.com", phone: "+34 623 456 789", time: "19:00", people: 3, status: "CONFIRMADA" },
  { id: "#1005", date: "28/2/2026", name: "Pedro Sánchez", email: "pedro@example.com", phone: "+34 645 789 123", time: "13:30", people: 8, status: "CANCELADA" },
];

const statusColors: Record<string, string> = {
  CONFIRMADA: "bg-success/10 text-success",
  PENDIENTE: "bg-warning/10 text-warning",
  CANCELADA: "bg-destructive/10 text-destructive",
};

const ReservationsPage = () => {
  const [filter, setFilter] = useState("Todas las reservaciones");

  const filtered = filter === "Todas las reservaciones"
    ? reservations
    : reservations.filter((r) => r.status === filter.toUpperCase());

  return (
    <div className="space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Gestión de Reservaciones</h1>
        <p className="text-muted-foreground">Administra todas las reservaciones del restaurante</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Reservaciones Activas</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
            Nueva Reservación
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background"
          >
            <option>Todas las reservaciones</option>
            <option>CONFIRMADA</option>
            <option>PENDIENTE</option>
            <option>CANCELADA</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{r.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[r.status]}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{r.date}</p>
              <div className="space-y-1 text-sm">
                <div className="flex gap-2"><span className="text-muted-foreground w-16">Nombre</span><span className="font-medium">{r.name}</span></div>
                <div className="flex gap-2"><span className="text-muted-foreground w-16">Email</span><span>{r.email}</span></div>
                <div className="flex gap-2"><span className="text-muted-foreground w-16">Teléfono</span><span>{r.phone}</span></div>
                <div className="flex gap-2"><span className="text-muted-foreground w-16">Hora</span><span>{r.time}</span></div>
                <div className="flex gap-2"><span className="text-muted-foreground w-16">Personas</span><span>{r.people} personas</span></div>
                {r.notes && <div className="flex gap-2"><span className="text-muted-foreground w-16">Notas</span><span>{r.notes}</span></div>}
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 text-xs border border-primary text-primary px-3 py-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition">Ver Detalles</button>
                <button className="flex-1 text-xs border border-destructive text-destructive px-3 py-1.5 rounded-md hover:bg-destructive hover:text-destructive-foreground transition">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
