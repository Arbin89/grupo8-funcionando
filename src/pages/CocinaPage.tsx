import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Flame,
  Loader2,
  RefreshCw,
  Search,
  Timer,
  UtensilsCrossed,
  CheckCheck,
  Zap,
  Package,
} from "lucide-react";
import { getOrders, KitchenOrder, updateOrderStatus } from "../services/kitchenService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderStatus = "pendiente" | "en_proceso" | "lista" | "entregada";
type StatusFilter = "todas" | OrderStatus;

const ORDER_STATUSES: OrderStatus[] = ["pendiente", "en_proceso", "lista", "entregada"];

// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    accentColor: string;
    dotColor: string;
    cardBorder: string;
    headerBg: string;
    badgeBg: string;
    badgeText: string;
    nextStatus: OrderStatus | null;
    actionLabel: string;
    actionStyle: string;
    icon: React.ElementType;
  }
> = {
  pendiente: {
    label: "Pendiente",
    accentColor: "#f97316",
    dotColor: "bg-orange-400",
    cardBorder: "border-orange-500/20",
    headerBg: "bg-orange-500/5",
    badgeBg: "bg-orange-500/10",
    badgeText: "text-orange-300",
    nextStatus: "en_proceso",
    actionLabel: "Iniciar",
    actionStyle: "bg-sky-500 hover:bg-sky-400 text-white",
    icon: Clock,
  },
  en_proceso: {
    label: "En proceso",
    accentColor: "#0ea5e9",
    dotColor: "bg-sky-400",
    cardBorder: "border-sky-500/20",
    headerBg: "bg-sky-500/5",
    badgeBg: "bg-sky-500/10",
    badgeText: "text-sky-300",
    nextStatus: "lista",
    actionLabel: "Lista ✓",
    actionStyle: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold",
    icon: Zap,
  },
  lista: {
    label: "Lista",
    accentColor: "#10b981",
    dotColor: "bg-emerald-400",
    cardBorder: "border-emerald-500/20",
    headerBg: "bg-emerald-500/5",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
    nextStatus: "entregada",
    actionLabel: "Entregar",
    actionStyle: "bg-amber-400 hover:bg-amber-300 text-black font-semibold",
    icon: Package,
  },
  entregada: {
    label: "Entregada",
    accentColor: "#64748b",
    dotColor: "bg-slate-500",
    cardBorder: "border-slate-600/20",
    headerBg: "bg-slate-700/10",
    badgeBg: "bg-slate-700/30",
    badgeText: "text-slate-400",
    nextStatus: null,
    actionLabel: "Entregada",
    actionStyle: "bg-slate-700 text-slate-400 cursor-default",
    icon: CheckCheck,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeStatus = (status: string): OrderStatus => {
  const v = status.toLowerCase().trim().replace(/\s+/g, "_");
  if ((ORDER_STATUSES as string[]).includes(v)) return v as OrderStatus;
  return "pendiente";
};

const formatHour = (d: string) =>
  new Date(d).toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });

const elapsedMinutes = (d: string, now: number) =>
  Math.max(0, Math.floor((now - new Date(d).getTime()) / 60000));

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 2 }).format(v);

