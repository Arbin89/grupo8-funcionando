import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/services/api";

// Elimina símbolos markdown del texto
function cleanMarkdown(raw: string): string {
  return raw
    .replace(/^#{1,6}\s+/gm, "")        // ### títulos
    .replace(/\*\*(.+?)\*\*/g, "$1")    // **negrita**
    .replace(/\*(.+?)\*/g, "$1")        // *cursiva*
    .replace(/__(.+?)__/g, "$1")        // __negrita__
    .replace(/_(.+?)_/g, "$1");         // _cursiva_
}

// Renderiza texto plano con soporte de listas
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
        <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-1 my-2 pl-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">{item}</li>
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
    } else {
      flushList();
      if (trimmed) {
        elements.push(
          <p key={idx} className="text-sm leading-relaxed">{trimmed}</p>
        );
      } else {
        elements.push(<div key={`gap-${idx}`} className="h-1" />);
      }
    }
  });
  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export default function IATestPage() {
  // Test 1 — Reporte Diario
  const [reporteRes, setReporteRes] = useState<any>(null);
  const [reporteLoading, setReporteLoading] = useState(false);
  const [reporteError, setReporteError] = useState("");

  // Test 2 — Alertas Inventario
  const [alertasRes, setAlertasRes] = useState<any>(null);
  const [alertasLoading, setAlertasLoading] = useState(false);
  const [alertasError, setAlertasError] = useState("");

  // Test 3 — Sugerencias Menú
  const [sugerenciasRes, setSugerenciasRes] = useState<any>(null);
  const [sugerenciasLoading, setSugerenciasLoading] = useState(false);
  const [sugerenciasError, setSugerenciasError] = useState("");

  // Test 4 — Chat
  const [chatInput, setChatInput] = useState("");
  const [chatRes, setChatRes] = useState<any>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  // Test 5 — Resumen Día
  const [resumenFecha, setResumenFecha] = useState(new Date().toISOString().split("T")[0]);
  const [resumenProcesados, setResumenProcesados] = useState("10");
  const [resumenCompletados, setResumenCompletados] = useState("8");
  const [resumenPendientes, setResumenPendientes] = useState("2");
  const [resumenObservacion, setResumenObservacion] = useState("Operación sin incidentes");
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test de Endpoints IA</h1>
      <p className="text-muted-foreground text-sm">
        Verifica que cada endpoint de la IA responde correctamente.
      </p>

      {/* Sección 1 — Reporte Diario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test: Reporte Diario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={testReporte} disabled={reporteLoading} size="sm">
            {reporteLoading ? "Probando..." : "Probar reporte"}
          </Button>
          {reporteError && <p className="text-red-500 text-sm">{reporteError}</p>}
          {reporteRes && (
            <div className="bg-muted p-4 rounded max-h-64 overflow-y-auto">
              <FormattedText text={reporteRes.reporte ?? JSON.stringify(reporteRes, null, 2)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección 2 — Alertas Inventario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test: Alertas Inventario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={testAlertas} disabled={alertasLoading} size="sm">
            {alertasLoading ? "Probando..." : "Probar alertas"}
          </Button>
          {alertasError && <p className="text-red-500 text-sm">{alertasError}</p>}
          {alertasRes && (
            <div className="bg-muted p-4 rounded max-h-64 overflow-y-auto">
              <FormattedText text={alertasRes.alertas ?? JSON.stringify(alertasRes, null, 2)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección 3 — Sugerencias Menú */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test: Sugerencias Menú</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={testSugerencias} disabled={sugerenciasLoading} size="sm">
            {sugerenciasLoading ? "Probando..." : "Probar sugerencias"}
          </Button>
          {sugerenciasError && <p className="text-red-500 text-sm">{sugerenciasError}</p>}
          {sugerenciasRes && (
            <div className="bg-muted p-4 rounded max-h-64 overflow-y-auto">
              <FormattedText text={sugerenciasRes.sugerencias ?? JSON.stringify(sugerenciasRes, null, 2)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección 4 — Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test: Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe un mensaje de prueba..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={testChat} disabled={chatLoading || !chatInput.trim()} size="sm">
              {chatLoading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
          {chatError && <p className="text-red-500 text-sm">{chatError}</p>}
          {chatRes && (
            <div className="bg-muted p-4 rounded max-h-64 overflow-y-auto">
              <FormattedText text={chatRes.respuesta ?? JSON.stringify(chatRes, null, 2)} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección 5 — Resumen Día */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Test: Resumen Día</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Fecha</label>
              <Input
                value={resumenFecha}
                onChange={(e) => setResumenFecha(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Registros Procesados</label>
              <Input
                type="number"
                value={resumenProcesados}
                onChange={(e) => setResumenProcesados(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Completados</label>
              <Input
                type="number"
                value={resumenCompletados}
                onChange={(e) => setResumenCompletados(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Pendientes</label>
              <Input
                type="number"
                value={resumenPendientes}
                onChange={(e) => setResumenPendientes(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs text-muted-foreground">Observación Clave</label>
              <Input
                value={resumenObservacion}
                onChange={(e) => setResumenObservacion(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={testResumen} disabled={resumenLoading} size="sm">
            {resumenLoading ? "Probando..." : "Probar resumen"}
          </Button>
          {resumenError && <p className="text-red-500 text-sm">{resumenError}</p>}
          {resumenRes && (
            <div className="bg-muted p-4 rounded max-h-64 overflow-y-auto">
              <FormattedText text={resumenRes.resumen ?? JSON.stringify(resumenRes, null, 2)} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
