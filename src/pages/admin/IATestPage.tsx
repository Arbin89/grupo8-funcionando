import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Beaker, Loader2, MessageSquareText, Sparkles, TerminalSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/services/api";

function cleanMarkdown(raw: string): string {
  return raw
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  const cleaned = cleanMarkdown(text);
  const lines = cleaned.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="my-2 list-inside list-disc space-y-1 pl-2">
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

  return <div className="space-y-1">{elements}</div>;
}

const inputCls =
  "h-10 border-white/[0.08] bg-white/[0.04] text-slate-100 placeholder:text-slate-600";

export default function IATestPage() {
  const [reporteRes, setReporteRes] = useState<any>(null);
  const [reporteLoading, setReporteLoading] = useState(false);
  const [reporteError, setReporteError] = useState("");

  const [alertasRes, setAlertasRes] = useState<any>(null);
  const [alertasLoading, setAlertasLoading] = useState(false);
  const [alertasError, setAlertasError] = useState("");

  const [sugerenciasRes, setSugerenciasRes] = useState<any>(null);
  const [sugerenciasLoading, setSugerenciasLoading] = useState(false);
  const [sugerenciasError, setSugerenciasError] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatRes, setChatRes] = useState<any>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const [resumenFecha, setResumenFecha] = useState(new Date().toISOString().split("T")[0]);
  const [resumenProcesados, setResumenProcesados] = useState("10");
  const [resumenCompletados, setResumenCompletados] = useState("8");
  const [resumenPendientes, setResumenPendientes] = useState("2");
  const [resumenObservacion, setResumenObservacion] = useState("Operacion sin incidentes");
  const [resumenRes, setResumenRes] = useState<any>(null);
  const [resumenLoading, setResumenLoading] = useState(false);
  const [resumenError, setResumenError] = useState("");

  async function testReporte() {
    setReporteLoading(true);
    setReporteError("");
    try {
      const data = await apiRequest("/ai/reporte-diario");
      setReporteRes(data);
    } catch (e: any) {
      setReporteError(e.message);
    } finally {
      setReporteLoading(false);
    }
  }

  async function testAlertas() {
    setAlertasLoading(true);
    setAlertasError("");
    try {
      const data = await apiRequest("/ai/alertas-inventario");
      setAlertasRes(data);
    } catch (e: any) {
      setAlertasError(e.message);
    } finally {
      setAlertasLoading(false);
    }
  }

  async function testSugerencias() {
    setSugerenciasLoading(true);
    setSugerenciasError("");
    try {
      const data = await apiRequest("/ai/sugerencias-menu");
      setSugerenciasRes(data);
    } catch (e: any) {
      setSugerenciasError(e.message);
    } finally {
      setSugerenciasLoading(false);
    }
  }

  async function testChat() {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    setChatError("");
    try {
      const data = await apiRequest("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ mensaje: chatInput }),
      });
      setChatRes(data);
    } catch (e: any) {
      setChatError(e.message);
    } finally {
      setChatLoading(false);
    }
  }

  async function testResumen() {
    setResumenLoading(true);
    setResumenError("");
    try {
      const data = await apiRequest("/ai/resumen-dia", {
        method: "POST",
        body: JSON.stringify({
          fecha: resumenFecha,
          registrosProcesados: Number(resumenProcesados),
          completados: Number(resumenCompletados),
          pendientes: Number(resumenPendientes),
          observacionClave: resumenObservacion,
        }),
      });
      setResumenRes(data);
    } catch (e: any) {
      setResumenError(e.message);
    } finally {
      setResumenLoading(false);
    }
  }

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
              Test de Endpoints IA
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Validacion funcional de cada endpoint con respuestas de prueba.
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3.5 py-2 text-sm font-semibold text-orange-300">
            <Beaker className="h-4 w-4" />
            Entorno de pruebas
          </div>
        </div>

        {(reporteError || alertasError || sugerenciasError || chatError || resumenError) && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {reporteError || alertasError || sugerenciasError || chatError || resumenError}
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="border-white/[0.07] bg-[#111318] text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4 text-orange-400" /> Test: Reporte Diario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => void testReporte()} disabled={reporteLoading} className="bg-orange-500 text-black hover:bg-orange-400">
                {reporteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Probando...
                  </>
                ) : (
                  "Probar reporte"
                )}
              </Button>
              {reporteRes && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0f1117] p-4">
                  <FormattedText text={reporteRes.reporte ?? JSON.stringify(reporteRes, null, 2)} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/[0.07] bg-[#111318] text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <TerminalSquare className="h-4 w-4 text-orange-400" /> Test: Alertas Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => void testAlertas()} disabled={alertasLoading} className="bg-orange-500 text-black hover:bg-orange-400">
                {alertasLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Probando...
                  </>
                ) : (
                  "Probar alertas"
                )}
              </Button>
              {alertasRes && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0f1117] p-4">
                  <FormattedText text={alertasRes.alertas ?? JSON.stringify(alertasRes, null, 2)} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/[0.07] bg-[#111318] text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4 text-orange-400" /> Test: Sugerencias Menu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => void testSugerencias()} disabled={sugerenciasLoading} className="bg-orange-500 text-black hover:bg-orange-400">
                {sugerenciasLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Probando...
                  </>
                ) : (
                  "Probar sugerencias"
                )}
              </Button>
              {sugerenciasRes && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0f1117] p-4">
                  <FormattedText text={sugerenciasRes.sugerencias ?? JSON.stringify(sugerenciasRes, null, 2)} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/[0.07] bg-[#111318] text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <MessageSquareText className="h-4 w-4 text-orange-400" /> Test: Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un mensaje de prueba..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={inputCls}
                />
                <Button onClick={() => void testChat()} disabled={chatLoading || !chatInput.trim()} className="bg-orange-500 text-black hover:bg-orange-400">
                  {chatLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </div>
              {chatRes && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0f1117] p-4">
                  <FormattedText text={chatRes.respuesta ?? JSON.stringify(chatRes, null, 2)} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/[0.07] bg-[#111318] text-slate-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Test: Resumen Dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha</label>
                <Input value={resumenFecha} onChange={(e) => setResumenFecha(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registros procesados</label>
                <Input type="number" value={resumenProcesados} onChange={(e) => setResumenProcesados(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completados</label>
                <Input type="number" value={resumenCompletados} onChange={(e) => setResumenCompletados(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pendientes</label>
                <Input type="number" value={resumenPendientes} onChange={(e) => setResumenPendientes(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1 md:col-span-2 lg:col-span-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Observacion</label>
                <Input value={resumenObservacion} onChange={(e) => setResumenObservacion(e.target.value)} className={inputCls} />
              </div>
            </div>

            <Button onClick={() => void testResumen()} disabled={resumenLoading} className="bg-orange-500 text-black hover:bg-orange-400">
              {resumenLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Probando...
                </>
              ) : (
                "Probar resumen"
              )}
            </Button>

            {resumenRes && (
              <div className="max-h-64 overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0f1117] p-4">
                <FormattedText text={resumenRes.resumen ?? JSON.stringify(resumenRes, null, 2)} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
