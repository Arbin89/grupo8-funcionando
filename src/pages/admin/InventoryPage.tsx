import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X, Tag, Loader2, Package, AlertTriangle, CircleCheck } from "lucide-react";
import {
  getCategories,
  getItems,
  createCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem,
  InventoryCategory,
  InventoryItem,
  InventoryItemPayload,
} from "../../services/inventoryService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emptyForm = (): InventoryItemPayload => ({
  name: "",
  category_id: null,
  stock_available: 0,
  stock_minimum: 0,
  unit_price: 0,
  status: "activo",
});

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition";

const stockBar = (available: number, minimum: number): string => {
  if (minimum <= 0) return "bg-emerald-400";
  const ratio = available / minimum;
  if (ratio > 1.5) return "bg-emerald-400";
  if (ratio > 1) return "bg-amber-400";
  return "bg-red-400";
};

const stockTextClass = (available: number, minimum: number) => {
  if (minimum <= 0) return "text-emerald-300";
  if (available <= minimum) return "text-red-300";
  if (available <= minimum * 1.2) return "text-amber-300";
  return "text-emerald-300";
};

const categoryBadge = [
  "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
  "border-sky-500/25 bg-sky-500/10 text-sky-300",
  "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "border-purple-500/25 bg-purple-500/10 text-purple-300",
  "border-amber-500/25 bg-amber-500/10 text-amber-300",
];

const getStatusMeta = (status: InventoryItem["status"]) => {
  if (status === "activo") {
    return {
      label: "Activo",
      cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
      icon: CircleCheck,
    };
  }
  return {
    label: "Inactivo",
    cls: "border-slate-600/40 bg-slate-700/20 text-slate-400",
    icon: AlertTriangle,
  };
};

const formatCurrency = (value: number) => `$${Number(value).toFixed(2)}`;

