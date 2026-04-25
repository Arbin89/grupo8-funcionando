import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, UserRound, Pencil, Trash2, Loader2, X } from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
} from "../../services/userService";

// ─── Constants ────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition";

const ROLE_META: Record<string, { label: string; cls: string }> = {
  admin:   { label: "Administrador", cls: "border-amber-500/25 bg-amber-500/10 text-amber-300" },
  mesero:  { label: "Mesero",        cls: "border-sky-500/25 bg-sky-500/10 text-sky-300" },
  cocina:  { label: "Cocina",        cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" },
  usuario: { label: "Usuario",       cls: "border-slate-500/30 bg-slate-700/20 text-slate-400" },
};

const getRole = (role: string) => ROLE_META[role] ?? ROLE_META.usuario;

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const formatDate = (d: string) => new Date(d).toLocaleDateString("es-DO");

// ─── Component ────────────────────────────────────────────────────────────────

const UsersPage = () => {
  const [users, setUsers]           = useState<User[]>([]);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [saving, setSaving]         = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", username: "", password: "", role: "usuario", status: "activo",
  });

  const fetchUsers = async () => {
    try { setLoading(true); setError(""); setUsers(await getUsers()); }
    catch (e) { setError(e instanceof Error ? e.message : "Error al cargar usuarios"); }
    finally { setLoading(false); }
  };

  useEffect(() => { void fetchUsers(); }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", username: "", password: "", role: "usuario", status: "activo" });
    setEditingId(null); setShowForm(false);
  };

  const handleEdit = (u: User) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, username: u.username, password: "", role: u.role, status: u.status });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editingId) {
        await updateUser(editingId, { name: form.name, email: form.email, username: form.username, role: form.role, status: form.status });
      } else {
        await createUser(form);
      }
      await fetchUsers(); resetForm();
    } catch (e) { setError(e instanceof Error ? e.message : "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser.id);
      setDeletingUser(null); await fetchUsers();
    } catch (e) { setError(e instanceof Error ? e.message : "Error al eliminar"); setDeletingUser(null); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[420px] w-[420px] rounded-full bg-indigo-600/5 blur-[130px]" />
        <div className="absolute right-[-4%] bottom-[10%] h-[360px] w-[360px] rounded-full bg-sky-600/4 blur-[120px]" />
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
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Gestión de Usuarios</h1>
            <p className="mt-1 text-sm text-slate-500">Administra cuentas, roles y estado del personal.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
          >
            <Plus className="h-4 w-4" /> Agregar usuario
          </button>
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {/* Inline form */}
        {showForm && (
          <div className="rounded-2xl border border-white/[0.09] bg-[#111318] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-white">{editingId ? "Editar usuario" : "Nuevo usuario"}</h3>
              <button onClick={resetForm} className="rounded-lg border border-white/[0.08] p-1.5 text-slate-500 hover:text-slate-200 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre *</label><input className={inputCls} value={form.name} onChange={f("name")} required /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Correo *</label><input type="email" className={inputCls} value={form.email} onChange={f("email")} required /></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Usuario *</label><input className={inputCls} value={form.username} onChange={f("username")} required /></div>
              {!editingId && <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Contraseña *</label><input type="password" className={inputCls} value={form.password} onChange={f("password")} required /></div>}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Rol</label>
                <select className={inputCls} value={form.role} onChange={f("role")}>
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuario</option>
                  <option value="mesero">Mesero</option>
                  <option value="cocina">Cocina</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Estado</label>
                <select className={inputCls} value={form.status} onChange={f("status")}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-50">
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {saving ? "Guardando…" : editingId ? "Actualizar" : "Crear usuario"}
                </button>
                <button type="button" onClick={resetForm} className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 hover:bg-white/[0.05] transition">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111318]">
          <div className="border-b border-white/[0.06] px-5 py-3.5">
            <p className="text-sm font-bold text-white">
              Usuarios <span className="ml-1.5 rounded-full bg-white/[0.07] px-2 py-0.5 text-xs font-semibold text-slate-400">{users.length}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
              <span className="text-sm">Cargando usuarios…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] text-left">
                    {["Usuario", "Email", "Rol", "Estado", "Registro", "Acciones"].map((h) => (
                      <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const role = getRole(u.role);
                    return (
                      <tr key={u.id} className="border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.02]">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-black text-orange-300 ring-1 ring-orange-500/20">
                              {getInitials(u.name) || <UserRound className="h-4 w-4" />}
                            </div>
                            <span className="font-semibold text-slate-100">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${role.cls}`}>{role.label}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${u.status === "activo" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400" : "border-slate-600/30 bg-slate-700/20 text-slate-500"}`}>
                            {u.status === "activo" ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{formatDate(u.created_at)}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleEdit(u)} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300" title="Editar"><Pencil className="h-3.5 w-3.5" /></button>
                            <button onClick={() => setDeletingUser(u)} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400" title="Eliminar"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-slate-600">No hay usuarios registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#13151c] p-6 shadow-2xl">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10"><Trash2 className="h-4 w-4 text-red-400" /></div>
              <h3 className="text-base font-black text-white">Eliminar usuario</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">¿Seguro que deseas eliminar a <span className="font-semibold text-white">{deletingUser.name}</span>? Esta acción no se puede deshacer.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeletingUser(null)} className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200">Cancelar</button>
              <button onClick={() => void handleDelete()} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;