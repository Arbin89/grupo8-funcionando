import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X, Search, UtensilsCrossed, Loader2, CheckSquare, Square } from "lucide-react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  MenuItem,
  MenuItemPayload,
} from "../../services/menuService";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["Entradas", "Principales", "Postres", "Bebidas", "General"];
const ALL_TABS = ["Todos", ...CATEGORIES];

const CATEGORY_COLORS: Record<string, string> = {
  Entradas:   "bg-amber-500/10 text-amber-300 border-amber-500/25",
  Principales:"bg-sky-500/10 text-sky-300 border-sky-500/25",
  Postres:    "bg-pink-500/10 text-pink-300 border-pink-500/25",
  Bebidas:    "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  General:    "bg-slate-500/10 text-slate-400 border-slate-500/25",
};

const emptyForm = (): MenuItemPayload => ({
  name: "", description: "", price: 0,
  category: "General", emoji: "", image_url: "", available: true,
});

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 2 }).format(v);

// ─── Shared input class ───────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition";

// ─── Component ────────────────────────────────────────────────────────────────

const MenuAdminPage = () => {
  const [items, setItems]       = useState<MenuItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [search, setSearch]     = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal
  const [showModal, setShowModal]   = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm]             = useState<MenuItemPayload>(emptyForm());
  const [formError, setFormError]   = useState("");
  const [saving, setSaving]         = useState(false);

  // Delete confirm
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // ─── Data ──────────────────────────────────────────────────────────────────

  const load = async () => {
    try {
      setLoading(true);
      setItems(await getMenuItems());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el menú");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = items
    .filter((i) => activeTab === "Todos" || i.category === activeTab)
    .filter((i) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q);
    });

  // ─── Selection ─────────────────────────────────────────────────────────────

  const toggleSelect   = (id: number) =>
    setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const selectAll      = () => setSelectedIds(filtered.map((i) => i.id));
  const clearSelected  = () => setSelectedIds([]);
  const allSelected    = filtered.length > 0 && selectedIds.length === filtered.length;

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    setSaving(true);
    try {
      for (const id of selectedIds) await deleteMenuItem(id);
      clearSelected();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar seleccionados");
    } finally {
      setSaving(false);
    }
  };

  // ─── Modal ─────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingItem(null); setForm(emptyForm()); setFormError(""); setShowModal(true);
  };
  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description, price: item.price,
              category: item.category, emoji: item.emoji || "",
              image_url: item.image_url || "", available: item.available });
    setFormError(""); setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("El nombre es requerido"); return; }
    if (!form.price || form.price <= 0) { setFormError("El precio debe ser mayor a 0"); return; }
    setSaving(true); setFormError("");
    try {
      editingItem ? await updateMenuItem(editingItem.id, form) : await createMenuItem(form);
      setShowModal(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMenuItem(deletingItem.id);
      setDeletingItem(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
      setDeletingItem(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[420px] w-[420px] rounded-full bg-amber-600/5 blur-[130px]" />
        <div className="absolute right-[-4%] bottom-[10%] h-[360px] w-[360px] rounded-full bg-sky-600/4 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-5 px-5 py-8 md:px-8">

        {/* Back */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al panel
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400/70">Administración</p>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Gestión de Menú</h1>
            <p className="mt-1 text-sm text-slate-500">Administra los platos del restaurante.</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
          >
            <Plus className="h-4 w-4" /> Agregar plato
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Tabs + search row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ALL_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30"
                    : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar plato…"
              className="h-8 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-orange-500/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Bulk actions bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#111318] px-4 py-2.5">
            <span className="text-sm font-semibold text-white">{selectedIds.length} seleccionado{selectedIds.length > 1 ? "s" : ""}</span>
            <button onClick={clearSelected} className="text-xs text-slate-500 hover:text-slate-300 transition">Limpiar</button>
            <div className="ml-auto">
              <button
                onClick={() => void handleDeleteSelected()}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Eliminar seleccionados
              </button>
            </div>
          </div>
        )}

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111318]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
            <p className="text-sm font-bold text-white">
              Platos <span className="ml-1.5 rounded-full bg-white/[0.07] px-2 py-0.5 text-xs font-semibold text-slate-400">{filtered.length}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
              <span className="text-sm">Cargando menú…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 text-slate-600">
              <UtensilsCrossed className="h-9 w-9" />
              <p className="text-sm">No hay platos en esta categoría.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] text-left">
                    <th className="px-5 py-3 font-medium text-slate-600">
                      <button onClick={allSelected ? clearSelected : selectAll} className="flex items-center">
                        {allSelected
                          ? <CheckSquare className="h-4 w-4 text-orange-400" />
                          : <Square className="h-4 w-4 text-slate-600 hover:text-slate-400" />}
                      </button>
                    </th>
                    <th className="py-3 pr-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Plato</th>
                    <th className="py-3 pr-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Categoría</th>
                    <th className="py-3 pr-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Precio</th>
                    <th className="py-3 pr-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Estado</th>
                    <th className="py-3 pr-5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.02] ${
                        selectedIds.includes(item.id) ? "bg-orange-500/[0.04]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleSelect(item.id)} className="flex items-center">
                          {selectedIds.includes(item.id)
                            ? <CheckSquare className="h-4 w-4 text-orange-400" />
                            : <Square className="h-4 w-4 text-slate-700 hover:text-slate-500" />}
                        </button>
                      </td>

                      {/* Dish */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop"}
                            alt={item.name}
                            className="h-10 w-10 flex-shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop"; }}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-100 truncate">{item.name}</p>
                            <p className="text-xs text-slate-600 truncate max-w-[200px]">{item.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.General}`}>
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 pr-4 font-black tabular-nums text-white">
                        {formatCurrency(Number(item.price))}
                      </td>

                      {/* Available */}
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          item.available
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                            : "border-slate-600/30 bg-slate-700/20 text-slate-500"
                        }`}>
                          {item.available ? "Disponible" : "No disponible"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(item)}
                            className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Create / Edit ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#13151c] p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                {editingItem ? "Editar plato" : "Agregar plato"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-white/[0.08] p-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre *</label>
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Pollo al horno" />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Precio *</label>
                  <input
                    type="number" min={0} step={0.01}
                    className={inputCls}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Categoría</label>
                  <select
                    className={inputCls}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Available */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Disponibilidad</label>
                <select
                  className={inputCls}
                  value={form.available ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                >
                  <option value="true">Disponible</option>
                  <option value="false">No disponible</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">URL de imagen</label>
                <input
                  className={inputCls}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="mt-2 h-28 w-full rounded-xl object-cover ring-1 ring-white/10"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Descripción</label>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descripción breve del plato…"
                />
              </div>
            </div>

            {formError && (
              <p className="mt-3 text-xs text-red-400">{formError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Guardando…" : editingItem ? "Guardar cambios" : "Crear plato"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Delete confirm ─────────────────────────────────────────────── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#13151c] p-6 shadow-2xl">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
                <Trash2 className="h-4 w-4 text-red-400" />
              </div>
              <h3 className="text-base font-black text-white">Eliminar plato</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              ¿Seguro que deseas eliminar <span className="font-semibold text-white">{deletingItem.name}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleDelete()}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuAdminPage;
