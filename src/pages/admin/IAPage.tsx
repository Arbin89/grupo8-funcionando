import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Loader2, MessageSquare, Sparkles, TriangleAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAlertasInventario,
  getReporteDiario,
  getSugerenciasMenu,
  chat,
} from "@/services/aiService";

function cleanMarkdown(raw: string): string {
  return raw
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

function FormattedText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;

  const cleaned = cleanMarkdown(text);
  const lines = cleaned.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="my-1 list-inside list-disc space-y-1 pl-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const listMatch = trimmed.match(/^[-•]\s+(.+)/) ?? trimmed.match(/^\d+\.\s+(.+)/);

    if (listMatch) {
      listItems.push(listMatch[1]);
      return;
    }

    flushList();

    if (trimmed) {
      elements.push(
        <p key={idx} className="text-sm leading-relaxed text-slate-300">
          {trimmed}
        </p>
      );
    } else {
      elements.push(<div key={`gap-${idx}`} className="h-1" />);
    }
  });

  flushList();

  return <div className={`space-y-1 ${className ?? ""}`}>{elements}</div>;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function IAPage() {
  const [reporteTexto, setReporteTexto] = useState("");
  const [reporteDatos, setReporteDatos] = useState<any>(null);
  const [reporteLoading, setReporteLoading] = useState(false);
  const [reporteError, setReporteError] = useState("");

  const [alertasTexto, setAlertasTexto] = useState("");
  const [alertasItems, setAlertasItems] = useState<any[]>([]);
  const [alertasLoading, setAlertasLoading] = useState(false);
  const [alertasError, setAlertasError] = useState("");

  const [sugerenciasTexto, setSugerenciasTexto] = useState("");
  const [sugerenciasLoading, setSugerenciasLoading] = useState(false);
  const [sugerenciasError, setSugerenciasError] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMensaje, setInputMensaje] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void cargarAlertas();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function cargarReporte() {
    setReporteLoading(true);
    setReporteError("");
    try {
      const data = await getReporteDiario();
      setReporteTexto(data.reporte);
      setReporteDatos(data.datos);
    } catch (e: any) {
      setReporteError(e.message || "Error al generar el reporte");
    } finally {
      setReporteLoading(false);
    }
  }

  async function cargarAlertas() {
    setAlertasLoading(true);
    setAlertasError("");
    try {
      const data = await getAlertasInventario();
      setAlertasTexto(data.alertas);
      setAlertasItems(data.items);
    } catch (e: any) {
      setAlertasError(e.message || "Error al cargar alertas");
    } finally {
      setAlertasLoading(false);
    }
  }

  async function cargarSugerencias() {
    setSugerenciasLoading(true);
    setSugerenciasError("");
    try {
      const data = await getSugerenciasMenu();
      setSugerenciasTexto(data.sugerencias);
    } catch (e: any) {
      setSugerenciasError(e.message || "Error al generar sugerencias");
    } finally {
      setSugerenciasLoading(false);
    }
  }

  async function enviarMensaje() {
    const texto = inputMensaje.trim();
    if (!texto || chatLoading) return;

    setInputMensaje("");
    setChatError("");
    setMessages((prev) => [...prev, { role: "user", text: texto }]);
    setChatLoading(true);

    try {
      const data = await chat(texto);
      setMessages((prev) => [...prev, { role: "assistant", text: data.respuesta }]);
    } catch (e: any) {
      setChatError(e.message || "Error al enviar el mensaje");
    } finally {
      setChatLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      void enviarMensaje();
    }
  }

  const metricCards = [
    {
      label: "Reservas hoy",
      value: reporteDatos?.reservas?.total ?? 0,
      accent: "text-indigo-400",
      border: "border-indigo-500/20",
      glow: "bg-indigo-500/8",
    },
    {
      label: "Stock bajo",
      value: reporteDatos?.inventarioBajo?.length ?? 0,
      accent: "text-amber-400",
      border: "border-amber-500/20",
      glow: "bg-amber-500/8",
    },
    {
      label: "Platos populares",
      value: reporteDatos?.platosPopulares?.length ?? 0,
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
      glow: "bg-emerald-500/8",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-4%] h-[430px] w-[430px] rounded-full bg-orange-600/6 blur-[130px]" />
        <div className="absolute right-[-4%] top-[24%] h-[360px] w-[360px] rounded-full bg-sky-600/5 blur-[120px]" />
        <div className="absolute bottom-[6%] left-[42%] h-[310px] w-[310px] rounded-full bg-emerald-600/4 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] space-y-5 px-5 py-8 md:px-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al panel
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400/70">
              Inteligencia Artificial
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Asistente IA
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Reportes, alertas, recomendaciones y chat operativo para administración.
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3.5 py-2 text-sm font-semibold text-orange-300">
            <Sparkles className="h-4 w-4" />
            Modo análisis en tiempo real
          </div>
        </div>

        {(reporteError || alertasError || sugerenciasError || chatError) && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {reporteError || alertasError || sugerenciasError || chatError}
          </div>
        )}

        <div className="rounded-2xl border border-white/[0.07] bg-[#111318] p-3">
          <Tabs defaultValue="reporte" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 lg:grid-cols-4">
              <TabsTrigger
                value="reporte"
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 data-[state=active]:border-orange-500/30 data-[state=active]:bg-orange-500/12 data-[state=active]:text-orange-200"
              >
                Reporte del Dia
              </TabsTrigger>
              <TabsTrigger
                value="alertas"
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 data-[state=active]:border-orange-500/30 data-[state=active]:bg-orange-500/12 data-[state=active]:text-orange-200"
              >
                Alertas Inventario
              </TabsTrigger>
              <TabsTrigger
                value="sugerencias"
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 data-[state=active]:border-orange-500/30 data-[state=active]:bg-orange-500/12 data-[state=active]:text-orange-200"
              >
                Sugerencias Menu
              </TabsTrigger>
              <TabsTrigger
                value="asistente"
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 data-[state=active]:border-orange-500/30 data-[state=active]:bg-orange-500/12 data-[state=active]:text-orange-200"
              >
                Asistente Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reporte" className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Bot className="h-4 w-4 text-orange-400" />
                  Genera resumen ejecutivo con contexto de reservas, inventario y menu.
                </div>
                <Button
                  onClick={() => void cargarReporte()}
                  disabled={reporteLoading}
                  className="bg-orange-500 text-black hover:bg-orange-400"
                >
                  {reporteLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    "Generar reporte"
                  )}
                </Button>
              </div>

              {reporteTexto && (
                <>
                  <div className="rounded-2xl border border-white/[0.07] bg-[#0f1117] p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orange-400" />
                      <h3 className="text-sm font-bold text-white">Reporte del dia</h3>
                    </div>
                    <FormattedText text={reporteTexto} />
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {metricCards.map((m) => (
                      <div key={m.label} className={`relative overflow-hidden rounded-xl border ${m.border} bg-[#111318] p-4`}>
                        <div className={`absolute inset-0 opacity-80 ${m.glow}`} />
                        <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {m.label}
                        </p>
                        <p className={`relative mt-2 text-3xl font-black ${m.accent}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="alertas" className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <TriangleAlert className="h-4 w-4 text-orange-400" />
                  Monitorea ingredientes con stock critico y sugerencias de accion.
                </div>
                <Button
                  onClick={() => void cargarAlertas()}
                  disabled={alertasLoading}
                  className="bg-orange-500 text-black hover:bg-orange-400"
                >
                  {alertasLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    "Actualizar alertas"
                  )}
                </Button>
              </div>

              {!alertasLoading && alertasTexto && (
                <>
                  <div className="rounded-2xl border border-white/[0.07] bg-[#0f1117] p-5">
                    <h3 className="mb-3 text-sm font-bold text-white">Analisis IA de inventario</h3>
                    <FormattedText text={alertasTexto} />
                  </div>

                  {alertasItems.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111318]">
                      <div className="border-b border-white/[0.06] px-5 py-3.5">
                        <p className="text-sm font-bold text-white">Detalle de items con riesgo</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/[0.05] text-left">
                              {["Producto", "Categoria", "Stock actual", "Stock minimo"].map((h) => (
                                <th
                                  key={h}
                                  className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {alertasItems.map((item, idx) => (
                              <tr key={idx} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                                <td className="px-5 py-3.5 font-semibold text-slate-100">{item.name}</td>
                                <td className="px-5 py-3.5 text-slate-500">{item.categoria ?? "-"}</td>
                                <td className="px-5 py-3.5 font-semibold text-red-400">{item.stock_available}</td>
                                <td className="px-5 py-3.5 text-slate-400">{item.stock_minimum}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                      {alertasTexto}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="sugerencias" className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Sparkles className="h-4 w-4 text-orange-400" />
                  Crea propuestas de especiales del dia basadas en inventario y demanda.
                </div>
                <Button
                  onClick={() => void cargarSugerencias()}
                  disabled={sugerenciasLoading}
                  className="bg-orange-500 text-black hover:bg-orange-400"
                >
                  {sugerenciasLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    "Generar sugerencias"
                  )}
                </Button>
              </div>

              {sugerenciasTexto && (
                <div className="rounded-2xl border border-white/[0.07] bg-[#0f1117] p-5">
                  <h3 className="mb-3 text-sm font-bold text-white">Especiales sugeridos</h3>
                  <FormattedText text={sugerenciasTexto} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="asistente" className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/[0.07] bg-[#111318] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-orange-400" />
                  <h3 className="text-sm font-bold text-white">Chat con asistente IA</h3>
                </div>

                <div className="h-[420px] overflow-y-auto rounded-xl border border-white/[0.06] bg-[#0f1117] p-3">
                  {messages.length === 0 && (
                    <p className="mt-8 text-center text-sm text-slate-600">
                      Escribe un mensaje para comenzar...
                    </p>
                  )}

                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2.5 text-sm ${
                            msg.role === "user"
                              ? "border border-orange-500/30 bg-orange-500/10 text-orange-100"
                              : "border border-white/[0.08] bg-white/[0.04] text-slate-200"
                          }`}
                        >
                          {msg.role === "user" ? msg.text : <FormattedText text={msg.text} />}
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-500">
                          Escribiendo...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Escribe tu pregunta..."
                    value={inputMensaje}
                    onChange={(e) => setInputMensaje(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={chatLoading}
                    className="h-10 border-white/[0.08] bg-white/[0.04] text-slate-100 placeholder:text-slate-600"
                  />
                  <Button
                    onClick={() => void enviarMensaje()}
                    disabled={chatLoading || !inputMensaje.trim()}
                    className="bg-orange-500 text-black hover:bg-orange-400"
                  >
                    {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
