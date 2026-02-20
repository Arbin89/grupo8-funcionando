import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Product = {
  name: string;
  emoji: string;
  stock: number;
  minStock: number;
  price: number;
  category: string;
};

const products: Product[] = [
  { name: "Vino Tinto Reserva", emoji: "🍷", stock: 45, minStock: 20, price: 12.50, category: "Bebidas" },
  { name: "Carne Wagyu", emoji: "🥩", stock: 18, minStock: 15, price: 35.00, category: "Carnes" },
  { name: "Lechuga Fresca", emoji: "🥬", stock: 50, minStock: 30, price: 2.50, category: "Verduras" },
  { name: "Queso Manchego", emoji: "🧀", stock: 12, minStock: 10, price: 8.75, category: "Lácteos" },
  { name: "Cerveza Premium", emoji: "🍺", stock: 80, minStock: 50, price: 5.50, category: "Bebidas" },
  { name: "Pechuga de Pollo", emoji: "🍗", stock: 35, minStock: 25, price: 7.00, category: "Carnes" },
  { name: "Tomate Maduro", emoji: "🍅", stock: 60, minStock: 40, price: 1.80, category: "Verduras" },
  { name: "Leche Fresca", emoji: "🥛", stock: 25, minStock: 20, price: 3.20, category: "Lácteos" },
];

const categoryTabs = ["Todos", "Bebidas", "Carnes", "Verduras", "Lácteos"];

const getStockLevel = (stock: number, min: number) => {
  const ratio = stock / min;
  if (ratio > 1.5) return "stock-good";
  if (ratio > 1) return "stock-warning";
  return "stock-danger";
};

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("Todos");

  const filtered = activeTab === "Todos"
    ? products
    : products.filter((p) => p.category === activeTab);

  return (
    <div className="space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
        <p className="text-muted-foreground">Controla el stock de productos y menú</p>
      </div>

      <div className="flex gap-4 border-b">
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

      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Productos ({filtered.length})</h2>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
            Agregar Producto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p.name} className="border rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-info p-4 text-primary-foreground">
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="font-bold mt-2">{p.name}</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">STOCK DISPONIBLE</p>
                  <p className="font-bold">{p.stock} unidades</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${getStockLevel(p.stock, p.minStock)}`}
                      style={{ width: `${Math.min((p.stock / (p.minStock * 2)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">STOCK MÍNIMO</p>
                  <p className="text-sm">{p.minStock} unidades</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">PRECIO UNITARIO</p>
                  <p className="font-bold text-lg">${p.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 text-xs border border-primary text-primary px-3 py-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition">Editar</button>
                  <button className="flex-1 text-xs border border-destructive text-destructive px-3 py-1.5 rounded-md hover:bg-destructive hover:text-destructive-foreground transition">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
