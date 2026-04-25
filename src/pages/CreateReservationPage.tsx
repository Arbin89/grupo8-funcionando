import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Send,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { createReservation } from "../services/reservationService";

const CreateReservationPage = () => {
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "people" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      await createReservation(formData);

      setSuccess("Reservación creada correctamente.");
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

  const inputCls =
    "w-full rounded-xl border border-amber-200/70 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-600 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300/30 dark:border-white/[0.12] dark:bg-white/[0.03] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-500/50 dark:focus:ring-orange-500/20";

  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400";

  return (
    <div className="relative min-h-screen bg-[#fffdf7] text-slate-900 dark:bg-[#0a0c10] dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fff4d6_0%,#fff9eb_34%,#ffffff_70%)] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_top_left,#141a24_0%,#0d121b_36%,#0a0c10_72%)]" />
        <div className="absolute left-[-10%] top-[-6%] h-[460px] w-[460px] rounded-full bg-amber-500/18 blur-[140px] dark:bg-indigo-600/6" />
        <div className="absolute right-[-6%] top-[18%] h-[360px] w-[360px] rounded-full bg-yellow-400/15 blur-[120px] dark:bg-sky-600/5" />
        <div className="absolute bottom-[8%] left-[38%] h-[310px] w-[310px] rounded-full bg-orange-400/12 blur-[110px] dark:bg-emerald-600/4" />
        <div
          className="absolute inset-0 opacity-[0.018] dark:opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px,transparent 1px),linear-gradient(90deg,#0f172a 1px,transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-5 py-8 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-amber-300/70 bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </Link>

        <div className="mt-5 rounded-2xl border border-amber-200/70 bg-white/85 p-6 shadow-[0_24px_60px_-28px_rgba(120,53,15,0.38)] backdrop-blur-sm dark:border-white/[0.07] dark:bg-[#111318] dark:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.8)]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-600/80 dark:text-orange-400/70">
                Reservaciones
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Reservar mesa
              </h1>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
                Completa el formulario para confirmar tu visita al restaurante.
              </p>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-orange-300/60 bg-orange-100/70 px-3.5 py-2 text-sm font-semibold text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
              <CalendarDays className="h-4 w-4" />
              Agenda de reservas
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="customer_name">Nombre</label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="email">Correo</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Tu teléfono"
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="people">Personas</label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="people"
                    name="people"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.people}
                    onChange={handleChange}
                    className={`${inputCls} pl-10`}
                    placeholder="¿Cuántas personas?"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="reservation_date">Fecha</label>
                <input
                  id="reservation_date"
                  name="reservation_date"
                  type="date"
                  value={formData.reservation_date}
                  onChange={handleChange}
                  className={`${inputCls} dark:[color-scheme:dark]`}
                  required
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="reservation_time">Hora</label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="reservation_time"
                    name="reservation_time"
                    type="time"
                    value={formData.reservation_time}
                    onChange={handleChange}
                    className={`${inputCls} pl-10 dark:[color-scheme:dark]`}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="notes">Notas</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className={inputCls}
                placeholder="Ej: cumpleaños, mesa cerca de la ventana..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Guardando..." : "Reservar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateReservationPage;
