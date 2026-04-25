import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import {
  getReports,
  updateReport,
  deleteReport,
  Report,
} from "../../services/reportService";

// ─── Config ────────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; cls: string; dot: string; icon: React.ElementType }> = {
  pendiente: { label: "Pendiente", cls: "border-amber-500/25 bg-amber-500/10 text-amber-300",     dot: "bg-amber-400",   icon: Clock        },
  revisado:  { label: "Revisado",  cls: "border-sky-500/25 bg-sky-500/10 text-sky-300",           dot: "bg-sky-400",     icon: AlertCircle  },
  resuelto:  { label: "Resuelto",  cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-400", icon: CheckCircle  },
};

const TYPE_CLS: Record<string, string> = {
  Queja:              "border-red-500/25 bg-red-500/10 text-red-300",
  Sugerencia:         "border-sky-500/25 bg-sky-500/10 text-sky-300",
  "Error en el sistema": "border-amber-500/25 bg-amber-500/10 text-amber-300",
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("es-DO");

// ─── Component ────────────────────────────────────────────────────────────────

const ReportesAdminPage = () => {
  const [reports, setReports]       = useState<Report[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState("todos");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    try { setLoading(true); setReports(await getReports()); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Error al cargar reportes"); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const filtered = filter === "todos" ? reports : reports.filter((r) => r.status === filter);

  const handleStatusChange = async (report: Report, newStatus: string) => {
    try {
      setUpdatingId(report.id);
      await updateReport(report.id, { ...report, status: newStatus });
      void load();
    } catch (e) { setError(e instanceof Error ? e.message : "Error al actualizar"); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteReport(id); setDeletingId(null); void load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar"); setDeletingId(null); }
  };

  const FILTERS = ["todos", "pendiente", "revisado", "resuelto"];

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[420px] w-[420px] rounded-full bg-amber-600/5 blur-[130px]" />
        <div className="absolute right-[-4%] bottom-[10%] h-[360px] w-[360px] rounded-full bg-red-600/4 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-5 px-5 py-8 md:px-8">

        <Link to="/admin" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al panel
        </Link>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400/70">Administración</p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Gestión de Reportes</h1>
          <p className="mt-1 text-sm text-slate-500">Revisa y gestiona los reportes enviados por usuarios.</p>
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === f ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30" : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"}`}>
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-600">{filtered.length} reporte{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111318]">
          <div className="border-b border-white/[0.06] px-5 py-3.5">
            <p className="text-sm font-bold text-white">Reportes</p>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
              <span className="text-sm">Cargando reportes…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-600">
              No hay reportes para mostrar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] text-left">
                    {["Nombre", "Tipo", "Descripción", "Fecha", "Estado", "Acciones"].map((h) => (
                      <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const st = STATUS_META[r.status] ?? STATUS_META.pendiente;
                    const Icon = st.icon;
                    const isUpdating = updatingId === r.id;
                    return (
                      <tr key={r.id} className="border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.02]">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-100">{r.name}</p>
                          <p className="text-xs text-slate-600">{r.email}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TYPE_CLS[r.type] ?? "border-slate-600/30 bg-slate-700/20 text-slate-400"}`}>
                            {r.type}
                          </span>
                        </td>
                        <td className="max-w-[240px] truncate px-5 py-3.5 text-slate-500">{r.description}</td>
                        <td className="px-5 py-3.5 text-slate-500">{formatDate(r.created_at)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>
                            <Icon className="h-3 w-3" />{st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {r.status !== "revisado" && (
                              <button onClick={() => void handleStatusChange(r, "revisado")} disabled={isUpdating} className="rounded-lg border border-sky-500/25 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20 disabled:opacity-50">
                                Revisado
                              </button>
                            )}
                            {r.status !== "resuelto" && (
                              <button onClick={() => void handleStatusChange(r, "resuelto")} disabled={isUpdating} className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50">
                                Resuelto
                              </button>
                            )}
                            <button onClick={() => setDeletingId(r.id)} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#13151c] p-6 shadow-2xl">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10"><Trash2 className="h-4 w-4 text-red-400" /></div>
              <h3 className="text-base font-black text-white">Eliminar reporte</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">Esta acción no se puede deshacer.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeletingId(null)} className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05]">Cancelar</button>
              <button onClick={() => void handleDelete(deletingId)} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportesAdminPage;