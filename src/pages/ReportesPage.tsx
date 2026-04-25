import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, ClipboardPenLine, Loader2, Send } from "lucide-react";
import { createReport } from "../services/reportService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIPOS = ["Queja", "Sugerencia", "Error en el sistema", "Otro"];

const ReportesPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "Queja",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createReport(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", type: "Queja", description: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-amber-200/70 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-600 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300/30 dark:border-white/[0.12] dark:bg-white/[0.03] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-500/50 dark:focus:ring-orange-500/20";

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

      <div className="relative z-10 mx-auto w-full max-w-5xl space-y-5 px-5 py-8 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-amber-300/70 bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </Link>

        <div className="rounded-2xl border border-amber-200/70 bg-white/85 p-6 shadow-[0_24px_60px_-28px_rgba(120,53,15,0.38)] backdrop-blur-sm dark:border-white/[0.07] dark:bg-[#111318] dark:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.8)]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-600/80 dark:text-orange-400/70">
                Atención al cliente
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Enviar reporte
              </h1>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
                Cuéntanos el problema o sugerencia y nuestro equipo lo revisará cuanto antes.
              </p>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-orange-300/60 bg-orange-100/70 px-3.5 py-2 text-sm font-semibold text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
              <ClipboardPenLine className="h-4 w-4" />
              Centro de reportes
            </div>
          </div>

          {success ? (
            <div className="rounded-xl border border-emerald-300/70 bg-emerald-50 px-5 py-6 text-center dark:border-emerald-500/25 dark:bg-emerald-500/10">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Reporte enviado correctamente</p>
              <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-200/85">Nuestro equipo lo revisará en breve.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-orange-400"
              >
                <Send className="h-4 w-4" /> Enviar otro reporte
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese su nombre"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="correo@ejemplo.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400">Tipo de reporte</label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className={inputCls}>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent className="border-amber-200/70 bg-white text-slate-900 dark:border-white/[0.12] dark:bg-[#111318] dark:text-slate-100">
                    {TIPOS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describa el problema o sugerencia"
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Enviando..." : "Enviar reporte"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
