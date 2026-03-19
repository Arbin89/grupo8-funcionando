import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus, KitchenOrder } from "../services/kitchenService";

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 border-yellow-300", dot: "bg-yellow-400" },
  en_proceso: { label: "En proceso", color: "bg-blue-100 text-blue-800 border-blue-300", dot: "bg-blue-500" },
  lista: { label: "Lista ✓", color: "bg-green-100 text-green-800 border-green-300", dot: "bg-green-500" },
  entregada: { label: "Entregada", color: "bg-gray-100 text-gray-600 border-gray-300", dot: "bg-gray-400" },
};

const NEXT_STATUS: Record<string, string> = {
  pendiente: "en_proceso",
  en_proceso: "lista",
  lista: "entregada",
};

const NEXT_LABEL: Record<string, string> = {
  pendiente: "▶ Iniciar",
  en_proceso: "✔ Marcar lista",
  lista: "📦 Entregar",
};

const CocinaPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("activas");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar órdenes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // Auto-refresh cada 15 segundos
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const filtered =
    filter === "activas"
      ? orders.filter((o) => o.status !== "entregada")
      : filter === "entregadas"
        ? orders.filter((o) => o.status === "entregada")
        : orders;

  const handleStatusChange = async (order: KitchenOrder) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, next);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    return date.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });
  };

  const pendingCount = orders.filter((o) => o.status === "pendiente").length;
  const inProcessCount = orders.filter((o) => o.status === "en_proceso").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition text-sm"
          >← Volver</button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">🍳 Pantalla de Cocina</h1>
            <p className="text-gray-400 text-xs mt-0.5">Se actualiza automáticamente cada 15 segundos</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-yellow-400">{pendingCount}</p>
            <p className="text-xs text-gray-400">Pendientes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-blue-400">{inProcessCount}</p>
            <p className="text-xs text-gray-400">En proceso</p>
          </div>
          <button onClick={load} className="text-sm border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "activas", label: "Activas" },
            { key: "todas", label: "Todas" },
            { key: "entregadas", label: "Entregadas" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === f.key
                ? "bg-white text-gray-900"
                : "border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                }`}
            >{f.label}</button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-white rounded-full animate-spin mb-3" />
            <p>Cargando órdenes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-3">🍽️</p>
            <p>No hay órdenes en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((order) => {
              const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pendiente;
              const nextStatus = NEXT_STATUS[order.status];
              const orderTotal = order.items.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0);
              return (
                <div key={order.id}
                  className={`bg-gray-900 border rounded-2xl overflow-hidden flex flex-col ${order.status === "entregada" ? "border-gray-800 opacity-50" : "border-gray-700"
                    }`}
                >
                  {/* Card header */}
                  <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
                    <div>
                      <p className="font-extrabold text-base tracking-wide">{order.order_number}</p>
                      <p className="text-xs text-gray-400">{formatTime(order.created_at)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${st.color.replace("text-", "text-").replace("bg-", "bg-opacity-20 bg-")}`}
                      style={{ background: "transparent" }}
                    >
                      <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  {/* Notas */}
                  {order.notes && (
                    <div className="px-4 py-2 bg-yellow-900/20 border-b border-yellow-900/30">
                      <p className="text-xs text-yellow-400">📝 {order.notes}</p>
                    </div>
                  )}

                  {/* Items */}
                  <div className="flex-1 px-4 py-3 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.item_image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop"}
                          alt={item.item_name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => { e.currentTarget.onerror = null; (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.item_name}</p>
                          <p className="text-xs text-gray-400">${Number(item.unit_price).toFixed(2)} c/u</p>
                        </div>
                        <span className="bg-gray-800 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-400 font-semibold">
                      ${orderTotal.toFixed(2)}
                    </span>
                    {nextStatus && (
                      <button
                        onClick={() => handleStatusChange(order)}
                        disabled={updatingId === order.id}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${order.status === "pendiente"
                          ? "bg-blue-600 hover:bg-blue-500"
                          : order.status === "en_proceso"
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-gray-600 hover:bg-gray-500"
                          } disabled:opacity-50`}
                      >
                        {updatingId === order.id ? "..." : NEXT_LABEL[order.status]}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CocinaPage;