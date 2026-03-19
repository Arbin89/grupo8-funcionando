import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X } from "lucide-react";
import {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    MenuItem,
    MenuItemPayload,
} from "../../services/menuService";

const CATEGORIES = ["Entradas", "Principales", "Postres", "Bebidas", "General"];

const emptyForm = (): MenuItemPayload => ({
    name: "",
    description: "",
    price: 0,
    category: "General",
    emoji: "🍽️",
    image_url: "",
    available: true,
});

const MenuAdminPage = () => {
        // Selección múltiple
        const [selectedIds, setSelectedIds] = useState<number[]>([]);

        const toggleSelect = (id: number) => {
            setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
        };
        const selectAll = () => {
            setSelectedIds(filtered.map((item) => item.id));
        };
        const clearSelected = () => {
            setSelectedIds([]);
        };
        const handleDeleteSelected = async () => {
            if (selectedIds.length === 0) return;
            setSaving(true);
            try {
                for (const id of selectedIds) {
                    await deleteMenuItem(id);
                }
                clearSelected();
                load();
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Error al eliminar seleccionados");
            } finally {
                setSaving(false);
            }
        };
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("Todos");

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [form, setForm] = useState<MenuItemPayload>(emptyForm());
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    // Confirmación borrado
    const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getMenuItems();
            setItems(data);
            setError("");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error al cargar el menú");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = activeTab === "Todos"
        ? items
        : items.filter((i) => i.category === activeTab);

    const openCreate = () => {
        setEditingItem(null);
        setForm(emptyForm());
        setFormError("");
        setShowModal(true);
    };

    const openEdit = (item: MenuItem) => {
        setEditingItem(item);
        setForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            emoji: item.emoji,
            image_url: item.image_url || "",
            available: item.available,
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setFormError("El nombre es requerido"); return; }
        if (!form.price || form.price <= 0) { setFormError("El precio debe ser mayor a 0"); return; }
        setSaving(true);
        setFormError("");
        try {
            if (editingItem) {
                await updateMenuItem(editingItem.id, form);
            } else {
                await createMenuItem(form);
            }
            setShowModal(false);
            load();
        } catch (e: unknown) {
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
            load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error al eliminar");
            setDeletingItem(null);
        }
    };

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
                    <h1 className="text-3xl font-bold">Gestión de Menú</h1>
                    <p className="text-muted-foreground">Administra los platos del restaurante</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                    <Plus className="w-4 h-4" /> Agregar Plato
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b flex-wrap">
                {["Todos", ...CATEGORIES].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm font-medium transition border-b-2 ${activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tabla */}
            <div className="bg-card rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4 gap-2">
                    <h2 className="text-lg font-bold">Platos ({filtered.length})</h2>
                    {selectedIds.length > 0 && (
                        <span className="text-sm text-primary font-semibold">{selectedIds.length} seleccionados</span>
                    )}
                    <button
                        className="px-3 py-1 text-xs rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition"
                        onClick={selectAll}
                        disabled={filtered.length === 0}
                    >Seleccionar todos</button>
                    <button
                        className="px-3 py-1 text-xs rounded-lg border border-muted text-muted-foreground hover:bg-muted transition"
                        onClick={clearSelected}
                        disabled={selectedIds.length === 0}
                    >Limpiar selección</button>
                    <button
                        className="px-3 py-1 text-xs rounded-lg border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                        onClick={handleDeleteSelected}
                        disabled={selectedIds.length === 0 || saving}
                    >Eliminar seleccionados</button>
                </div>
                {loading ? (
                    <p className="text-muted-foreground text-sm">Cargando...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay platos en esta categoría.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="py-2 pr-2 font-semibold">
                                        <input type="checkbox"
                                            checked={selectedIds.length === filtered.length && filtered.length > 0}
                                            onChange={e => e.target.checked ? selectAll() : clearSelected()}
                                        />
                                    </th>
                                    <th className="py-2 pr-4 font-semibold">Plato</th>
                                    <th className="py-2 pr-4 font-semibold">Categoría</th>
                                    <th className="py-2 pr-4 font-semibold">Precio</th>
                                    <th className="py-2 pr-4 font-semibold">Disponible</th>
                                    <th className="py-2 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition">
                                        <td className="py-3 pr-2">
                                            <input type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => toggleSelect(item.id)}
                                            />
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{item.emoji}</span>
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-muted-foreground">{item.category}</td>
                                        <td className="py-3 pr-4 font-semibold">${Number(item.price).toFixed(2)}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                {item.available ? "Sí" : "No"}
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

            {/* Modal crear/editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                                {editingItem ? "Editar Plato" : "Agregar Plato"}
                            </h3>
                            <button onClick={() => setShowModal(false)}>
                                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="text-sm font-semibold block mb-1">Nombre *</label>
                                    <input
                                        className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold block mb-1">Emoji</label>
                                    <input
                                        className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={form.emoji}
                                        onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold block mb-1">Precio ($) *</label>
                                    <input
                                        type="number" min={0} step={0.01}
                                        className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold block mb-1">Categoría</label>
                                    <select
                                        className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold block mb-1">Disponible</label>
                                    <select
                                        className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={form.available ? "true" : "false"}
                                        onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                                    >
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-semibold block mb-1">URL de Imagen</label>
                                    <input
                                        className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        value={form.image_url}
                                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    />
                                    {form.image_url && (
                                        <img src={form.image_url} alt="preview" className="mt-2 w-full h-28 object-cover rounded-lg" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-semibold block mb-1">Descripción</label>
                                    <textarea
                                        rows={2}
                                        className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {formError && <p className="text-red-600 text-sm">{formError}</p>}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm rounded-lg border hover:bg-muted transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
                            >
                                {saving ? "Guardando..." : editingItem ? "Guardar cambios" : "Crear plato"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal confirmar borrado */}
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
                                onClick={handleDelete}
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

export default MenuAdminPage;
