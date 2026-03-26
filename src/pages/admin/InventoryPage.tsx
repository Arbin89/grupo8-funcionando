import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X, Tag } from "lucide-react";
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

const stockBar = (available: number, minimum: number) => {
  if (minimum === 0) return "bg-green-500";
  const ratio = available / minimum;
  if (ratio > 1.5) return "bg-green-500";
  if (ratio > 1) return "bg-yellow-400";
  return "bg-red-500";
};

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
    <div className="space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
          <p className="text-muted-foreground">Controla el stock de productos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setNewCatName(""); setCatError(""); setShowCatModal(true); }}
            className="inline-flex items-center gap-1 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition"
          >
            <Tag className="w-4 h-4" /> Categorías
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" /> Agregar Producto
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b flex-wrap">
        {["Todos", ...categories.map((c) => c.name)].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabla de productos */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Productos ({filtered.length})</h2>
        {loading ? (
          <p className="text-muted-foreground text-sm">Cargando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay productos en esta categoría.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-semibold">Nombre</th>
                  <th className="py-2 pr-4 font-semibold">Categoría</th>
                  <th className="py-2 pr-4 font-semibold">Stock disponible</th>
                  <th className="py-2 pr-4 font-semibold">Stock mínimo</th>
                  <th className="py-2 pr-4 font-semibold">Precio unitario</th>
                  <th className="py-2 pr-4 font-semibold">Estado</th>
                  <th className="py-2 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition">
                    <td className="py-3 pr-4 font-medium">{item.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{item.category_name ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.stock_available <= item.stock_minimum ? "text-red-600" : ""}`}>
                          {item.stock_available}
                        </span>
                        <div className="w-16 bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${stockBar(item.stock_available, item.stock_minimum)}`}
                            style={{ width: `${Math.min((item.stock_available / Math.max(item.stock_minimum * 2, 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">{item.stock_minimum}</td>
                    <td className="py-3 pr-4">${Number(item.unit_price).toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-md border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ── Modal Item ───────────────────────────── */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editingItem ? "Editar Producto" : "Agregar Producto"}
              </h3>
              <button onClick={() => setShowItemModal(false)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold block mb-1">Nombre *</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Categoría</label>
                <select
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                  <label className="text-sm font-semibold block mb-1">Stock disponible</label>
                  <input
                    type="number" min={0}
                    className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={form.stock_available}
                    onChange={(e) => setForm({ ...form, stock_available: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Stock mínimo</label>
                  <input
                    type="number" min={0}
                    className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={form.stock_minimum}
                    onChange={(e) => setForm({ ...form, stock_minimum: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Precio unitario ($)</label>
                <input
                  type="number" min={0} step={0.01}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.unit_price}
                  onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Estado</label>
                <select
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "activo" | "inactivo" })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {formError && (
              <p className="text-red-600 text-sm">{formError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowItemModal(false)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-muted transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveItem}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
              >
                {saving ? "Guardando..." : editingItem ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Categorías ─────────────────────── */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Gestionar Categorías</h3>
              <button onClick={() => setShowCatModal(false)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Lista de categorías existentes */}
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {categories.length === 0 && (
                <li className="text-sm text-muted-foreground">No hay categorías aún.</li>
              )}
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
                  <span>{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-destructive hover:opacity-70 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Nueva categoría */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block">Nueva categoría</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nombre..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                />
                <button
                  onClick={handleCreateCategory}
                  disabled={savingCat}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition disabled:opacity-60"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {catError && <p className="text-red-600 text-xs">{catError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal confirmar borrado ──────────────── */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold">Confirmar eliminación</h3>
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de que deseas eliminar <strong>{deletingItem.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-muted transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteItem}
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

export default InventoryPage;
