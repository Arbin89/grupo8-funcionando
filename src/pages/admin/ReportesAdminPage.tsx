import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import {
    getReports,
    updateReport,
    deleteReport,
    Report,
} from "../../services/reportService";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pendiente: { label: "Pendiente", color: "bg-warning/10 text-warning", icon: Clock },
    revisado: { label: "Revisado", color: "bg-info/10 text-info", icon: AlertCircle },
    resuelto: { label: "Resuelto", color: "bg-success/10 text-success", icon: CheckCircle },
};

const ReportesAdminPage = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("todos");
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getReports();
            setReports(data);
            setError("");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error al cargar reportes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = filter === "todos"
        ? reports
        : reports.filter((r) => r.status === filter);

    const handleStatusChange = async (report: Report, newStatus: string) => {
        try {
            setUpdatingId(report.id);
            await updateReport(report.id, { ...report, status: newStatus });
            load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error al actualizar");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteReport(id);
            setDeletingId(null);
            load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error al eliminar");
            setDeletingId(null);
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString("es-DO");

    return (
        <div className="space-y-6">
            <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition"
            >
                <ArrowLeft className="w-4 h-4" /> Volver
            </Link>

            <div>
                <h1 className="text-3xl font-bold">Gestión de Reportes</h1>
                <p className="text-muted-foreground">Revisa y gestiona los reportes enviados por usuarios</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">
                    {error}
                </div>
            )}

            {/* Filtros */}
            <div className="flex gap-3 flex-wrap">
                {["todos", "pendiente", "revisado", "resuelto"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${filter === s
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-border hover:bg-muted"
                            }`}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            <div className="bg-card rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Reportes ({filtered.length})</h2>
                {loading ? (
                    <p className="text-muted-foreground text-sm">Cargando...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay reportes para mostrar.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="py-2 pr-4 font-semibold">Nombre</th>
                                    <th className="py-2 pr-4 font-semibold">Correo</th>
                                    <th className="py-2 pr-4 font-semibold">Tipo</th>
                                    <th className="py-2 pr-4 font-semibold">Descripción</th>
                                    <th className="py-2 pr-4 font-semibold">Fecha</th>
                                    <th className="py-2 pr-4 font-semibold">Estado</th>
                                    <th className="py-2 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => {
                                    const st = statusConfig[r.status] ?? statusConfig["pendiente"];
                                    const Icon = st.icon;
                                    return (
                                        <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition">
                                            <td className="py-3 pr-4 font-medium">{r.name}</td>
                                            <td className="py-3 pr-4 text-muted-foreground">{r.email}</td>
                                            <td className="py-3 pr-4">{r.type}</td>
                                            <td className="py-3 pr-4 max-w-xs text-muted-foreground truncate">{r.description}</td>
                                            <td className="py-3 pr-4 text-muted-foreground">{formatDate(r.created_at)}</td>
                                            <td className="py-3 pr-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${st.color}`}>
                                                    <Icon className="w-3 h-3" />
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex gap-1 flex-wrap">
                                                    {r.status !== "revisado" && (
                                                        <button
                                                            onClick={() => handleStatusChange(r, "revisado")}
                                                            disabled={updatingId === r.id}
                                                            className="text-xs border border-blue-400 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50 transition disabled:opacity-50"
                                                        >
                                                            Revisado
                                                        </button>
                                                    )}
                                                    {r.status !== "resuelto" && (
                                                        <button
                                                            onClick={() => handleStatusChange(r, "resuelto")}
                                                            disabled={updatingId === r.id}
                                                            className="text-xs border border-green-500 text-green-600 px-2 py-1 rounded-md hover:bg-green-50 transition disabled:opacity-50"
                                                        >
                                                            Resuelto
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setDeletingId(r.id)}
                                                        className="text-xs border border-destructive text-destructive px-2 py-1 rounded-md hover:bg-red-50 transition"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
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

            {/* Modal confirmar borrado */}
            {deletingId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
                        <h3 className="text-lg font-bold">Confirmar eliminación</h3>
                        <p className="text-sm text-muted-foreground">
                            ¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 text-sm rounded-lg border hover:bg-muted transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deletingId)}
                                className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportesAdminPage;