// ─── Componente principal ─────────────────────────────────────────────────────

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal item
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<InventoryItemPayload>(emptyForm());
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal categorías
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catError, setCatError] = useState("");
  const [savingCat, setSavingCat] = useState(false);

  // Confirmación de borrado
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

  const [searchText, setSearchText] = useState("");

  // ── Carga inicial ──────────────────────────────
  const load = async () => {
    try {
      setLoading(true);
      const [cats, itms] = await Promise.all([getCategories(), getItems()]);
      setCategories(cats);
      setItems(itms);
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Filtro por categoría ───────────────────────
  const filtered = activeTab === "Todos"
    ? items
    : items.filter((i) => i.category_name === activeTab);

  const visibleItems = filtered.filter((item) => {
    if (!searchText.trim()) return true;
    const query = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.category_name || "").toLowerCase().includes(query)
    );
  });

  const totalItems = items.length;
  const activeItems = items.filter((item) => item.status === "activo").length;
  const lowStockItems = items.filter((item) => item.stock_available <= item.stock_minimum).length;
  const totalValue = items.reduce((sum, item) => sum + Number(item.unit_price) * item.stock_available, 0);

  // ── Abrir modal de nuevo item ─────────────────
  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm());
    setFormError("");
    setShowItemModal(true);
  };

  // ── Abrir modal de edición ────────────────────
  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category_id: item.category_id,
      stock_available: item.stock_available,
      stock_minimum: item.stock_minimum,
      unit_price: item.unit_price,
      status: item.status,
    });
    setFormError("");
    setShowItemModal(true);
  };

  // ── Guardar item (crear o editar) ─────────────
  const handleSaveItem = async () => {
    if (!form.name.trim()) { setFormError("El nombre es requerido"); return; }
    setSaving(true);
    setFormError("");
    try {
      if (editingItem) {
        await updateItem(editingItem.id, form);
      } else {
        await createItem(form);
      }
      setShowItemModal(false);
      load();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // ── Confirmar borrado ─────────────────────────
  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    try {
      await deleteItem(deletingItem.id);
      setDeletingItem(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
      setDeletingItem(null);
    }
  };

  // ── Crear categoría ───────────────────────────
  const handleCreateCategory = async () => {
    if (!newCatName.trim()) { setCatError("El nombre es requerido"); return; }
    setSavingCat(true);
    setCatError("");
    try {
      await createCategory(newCatName.trim());
      setNewCatName("");
      setShowCatModal(false);
      load();
    } catch (e: unknown) {
      setCatError(e instanceof Error ? e.message : "Error al crear");
    } finally {
      setSavingCat(false);
    }
  };

  // ── Eliminar categoría ────────────────────────
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      if (activeTab !== "Todos") setActiveTab("Todos");
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al eliminar categoría");
    }
  };

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[420px] w-[420px] rounded-full bg-emerald-600/5 blur-[130px]" />
        <div className="absolute right-[-4%] bottom-[10%] h-[360px] w-[360px] rounded-full bg-sky-600/4 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-5 px-5 py-8 md:px-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al panel
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400/70">Administración</p>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Gestión de Inventario</h1>
            <p className="mt-1 text-sm text-slate-500">Controla stock, estado y categorías de productos.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setNewCatName(""); setCatError(""); setShowCatModal(true); }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-orange-500/35 hover:bg-orange-500/10"
            >
              <Tag className="h-4 w-4" /> Categorías
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
            >
              <Plus className="h-4 w-4" /> Agregar producto
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#111318] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total productos</p>
            <p className="mt-2 text-4xl font-black text-white">{totalItems}</p>
          </div>
          <div className="rounded-2xl border border-sky-500/20 bg-[#111318] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Activos</p>
            <p className="mt-2 text-4xl font-black text-white">{activeItems}</p>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-[#111318] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Stock bajo</p>
            <p className="mt-2 text-4xl font-black text-white">{lowStockItems}</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-[#111318] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Valor estimado</p>
            <p className="mt-2 text-3xl font-black text-white">{formatCurrency(totalValue)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#111318] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {["Todos", ...categories.map((c) => c.name)].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === tab
                      ? "border-orange-500/35 bg-orange-500/15 text-orange-300"
                      : index === 0
                        ? "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                        : `${categoryBadge[index % categoryBadge.length]} hover:border-white/30`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Buscar producto o categoría..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-orange-500/40 focus:outline-none md:w-[320px]"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0f1117]">
            <div className="border-b border-white/[0.06] px-5 py-3.5">
              <p className="text-sm font-bold text-white">
                Productos
                <span className="ml-1.5 rounded-full bg-white/[0.07] px-2 py-0.5 text-xs font-semibold text-slate-400">
                  {visibleItems.length}
                </span>
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center gap-3 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
                <span className="text-sm">Cargando inventario…</span>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-600">
                No hay productos para mostrar con el filtro actual.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.05] text-left">
                      {[
                        "Producto",
                        "Categoría",
                        "Stock disponible",
                        "Stock mínimo",
                        "Precio",
                        "Estado",
                        "Acciones",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item) => {
                      const statusMeta = getStatusMeta(item.status);
                      const StatusIcon = statusMeta.icon;
                      const barWidth = Math.min((item.stock_available / Math.max(item.stock_minimum * 2, 1)) * 100, 100);
                      return (
                        <tr key={item.id} className="border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.02]">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                                <Package className="h-4 w-4 text-orange-300" />
                              </span>
                              <span className="font-semibold text-slate-100">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryBadge[item.id % categoryBadge.length]}`}>
                              {item.category_name ?? "Sin categoría"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${stockTextClass(item.stock_available, item.stock_minimum)}`}>
                                {item.stock_available}
                              </span>
                              <div className="h-1.5 w-16 rounded-full bg-white/10">
                                <div
                                  className={`h-1.5 rounded-full ${stockBar(item.stock_available, item.stock_minimum)}`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400">{item.stock_minimum}</td>
                          <td className="px-5 py-3.5 text-slate-200">{formatCurrency(item.unit_price)}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.cls}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal Item ───────────────────────────── */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#13151c] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                {editingItem ? "Editar Producto" : "Agregar Producto"}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="rounded-lg border border-white/[0.08] p-1.5 text-slate-500 transition hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre *</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Categoría</label>
                <select
                  className={inputCls}
                  value={form.category_id ?? ""}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : null })}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Stock disponible</label>
                  <input
                    type="number" min={0}
                    className={inputCls}
                    value={form.stock_available}
                    onChange={(e) => setForm({ ...form, stock_available: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Stock mínimo</label>
                  <input
                    type="number" min={0}
                    className={inputCls}
                    value={form.stock_minimum}
                    onChange={(e) => setForm({ ...form, stock_minimum: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Precio unitario ($)</label>
                <input
                  type="number" min={0} step={0.01}
                  className={inputCls}
                  value={form.unit_price}
                  onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Estado</label>
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "activo" | "inactivo" })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {formError && (
              <p className="mt-3 text-sm text-red-300">{formError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowItemModal(false)}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleSaveItem()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-60"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Guardando..." : editingItem ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Categorías ─────────────────────── */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.09] bg-[#13151c] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Gestionar Categorías</h3>
              <button
                onClick={() => setShowCatModal(false)}
                className="rounded-lg border border-white/[0.08] p-1.5 text-slate-500 transition hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lista de categorías existentes */}
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
              {categories.length === 0 && (
                <li className="text-sm text-slate-500">No hay categorías aún.</li>
              )}
              {categories.map((cat, index) => (
                <li key={cat.id} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="text-slate-200">{cat.name}</span>
                  <button
                    onClick={() => void handleDeleteCategory(cat.id)}
                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${categoryBadge[index % categoryBadge.length]} transition hover:border-red-500/45 hover:bg-red-500/10 hover:text-red-300`}
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            {/* Nueva categoría */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nueva categoría</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-orange-500/40 focus:outline-none"
                  placeholder="Nombre..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void handleCreateCategory()}
                />
                <button
                  onClick={() => void handleCreateCategory()}
                  disabled={savingCat}
                  className="rounded-xl bg-orange-500 px-3 py-2 text-sm text-black transition hover:bg-orange-400 disabled:opacity-60"
                >
                  {savingCat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
              {catError && <p className="text-xs text-red-300">{catError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal confirmar borrado ──────────────── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#13151c] p-6 shadow-2xl">
            <div className="mb-1 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
                <Trash2 className="h-4 w-4 text-red-400" />
              </div>
              <h3 className="text-base font-black text-white">Eliminar producto</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              ¿Seguro que deseas eliminar a <span className="font-semibold text-white">{deletingItem.name}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleDeleteItem()}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400"
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

export default InventoryPage;
