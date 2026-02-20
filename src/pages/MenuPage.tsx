import { useState } from "react";
import Navbar from "../components/Navbar";

const categories = ["Todos", "Entradas", "Principales", "Postres", "Bebidas"];

type MenuItem = {
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
};

const menuItems: MenuItem[] = [
  { name: "Alitas BBQ", description: "8 piezas de alitas de pollo bañadas en salsa BBQ", price: 125, category: "Entradas", emoji: "🍗" },
  { name: "Dedos de Queso", description: "Dedos de queso mozzarella empanizados con salsa marinara", price: 95, category: "Entradas", emoji: "🧀" },
  { name: "Ensalada César", description: "Lechuga romana, crutones, queso parmesano y aderezo césar", price: 89, category: "Entradas", emoji: "🥗" },
  { name: "Filete de Res", description: "Filete de res a la parrilla con guarnición de verduras", price: 280, category: "Principales", emoji: "🥩" },
  { name: "Pasta Alfredo", description: "Pasta fettuccine con salsa alfredo y pollo", price: 165, category: "Principales", emoji: "🍝" },
  { name: "Tiramisú", description: "Postre italiano con café, mascarpone y cacao", price: 95, category: "Postres", emoji: "🍰" },
  { name: "Limonada Natural", description: "Limonada fresca con hierbabuena", price: 45, category: "Bebidas", emoji: "🍋" },
  { name: "Cerveza Artesanal", description: "Cerveza artesanal de la casa", price: 75, category: "Bebidas", emoji: "🍺" },
];

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = activeCategory === "Todos"
    ? menuItems
    : menuItems.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Nuestro Menú</h1>
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="space-y-6">
          {filtered.map((item) => (
            <div key={item.name} className="flex flex-col items-center text-center">
              <span className="text-4xl mb-2">{item.emoji}</span>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
              <span className="bg-foreground text-background text-sm px-3 py-1 rounded-full font-semibold mb-2">
                ${item.price.toFixed(2)}
              </span>
              <button className="bg-foreground text-background text-sm px-5 py-1.5 rounded-full font-medium hover:opacity-90 transition">
                Agregar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MenuPage;
