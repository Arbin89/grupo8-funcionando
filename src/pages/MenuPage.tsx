import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMenuItems, MenuItem } from "../services/menuService";
import { createOrder, CartItem } from "../services/kitchenService";
import {
  ShoppingCart, X, Plus, Minus, Trash2, Loader2,
  ChevronUp, ChevronDown, ChevronsUpDown, CheckCircle2, Sparkles,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_FALLBACK: Record<string, string> = {
  Entradas:   "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&q=80",
  Principales:"https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80",
  Postres:    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop&q=80",
  Bebidas:    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop&q=80",
  General:    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80",
};

const CATEGORY_COLORS: Record<string, string> = {
  Entradas:   "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Principales:"border-orange-500/30 bg-orange-500/10 text-orange-300",
  Postres:    "border-pink-500/30 bg-pink-500/10 text-pink-300",
  Bebidas:    "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  General:    "border-slate-500/30 bg-slate-700/20 text-slate-400",
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 2 }).format(v);

// ─── Component ────────────────────────────────────────────────────────────────

const MenuPage = () => {
  const [items, setItems]           = useState<MenuItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [priceSort, setPriceSort]   = useState<"asc" | "desc" | null>(null);

  // Cart
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes]           = useState("");
  const [ordering, setOrdering]     = useState(false);
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
  if (priceSort === "asc")  filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  if (priceSort === "desc") filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));

  const getImage = (item: MenuItem) =>
    item.image_url?.trim() ? item.image_url : (CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK["General"]);

  // ── Cart actions ──────────────────────────────────────────────────────────

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, {
        id: item.id, name: item.name, emoji: "",
        image_url: item.image_url || CATEGORY_FALLBACK[item.category] || CATEGORY_FALLBACK["General"],
        price: Number(item.price), quantity: 1,
      }];
    });
  };

  const changeQty = (id: number, delta: number) =>
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0));

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleOrder = async () => {
    if (!cart.length) return;
    setOrdering(true); setOrderError(null);
    try {
      const order = await createOrder({
        items: cart.map((c) => ({ name: c.name, emoji: "", image_url: c.image_url, price: c.price, quantity: c.quantity })),
        notes: notes || undefined,
        table_number: tableNumber || undefined,
      });
      setCart([]); setCartOpen(false); setNotes(""); setTableNumber("");
      setOrderSuccess(order.order_number);
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : "Error al enviar la orden");
    } finally {
      setOrdering(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[460px] w-[460px] rounded-full bg-orange-600/6 blur-[140px]" />
        <div className="absolute right-[-5%] top-[20%] h-[380px] w-[380px] rounded-full bg-sky-600/5 blur-[120px]" />
        <div className="absolute bottom-[6%] left-[38%] h-[320px] w-[320px] rounded-full bg-emerald-600/4 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      {/* ── Hero ── */}
      <div className="relative z-10 overflow-hidden border-b border-white/[0.07]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=400&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10]/60 via-[#0a0c10]/50 to-[#0a0c10]" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 text-center md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
            <Sparkles className="h-3.5 w-3.5" />
            Menú del restaurante
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            Nuestro <span className="text-orange-500">Menú</span>
          </h1>
          <p className="mt-3 text-base text-slate-400 md:text-lg">
            Platos preparados con los mejores ingredientes frescos.
          </p>
        </div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 md:px-8">

        {/* ── Filters ── */}
        <div className="mb-6 space-y-3">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPriceSort(null); }}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30"
                    : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price sort */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600">Ordenar por precio:</span>
            {[
              { val: null,   label: "Predeterminado", icon: ChevronsUpDown },
              { val: "asc",  label: "Menor a mayor",  icon: ChevronUp      },
              { val: "desc", label: "Mayor a menor",  icon: ChevronDown    },
            ].map(({ val, label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setPriceSort(val as typeof priceSort)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-semibold transition ${
                  priceSort === val
                    ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300"
                }`}
              >
                <Icon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
            <p className="text-sm">Cargando menú…</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 text-slate-600">
            <p className="text-sm">No hay platos disponibles en esta categoría.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              const catCls = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS["General"];

              return (
                <div
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111318] shadow-md shadow-black/30 transition-all hover:-translate-y-1 hover:border-white/15 hover:shadow-xl hover:shadow-black/40"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImage(item)}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK["General"]; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Category badge */}
                    <span className={`absolute left-3 top-3 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${catCls}`}>
                      {item.category}
                    </span>

                    {/* In-cart indicator */}
                    {inCart && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[11px] font-black text-black">
                        {inCart.quantity}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-bold text-slate-100 leading-tight">{item.name}</h3>
                    <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{item.description}</p>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="text-xl font-black tabular-nums text-white">
                        {formatCurrency(Number(item.price))}
                      </span>

                      {inCart ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.05] text-slate-300 transition hover:bg-white/[0.1]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold text-white">{inCart.quantity}</span>
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 transition hover:bg-orange-500/20"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-black transition hover:bg-orange-400 active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" /> Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Floating cart button ── */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border border-orange-500/30 bg-[#111318] px-5 py-3.5 shadow-[0_8px_30px_-6px_rgba(249,115,22,0.4)] transition hover:shadow-[0_8px_30px_-6px_rgba(249,115,22,0.6)]"
        >
          <ShoppingCart className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-bold text-white">Ver pedido</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] font-black text-black">
            {cartCount}
          </span>
          <span className="text-xs font-semibold text-slate-400">{formatCurrency(cartTotal)}</span>
        </button>
      )}

      {/* ── Cart panel ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

          <div className="flex h-full w-full max-w-sm flex-col bg-[#0e1014] shadow-2xl" style={{ animation: "slideIn .25s ease-out" }}>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="h-4 w-4 text-orange-400" />
                <h2 className="font-black text-white">Tu pedido</h2>
                {cartCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] font-black text-black">{cartCount}</span>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-lg border border-white/[0.08] p-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-slate-600">
                  <ShoppingCart className="h-8 w-8" />
                  <p className="text-sm">El carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                      <img
                        src={c.image_url}
                        alt={c.name}
                        className="h-12 w-12 flex-shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK["General"]; }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-100">{c.name}</p>
                        <p className="text-xs text-slate-600">{formatCurrency(c.price)} c/u</p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1">
                        <button onClick={() => changeQty(c.id, -1)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.06]">
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white">{c.quantity}</span>
                        <button onClick={() => changeQty(c.id, 1)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 transition hover:bg-orange-500/20">
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      <span className="w-16 text-right text-sm font-black tabular-nums text-white">
                        {formatCurrency(c.price * c.quantity)}
                      </span>
                      <button onClick={() => removeFromCart(c.id)} className="text-slate-600 transition hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3 border-t border-white/[0.07] px-5 py-4">
              <input
                type="text"
                placeholder="# Mesa (opcional)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className={inputCls}
              />
              <textarea
                placeholder="Notas especiales (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className={`${inputCls} resize-none`}
              />

              {orderError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{orderError}</div>
              )}

              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span className="text-sm text-slate-500">{cartCount} ítem{cartCount !== 1 ? "s" : ""}</span>
                <span className="text-xl font-black tabular-nums text-white">{formatCurrency(cartTotal)}</span>
              </div>

              <button
                onClick={() => void handleOrder()}
                disabled={ordering || !cart.length}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-black shadow-[0_6px_20px_-6px_rgba(249,115,22,0.6)] transition hover:bg-orange-400 disabled:opacity-50"
              >
                {ordering
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando a cocina…</>
                  : "Confirmar pedido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success modal ── */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-emerald-500/20 bg-[#13151c] p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h3 className="mt-4 text-xl font-black text-white">¡Pedido enviado!</h3>
            <p className="mt-2 text-sm text-slate-400">Tu orden fue enviada a cocina correctamente.</p>
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 px-4">
              <p className="font-mono text-sm font-bold text-orange-300">{orderSuccess}</p>
            </div>
            <button
              onClick={() => setOrderSuccess(null)}
              className="mt-5 w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MenuPage;