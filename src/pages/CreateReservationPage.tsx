import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { createReservation } from "../services/reservationService";

const CreateReservationPage = () => {
  // Estado del formulario
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

  // Estado para mostrar errores
  const [error, setError] = useState("");

  // Estado para mostrar éxito
  const [success, setSuccess] = useState("");

  // Estado para bloquear el botón mientras se envía
  const [loading, setLoading] = useState(false);

  // Maneja cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "people" ? Number(value) : value,
    });
  };

  // Envía la reserva al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      await createReservation(formData);

      setSuccess("Reservación creada correctamente.");

      // Limpiar formulario
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
    } catch (err: any) {
      setError(err.message || "No se pudo crear la reservación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">
            Crear Reserva
          </h2>

          <p className="text-muted-foreground mb-6 text-center">
            Completa el formulario para reservar tu mesa
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="customer_name"
              >
                Nombre
              </label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="tucorreo@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Tu teléfono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="people">
                Personas
              </label>
              <input
                id="people"
                name="people"
                type="number"
                min="1"
                max="20"
                value={formData.people}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="¿Cuántas personas?"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="reservation_date"
              >
                Fecha
              </label>
              <input
                id="reservation_date"
                name="reservation_date"
                type="date"
                value={formData.reservation_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="reservation_time"
              >
                Hora
              </label>
              <input
                id="reservation_time"
                name="reservation_time"
                type="time"
                value={formData.reservation_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="notes">
                Notas
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Ej: cumpleaños, mesa cerca de la ventana..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Reservar"}
            </button>
          </form>

          <Link
            to="/"
            className="block mt-6 text-center text-indigo-500 hover:underline text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground bg-foreground text-background">
        © 2026 SIGER - Sistema de Gestión de Restaurante
      </footer>
    </div>
  );
};

export default CreateReservationPage;