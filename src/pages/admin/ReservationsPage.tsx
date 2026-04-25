import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, CalendarDays, Users, Clock, X, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  Reservation,
} from "../../services/reservationService";

// ─── Constants ────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition";

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  confirmada: { label: "Confirmada", cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-400" },
  pendiente:  { label: "Pendiente",  cls: "border-amber-500/25 bg-amber-500/10 text-amber-300",    dot: "bg-amber-400"   },
  cancelada:  { label: "Cancelada",  cls: "border-red-500/25 bg-red-500/10 text-red-400",           dot: "bg-red-400"     },
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("es-DO");
const formatTime = (t: string)  => t?.slice(0, 5);

const emptyForm = () => ({
  customer_name: "", email: "", phone: "", reservation_date: "",
  reservation_time: "", people: 1, notes: "", status: "pendiente",
});

// ─── Component ────────────────────────────────────────────────────────────────

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter]             = useState("todas");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState<number | null>(null);
  const [deletingRes, setDeletingRes]   = useState<Reservation | null>(null);
  const [saving, setSaving]             = useState(false);
  const [form, setForm]                 = useState(emptyForm());

  const fetchReservations = async () => {
    try { setLoading(true); setError(""); setReservations(await getReservations()); }
    catch (e) { setError(e instanceof Error ? e.message : "Error al cargar reservaciones"); }
    finally { setLoading(false); }
  };

  useEffect(() => { void fetchReservations(); }, []);

  const filtered = filter === "todas" ? reservations : reservations.filter((r) => r.status === filter);

  const resetForm = () => { setForm(emptyForm()); setEditingId(null); setShowForm(false); };

  const handleEdit = (r: Reservation) => {
    setEditingId(r.id);
    setForm({
      customer_name: r.customer_name, email: r.email || "", phone: r.phone || "",
      reservation_date: r.reservation_date?.split("T")[0] || r.reservation_date,
      reservation_time: r.reservation_time?.slice(0, 5) || r.reservation_time,
      people: r.people, notes: r.notes || "", status: r.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      editingId ? await updateReservation(editingId, form) : await createReservation(form);
      await fetchReservations(); resetForm();
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingRes) return;
    try { await deleteReservation(deletingRes.id); setDeletingRes(null); await fetchReservations(); }
    catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar"); setDeletingRes(null); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: k === "people" ? Number(e.target.value) : e.target.value });

  const FILTERS = ["todas", "confirmada", "pendiente", "cancelada"];

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[420px] w-[420px] rounded-full bg-sky-600/5 blur-[130px]" />
        <div className="absolute right-[-4%] bottom-[10%] h-[360px] w-[360px] rounded-full bg-emerald-600/4 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-5 px-5 py-8 md:px-8">

        <Link to="/admin" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al panel
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400/70">Administración</p>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Reservaciones</h1>
            <p className="mt-1 text-sm text-slate-500">Administra agenda, estados y asignaciones de mesas.</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400">
            <Plus className="h-4 w-4" /> Nueva reservación
          </button>
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {/* Inline form */}
        {showForm && (
          <div className="rounded-2xl border border-white/[0.09] bg-[#111318] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-white">{editingId ? "Editar reservación" : "Nueva reservación"}</h3>
              <button onClick={resetForm} className="rounded-lg border border-white/[0.08] p-1.5 text-slate-500 hover:text-slate-200 transition"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre *</label><input className={inputCls} value={form.customer_name} onChange={f("customer_name")} required /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Correo</label><input type="email" className={inputCls} value={form.email} onChange={f("email")} /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Teléfono</label><input className={inputCls} value={form.phone} onChange={f("phone")} /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha *</label><input type="date" className={inputCls} value={form.reservation_date} onChange={f("reservation_date")} required /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Hora *</label><input type="time" className={inputCls} value={form.reservation_time} onChange={f("reservation_time")} required /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Personas *</label><input type="number" min={1} className={inputCls} value={form.people} onChange={f("people")} required /></div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Estado</label>
                <select className={inputCls} value={form.status} onChange={f("status")}>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="md:col-span-2"><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Notas</label><textarea rows={2} className={inputCls} value={form.notes} onChange={f("notes")} /></div>
              <div className="flex gap-2 md:col-span-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-50">
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {saving ? "Guardando…" : editingId ? "Actualizar" : "Crear reservación"}
                </button>
                <button type="button" onClick={resetForm} className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 hover:bg-white/[0.05] transition">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === f ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30" : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"}`}>
              {f}
            </button>
          ))}
          <span className="ml-auto self-center text-xs text-slate-600">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
            <span className="text-sm">Cargando reservaciones…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.07] text-slate-600">
            <CalendarDays className="h-9 w-9" />
            <p className="text-sm">No hay reservaciones para este filtro.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => {
              const st = STATUS_META[r.status] ?? STATUS_META.pendiente;
              return (
                <div key={r.id} className="rounded-2xl border border-white/[0.07] bg-[#111318] p-5 shadow-md shadow-black/30 transition hover:border-white/15">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-white">{r.customer_name}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-600">#{r.id}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-slate-400"><CalendarDays className="h-3.5 w-3.5" />{formatDate(r.reservation_date)}</div>
                    <div className="flex items-center gap-2 text-slate-400"><Clock className="h-3.5 w-3.5" />{formatTime(r.reservation_time)}</div>
                    <div className="flex items-center gap-2 text-slate-400"><Users className="h-3.5 w-3.5" />{r.people} personas</div>
                    {r.email && <p className="text-slate-500 text-xs">{r.email}</p>}
                    {r.notes && <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80">💬 {r.notes}</div>}
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-3.5">
                    <button onClick={() => handleEdit(r)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-xs font-semibold text-slate-400 transition hover:border-orange-500/30 hover:text-orange-300">
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                    <button onClick={() => setDeletingRes(r)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-xs font-semibold text-slate-400 transition hover:border-red-500/30 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deletingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#13151c] p-6 shadow-2xl">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10"><Trash2 className="h-4 w-4 text-red-400" /></div>
              <h3 className="text-base font-black text-white">Eliminar reservación</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">¿Seguro que deseas eliminar la reservación de <span className="font-semibold text-white">{deletingRes.customer_name}</span>?</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeletingRes(null)} className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05]">Cancelar</button>
              <button onClick={() => void handleDelete()} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;