import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryCategories,
  getInventoryItems,
  InventoryItem,
  updateInventoryItem,
} from "../../services/inventoryService";

const DEFAULT_FORM = {
  name: "",
  category_name: "",
  stock_available: 0,
  stock_minimum: 0,
  unit_price: 0,
  status: "activo",
};

const getStockLevel = (stock: number, min: number) => {
  if (min <= 0) return "stock-good";

  const ratio = stock / min;
  if (ratio > 1.5) return "stock-good";
  if (ratio > 1) return "stock-warning";
  return "stock-danger";
};

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Todos");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const [itemsData, categoriesData] = await Promise.all([
        getInventoryItems(),
        getInventoryCategories(),
      ]);

      setItems(itemsData);

      const mergedCategories = Array.from(
        new Set([
          ...categoriesData.map((category) => category.name),
          ...itemsData
            .map((item) => item.category_name)
            .filter((categoryName): categoryName is string => Boolean(categoryName)),
        ])
      ).sort((a, b) => a.localeCompare(b));

      setCategories(mergedCategories);

      if (
        activeTab !== "Todos" &&
        !mergedCategories.includes(activeTab)
      ) {
        setActiveTab("Todos");
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const categoryTabs = ["Todos", ...categories];

  const filtered =
    activeTab === "Todos"
      ? items
      : items.filter((item) => item.category_name === activeTab);

  const totalStock = items.reduce(
    (sum, item) => sum + item.stock_available,
    0
  );
  const lowStockCount = items.filter(
    (item) => item.stock_available <= item.stock_minimum
  ).length;
  const activeCount = items.filter((item) => item.status === "activo").length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        name === "stock_available" ||
        name === "stock_minimum" ||
        name === "unit_price"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setEditingItemId(null);
    setShowForm(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setShowForm(true);
    setFormData({
      name: item.name,
      category_name: item.category_name || "",
      stock_available: item.stock_available,
      stock_minimum: item.stock_minimum,
      unit_price: item.unit_price,
      status: item.status,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      if (editingItemId) {
        await updateInventoryItem(editingItemId, formData);
      } else {
        await createInventoryItem(formData);
      }

      await fetchInventory();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Error al guardar producto");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Seguro que deseas eliminar este producto?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      await deleteInventoryItem(id);
      await fetchInventory();
    } catch (err: any) {
      setError(err.message || "Error al eliminar producto");
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

      <div>
        <h1 className="text-3xl font-bold">Gestion de Inventario</h1>
        <p className="text-muted-foreground">
          Controla el stock, el precio y el estado de los productos
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl shadow-sm p-4 border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Productos activos
          </p>
          <p className="text-3xl font-bold mt-2">{activeCount}</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Unidades disponibles
          </p>
          <p className="text-3xl font-bold mt-2">{totalStock}</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Stock critico
          </p>
          <p className="text-3xl font-bold mt-2">{lowStockCount}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Productos ({filtered.length})</h2>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Agregar Producto
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Categoria
              </label>
              <input
                type="text"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                list="inventory-categories"
                placeholder="Ej. Bebidas"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
              <datalist id="inventory-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock disponible
              </label>
              <input
                type="number"
                name="stock_available"
                min={0}
                value={formData.stock_available}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock minimo
              </label>
              <input
                type="number"
                name="stock_minimum"
                min={0}
                value={formData.stock_minimum}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Precio unitario
              </label>
              <input
                type="number"
                name="unit_price"
                min={0}
                step="0.01"
                value={formData.unit_price}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                {editingItemId ? "Actualizar Producto" : "Guardar Producto"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-input px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-4 border-b mb-6">
          {categoryTabs.map((tab) => (
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

        {loading ? (
          <div className="py-6 text-sm text-muted-foreground">
            Cargando inventario...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-info p-4 text-primary-foreground">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-80">
                        {item.category_name || "Sin categoria"}
                      </p>
                      <h3 className="font-bold mt-2">{item.name}</h3>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/15">
                      {item.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                      STOCK DISPONIBLE
                    </p>
                    <p className="font-bold">{item.stock_available} unidades</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${getStockLevel(
                          item.stock_available,
                          item.stock_minimum
                        )}`}
                        style={{
                          width: `${Math.min(
                            item.stock_minimum > 0
                              ? (item.stock_available /
                                  (item.stock_minimum * 2)) *
                                  100
                              : 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                      STOCK MINIMO
                    </p>
                    <p className="text-sm">{item.stock_minimum} unidades</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                      PRECIO UNITARIO
                    </p>
                    <p className="font-bold text-lg">
                      ${item.unit_price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 text-xs border border-primary text-primary px-3 py-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 text-xs border border-destructive text-destructive px-3 py-1.5 rounded-md hover:bg-destructive hover:text-destructive-foreground transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-6">
                No hay productos registrados en esta categoria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