const isOrderMatch = (order: KitchenOrder, q: string) => {
  if (!q.trim()) return true;
  const n = q.toLowerCase();
  return (
    order.order_number.toLowerCase().includes(n) ||
    (order.notes ?? "").toLowerCase().includes(n) ||
    order.items.some((i) => i.item_name.toLowerCase().includes(n))
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ElapsedPill = ({ minutes }: { minutes: number }) => {
  const color =
    minutes >= 25
      ? "text-red-400 bg-red-400/10 border-red-400/30"
      : minutes >= 15
      ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
      : "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}>
      <Timer className="h-3 w-3" />
      {minutes}m
    </span>
  );
};

const PulsingDot = ({ colorClass }: { colorClass: string }) => (
  <span className="relative flex h-2.5 w-2.5">
    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${colorClass}`} />
    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colorClass}`} />
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CocinaPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("todas");
  const [searchText, setSearchText] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [nowRef, setNowRef] = useState(Date.now());

  const fetchOrders = useCallback(async (showMain = false) => {
    showMain ? setLoading(true) : setRefreshing(true);
    setError("");
    try {
      const data = await getOrders();
      setOrders(data);
      setLastUpdatedAt(new Date());
      setNowRef(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar órdenes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void fetchOrders(true); }, [fetchOrders]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => void fetchOrders(false), 15000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchOrders]);

  useEffect(() => {
    const id = setInterval(() => setNowRef(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const counts = useMemo(() => {
    const acc = { pendiente: 0, en_proceso: 0, lista: 0, entregada: 0 };
    orders.forEach((o) => acc[normalizeStatus(o.status)]++);
    return acc;
  }, [orders]);

  const visibleOrders = useMemo(
    () =>
      orders
        .filter((o) => filter === "todas" || normalizeStatus(o.status) === filter)
        .filter((o) => isOrderMatch(o, searchText)),
    [orders, filter, searchText],
  );

  const ordersByStatus = useMemo(() => {
    const g: Record<OrderStatus, KitchenOrder[]> = {
      pendiente: [], en_proceso: [], lista: [], entregada: [],
    };
    visibleOrders.forEach((o) => g[normalizeStatus(o.status)].push(o));
    ORDER_STATUSES.forEach((s) =>
      g[s].sort((a, b) => {
        const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return s === "entregada" ? -diff : diff;
      }),
    );
    return g;
  }, [visibleOrders]);

  const handleStatusChange = async (order: KitchenOrder) => {
    const next = STATUS_META[normalizeStatus(order.status)].nextStatus;
    if (!next) return;
    setUpdatingId(order.id);
    setError("");
    try {
      await updateOrderStatus(order.id, next);
      await fetchOrders(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar la orden.");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusesToRender = filter === "todas" ? ORDER_STATUSES : [filter as OrderStatus];
  const lastUpdatedLabel = lastUpdatedAt
    ? lastUpdatedAt.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  // ─── Stat card strip ────────────────────────────────────────────────────────

  const statItems = [
    { key: "pendiente", label: "Pendientes", count: counts.pendiente, color: "text-orange-400", border: "border-orange-500/25" },
    { key: "en_proceso", label: "En proceso", count: counts.en_proceso, color: "text-sky-400", border: "border-sky-500/25" },
    { key: "lista", label: "Listas", count: counts.lista, color: "text-emerald-400", border: "border-emerald-500/25" },
    { key: "entregada", label: "Entregadas", count: counts.entregada, color: "text-slate-400", border: "border-slate-600/30" },
  ] as const;

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      {/* ── Background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-orange-600/6 blur-[120px]" />
        <div className="absolute right-[-5%] top-[15%] h-[400px] w-[400px] rounded-full bg-sky-600/5 blur-[120px]" />
        <div className="absolute bottom-[5%] left-[35%] h-[350px] w-[350px] rounded-full bg-emerald-600/5 blur-[120px]" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0a0c10]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between gap-4 px-5 py-3 md:px-8">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 ring-1 ring-orange-500/30">
                <ChefHat className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400/70">Centro de Producción</p>
                <h1 className="text-xl font-black leading-tight tracking-tight text-white">Pantalla de Cocina</h1>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Last update */}
            <div className="hidden items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 md:flex">
              <Clock className="h-3.5 w-3.5" />
              {lastUpdatedLabel}
            </div>

            {/* Auto refresh toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
              <span>Auto</span>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>

            {/* Refresh button */}
            <Button
              onClick={() => void fetchOrders(false)}
              disabled={refreshing}
              className="h-8 gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 text-xs font-semibold text-orange-300 hover:bg-orange-500/20 hover:text-orange-200"
              variant="ghost"
            >
              {refreshing
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <RefreshCw className="h-3.5 w-3.5" />}
              Actualizar
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 mx-auto w-full max-w-[1720px] space-y-4 px-5 py-5 md:px-8">

        {/* ── Stat strip ── */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {statItems.map(({ key, label, count, color, border }) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? "todas" : key as StatusFilter)}
              className={`group relative overflow-hidden rounded-xl border ${border} bg-white/[0.025] px-4 py-3 text-left transition hover:bg-white/[0.045] ${filter === key ? "ring-1 ring-white/20" : ""}`}
            >
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${color}`}>{label}</p>
              <p className="mt-1 text-4xl font-black tabular-nums text-white">{count}</p>
              {filter === key && (
                <div className={`absolute bottom-0 left-0 h-0.5 w-full ${color.replace("text-", "bg-")}`} />
              )}
            </button>
          ))}
        </div>

        {/* ── Search bar ── */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar por número de orden, nota o ítem…"
            className="h-10 rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 text-sm text-slate-100 placeholder:text-slate-600 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
            <p className="text-sm text-slate-500">Cargando flujo de cocina…</p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/[0.07]">
            <UtensilsCrossed className="h-10 w-10 text-slate-700" />
            <p className="font-semibold text-slate-400">Sin órdenes para este filtro</p>
            <p className="text-xs text-slate-600">Las nuevas comandas aparecerán aquí automáticamente.</p>
          </div>
        ) : (
          /* ── Kanban ── */
          <div className={`grid gap-3 ${statusesToRender.length > 1 ? "xl:grid-cols-4" : ""}`}>
            {statusesToRender.map((status) => {
              const meta = STATUS_META[status];
              const colOrders = ordersByStatus[status];
              const Icon = meta.icon;

              return (
                <div key={status} className="flex flex-col gap-2.5">
                  {/* Column header */}
                  <div className={`flex items-center justify-between rounded-xl border ${meta.cardBorder} ${meta.headerBg} px-3.5 py-2.5`}>
                    <div className="flex items-center gap-2.5">
                      <PulsingDot colorClass={meta.dotColor} />
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm font-bold tracking-wide text-white">{meta.label}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.badgeBg} ${meta.badgeText}`}>
                      {colOrders.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <ScrollArea className="h-[62vh] min-h-[380px] rounded-xl">
                    <div className="space-y-2.5 pb-4 pr-1">
                      {colOrders.length === 0 ? (
                        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-white/[0.07] text-xs text-slate-600">
                          Sin órdenes aquí
                        </div>
                      ) : (
                        colOrders.map((order) => {
                          const currentMeta = STATUS_META[normalizeStatus(order.status)];
                          const minutes = elapsedMinutes(order.created_at, nowRef);
                          const total = order.items.reduce(
                            (sum, item) => sum + Number(item.unit_price) * item.quantity, 0
                          );
                          const isUpdating = updatingId === order.id;

                          return (
                            <div
                              key={order.id}
                              className={`rounded-xl border ${currentMeta.cardBorder} bg-[#111318] p-4 shadow-md shadow-black/40 transition-all hover:border-white/15`}
                            >
                              {/* Top row */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-mono text-base font-black tracking-wider text-white">
                                    {order.order_number}
                                  </p>
                                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    {formatHour(order.created_at)}
                                  </p>
                                </div>
                                <ElapsedPill minutes={minutes} />
                              </div>

                              {/* Notes */}
                              {order.notes && (
                                <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-amber-200/80">
                                  💬 {order.notes}
                                </div>
                              )}

                              {/* Items */}
                              <div className="mt-3 space-y-1.5">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2"
                                  >
                                    {item.item_image_url ? (
                                      <img
                                        src={item.item_image_url}
                                        alt={item.item_name}
                                        className="h-9 w-9 flex-shrink-0 rounded-md object-cover ring-1 ring-white/10"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                      />
                                    ) : (
                                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-slate-800 text-base">
                                        {item.item_emoji || "🍽️"}
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-semibold text-slate-100">{item.item_name}</p>
                                      <p className="text-xs text-slate-500">{formatCurrency(Number(item.unit_price))} c/u</p>
                                    </div>
                                    <span className="rounded-md border border-white/10 bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-200">
                                      ×{item.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Footer */}
                              <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                                <div className="flex items-center gap-1.5 text-sm font-black text-white">
                                  <Flame className="h-4 w-4 text-orange-400" />
                                  {formatCurrency(total)}
                                </div>

                                {currentMeta.nextStatus ? (
                                  <Button
                                    size="sm"
                                    disabled={isUpdating}
                                    onClick={() => void handleStatusChange(order)}
                                    className={`h-8 rounded-lg px-4 text-xs font-semibold transition ${currentMeta.actionStyle}`}
                                  >
                                    {isUpdating
                                      ? <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" />Actualizando…</>
                                      : currentMeta.actionLabel}
                                  </Button>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                    <CheckCheck className="h-3.5 w-3.5" /> Entregada
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CocinaPage;
