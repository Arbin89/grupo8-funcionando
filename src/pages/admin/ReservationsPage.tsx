import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  Reservation,
} from "../../services/reservationService";

const statusColors: Record<string, string> = {
  confirmada: "bg-success/10 text-success",
  pendiente: "bg-warning/10 text-warning",
  cancelada: "bg-destructive/10 text-destructive",
};

const ReservationsPage = () => {
  // Lista real de reservaciones obtenidas desde backend
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Estado del filtro
  const [filter, setFilter] = useState("todas");

  // Error general
  const [error, setError] = useState("");

  // Indicador de carga
  const [loading, setLoading] = useState(true);

  // Mostrar u ocultar formulario
  const [showForm, setShowForm] = useState(false);

  // Indica si estamos editando
  const [editingReservationId, setEditingReservationId] = useState<number | null>(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
    notes: "",
    status: "pendiente",
  });

  // Cargar reservaciones al abrir la página
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getReservations();
      setReservations(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar reservaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filtra por estado
  const filtered =
    filter === "todas"
      ? reservations
      : reservations.filter((r) => r.status === filter);

  // Formatea fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-DO");
  };

  // Formatea hora
  const formatTime = (timeString: string) => {
    return timeString?.slice(0, 5);
  };

  // Maneja cambios en inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "people" ? Number(value) : value,
    });
  };

  // Limpia el formulario
  const resetForm = () => {
    setFormData({
      customer_name: "",
      email: "",
      phone: "",
      reservation_date: "",
      reservation_time: "",
      people: 1,
      notes: "",
      status: "pendiente",
    });
    setEditingReservationId(null);
    setShowForm(false);
  };

  // Carga datos de una reservación en el formulario para editar
  const handleEdit = (reservation: Reservation) => {
    setEditingReservationId(reservation.id);
    setShowForm(true);
    setFormData({
      customer_name: reservation.customer_name,
      email: reservation.email || "",
      phone: reservation.phone || "",
      reservation_date: reservation.reservation_date?.split("T")[0] || reservation.reservation_date,
      reservation_time: reservation.reservation_time?.slice(0, 5) || reservation.reservation_time,
      people: reservation.people,
      notes: reservation.notes || "",
      status: reservation.status,
    });
  };

  // Crear o actualizar reservación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      if (editingReservationId) {
        await updateReservation(editingReservationId, formData);
      } else {
        await createReservation(formData);
      }

      await fetchReservations();
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar la reservación");
    }
  };

  // Eliminar reservación
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta reservación?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      await deleteReservation(id);
      await fetchReservations();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar la reservación");
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Gestión de Reservaciones</h1>
        <p className="text-muted-foreground">
          Administra todas las reservaciones del restaurante
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Reservaciones Activas</h2>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Nueva Reservación
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                name="reservation_date"
                value={formData.reservation_date}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              <input
                type="time"
                name="reservation_time"
                value={formData.reservation_time}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Personas</label>
              <input
                type="number"
                name="people"
                min={1}
                value={formData.people}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                {editingReservationId ? "Actualizar Reservación" : "Guardar Reservación"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-input px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="flex gap-3 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background"
          >
            <option value="todas">Todas las reservaciones</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        {loading ? (
          <div className="py-6 text-sm text-muted-foreground">
            Cargando reservaciones...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((r) => (
              <div key={r.id} className="border rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">#{r.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      statusColors[r.status] || "bg-muted text-foreground"
                    }`}
                  >
                    {r.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {formatDate(r.reservation_date)}
                </p>

                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-16">Nombre</span>
                    <span className="font-medium">{r.customer_name}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-16">Email</span>
                    <span>{r.email}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-16">Teléfono</span>
                    <span>{r.phone}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-16">Hora</span>
                    <span>{formatTime(r.reservation_time)}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-16">Personas</span>
                    <span>{r.people} personas</span>
                  </div>

                  {r.notes && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-16">Notas</span>
                      <span>{r.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="flex-1 text-xs border border-primary text-primary px-3 py-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="flex-1 text-xs border border-destructive text-destructive px-3 py-1.5 rounded-md hover:bg-destructive hover:text-destructive-foreground transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="col-span-full text-center text-muted-foreground py-6">
                No hay reservaciones para mostrar.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;