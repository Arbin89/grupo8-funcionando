import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMenuItems, MenuItem } from "../services/menuService";

const CATEGORY_FALLBACK: Record<string, string> = {
  Entradas: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  Principales: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
  Postres: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
  Bebidas: "https://images.unsplash.com/photo-1523677011784-1c3f36a3b92a?w=600&h=400&fit=crop",
  General: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
};

const CATEGORY_COLORS: Record<string, string> = {
  Entradas: "bg-orange-100 text-orange-700",
  Principales: "bg-red-100 text-red-700",
  Postres: "bg-pink-100 text-pink-700",
  Bebidas: "bg-blue-100 text-blue-700",
  General: "bg-gray-100 text-gray-700",
};

const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    getMenuItems()
      .then((data) => setItems(data.filter((i) => i.available)))
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar el menú"))
      .finally(() => setLoading(false));
  }, []);

  const activeCategories = ["Todos", ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered =
    activeCategory === "Todos"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const getImage = (item: MenuItem) =>
    item.image_url && item.image_url.trim() !== ""
      ? item.image_url
      : CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK["General"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Nuestro Menú</h1>
        <p className="text-gray-300 text-lg">Descubre nuestros platos preparados con los mejores ingredientes</p>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        {/* Filtros */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {activeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm ${activeCategory === cat
                  ? "bg-gray-900 text-white border-gray-900 scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Cargando menú...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-20">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No hay platos disponibles en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group"
              >
                {/* Imagen */}
                <div className="relative w-full h-52 overflow-hidden">
                  <img
                    src={getImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK["General"];
                    }}
                  />
                  {/* Badge de categoría */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-700"}`}>
                    {item.category}
                  </span>
                </div>

                {/* Contenido */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{item.name}</h3>
                  <p className="text-sm text-gray-500 flex-1 mb-4 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-extrabold text-gray-900">
                      ${Number(item.price).toFixed(2)}
                    </span>
                    <button className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-700 active:scale-95 transition-all duration-200">
                      Agregar +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPage;
