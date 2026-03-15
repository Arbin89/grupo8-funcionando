import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMenuItems, MenuItem } from "../services/menuService";
import { createOrder, CartItem } from "../services/kitchenService";

/* ── Helpers ─────────────────────────────────────── */
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

/* ── Component ───────────────────────────────────── */
const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  // Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    getMenuItems()
      .then((data) => setItems(data.filter((i) => i.available)))
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar el menú"))
      .finally(() => setLoading(false));
  }, []);

  const activeCategories = ["Todos", ...Array.from(new Set(items.map((i) => i.category)))];
  let filtered = activeCategory === "Todos" ? items : items.filter((i) => i.category === activeCategory);
  
  // Aplicar ordenamiento por precio
  if (priceSort === "asc") {
    filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (priceSort === "desc") {
    filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  }

  const getImage = (item: MenuItem) =>
    item.image_url?.trim()
      ? item.image_url
      : CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK["General"];

  /* ── Acciones del carrito ────────────────────────── */
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, {
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        image_url: item.image_url || CATEGORY_FALLBACK[item.category] || CATEGORY_FALLBACK["General"],
        price: Number(item.price),
        quantity: 1,
      }];
    });
    setCartOpen(true);
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => c.id === id ? { ...c, quantity: c.quantity + delta } : c)
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setOrdering(true);
    setOrderError(null);
    try {
      const order = await createOrder({
        items: cart.map((c) => ({ name: c.name, emoji: c.emoji, image_url: c.image_url, price: c.price, quantity: c.quantity })),
        notes: notes || undefined,
        table_number: tableNumber || undefined,
      });
      setCart([]);
      setCartOpen(false);
      setNotes("");
      setTableNumber("");
      setOrderSuccess(order.order_number);
    } catch (e: unknown) {
      setOrderError(e instanceof Error ? e.message : "Error al enviar la orden");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Nuestro Menú</h1>
        <p className="text-gray-300 text-lg">Descubre nuestros platos preparados con los mejores ingredientes</p>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">

        {/* Filtros de categoría */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {activeCategories.map((cat) => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setPriceSort(null); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm ${activeCategory === cat
                ? "bg-gray-900 text-white border-gray-900 scale-105"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow"
                }`}
            >{cat}</button>
          ))}
        </div>

        {/* Filtro de precios */}
        <div className="flex justify-center gap-3 mb-8">
          <button onClick={() => setPriceSort(null)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${priceSort === null
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400"
            }`}
          >
            Precio: Predeterminado
          </button>
          <button onClick={() => setPriceSort("asc")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${priceSort === "asc"
              ? "bg-green-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border border-gray-200 hover:border-green-400"
            }`}
          >
            ↑ Menor a Mayor
          </button>
          <button onClick={() => setPriceSort("desc")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${priceSort === "desc"
              ? "bg-red-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border border-gray-200 hover:border-red-400"
            }`}
          >
            ↓ Mayor a Menor
          </button>
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
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((item) => {
                const inCart = cart.find((c) => c.id === item.id);
                const isHovered = hoveredItemId === item.id;
                return (
                  <div key={item.id}
                    onMouseEnter={() => setHoveredItemId(item.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    className={`bg-white rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 transform cursor-pointer ${
                      isHovered
                        ? "shadow-2xl scale-105"
                        : "shadow-md hover:shadow-xl"
                    }`}
                  >
                    {/* Imagen */}
                    <div className="relative w-full h-52 overflow-hidden">
                      <img src={getImage(item)} alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isHovered ? "scale-110" : "scale-100"
                        }`}
                        onError={(e) => { e.currentTarget.onerror = null; (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK["General"]; }}
                      />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow transition-all ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.category}
                      </span>
                      {inCart && (
                        <span className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                          ×{inCart.quantity}
                        </span>
                      )}
                    </div>
                    {/* Contenido */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{item.name}</h3>
                      <p className="text-sm text-gray-500 flex-1 mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto gap-3">
                        <span className={`text-2xl font-extrabold transition-all duration-300 ${
                          isHovered ? "text-blue-600 scale-110" : "text-gray-900"
                        }`}>
                          ${Number(item.price).toFixed(2)}
                        </span>
                        <button onClick={() => addToCart(item)}
                          className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 transform ${
                            isHovered
                              ? "bg-blue-600 text-white shadow-lg scale-110 hover:bg-blue-700"
                              : "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
                          }`}
                        >
                          {inCart ? `Más +` : "Agregar +"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Preview Popover */}
            {hoveredItemId && (
              <div className="fixed pointer-events-none z-50">
                {filtered.map((item) => {
                  if (item.id !== hoveredItemId) return null;
                  return (
                    <div key={`preview-${item.id}`} className="animate-fade-in">
                      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 ml-4 bg-white rounded-3xl shadow-2xl overflow-hidden w-80 pointer-events-auto">
                        {/* Imagen grande */}
                        <div className="relative w-full h-64 overflow-hidden">
                          <img src={getImage(item)} alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.onerror = null; (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK["General"]; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-3 left-3 text-4xl">{item.emoji}</span>
                        </div>
                        
                        {/* Info */}
                        <div className="p-5 space-y-3">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-2xl font-extrabold text-blue-600">${Number(item.price).toFixed(2)}</span>
                            <span className="text-xs font-semibold text-gray-500">{item.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Botón flotante del carrito ─────────────── */}
      {cartCount > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 bg-gray-900 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-3 font-semibold text-sm hover:bg-gray-700 transition-all z-40 animate-bounce"
        >
          🛒 Ver carrito
          <span className="bg-white text-gray-900 text-xs font-extrabold px-2 py-0.5 rounded-full">{cartCount}</span>
          <span className="text-gray-300">·</span>
          <span>${cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* ── Panel del carrito (slide-in) ──────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />

          {/* Panel */}
          <div className="w-full max-w-sm bg-white shadow-2xl flex flex-col h-full animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-900 text-white">
              <h2 className="font-bold text-lg">🛒 Tu pedido</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-300 hover:text-white text-xl">✕</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center pt-10">El carrito está vacío</p>
              ) : cart.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-sm"
                    onError={(e) => { e.currentTarget.onerror = null; (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK["General"]; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">${c.price.toFixed(2)} c/u</p>
                  </div>
                  {/* Qty */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => changeQty(c.id, -1)}
                      className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
                    >−</button>
                    <span className="w-6 text-center font-bold text-sm">{c.quantity}</span>
                    <button onClick={() => changeQty(c.id, 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
                    >+</button>
                  </div>
                  <span className="text-sm font-bold w-16 text-right">${(c.price * c.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(c.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t px-5 py-4 space-y-3 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="# Mesa (opcional)"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <textarea
                placeholder="Notas especiales (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              />
              {orderError && (
                <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg px-3 py-2">
                  {orderError}
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold border-t pt-2">
                <span>Total ({cartCount} items)</span>
                <span className="text-xl font-extrabold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleOrder}
                disabled={ordering || cart.length === 0}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition disabled:opacity-60"
              >
                {ordering ? "Enviando a cocina..." : "✅ Confirmar pedido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de éxito ────────────────────────── */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-extrabold mb-1">¡Pedido enviado!</h3>
            <p className="text-gray-500 text-sm mb-2">Tu orden fue enviada a cocina correctamente.</p>
            <p className="text-lg font-bold bg-gray-100 rounded-lg py-2 px-4 mb-5">
              🔖 {orderSuccess}
            </p>
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold hover:bg-gray-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default MenuPage;
