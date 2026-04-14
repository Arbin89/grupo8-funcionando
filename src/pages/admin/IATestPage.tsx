import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/services/api";

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
            {reporteLoading ? "Probando..." : "Probar GET /ai/reporte-diario"}
          </Button>
          {reporteError && <p className="text-red-500 text-sm">{reporteError}</p>}
          {reporteRes && (
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(reporteRes, null, 2)}
            </pre>
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
            {alertasLoading ? "Probando..." : "Probar GET /ai/alertas-inventario"}
          </Button>
          {alertasError && <p className="text-red-500 text-sm">{alertasError}</p>}
          {alertasRes && (
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(alertasRes, null, 2)}
            </pre>
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
            {sugerenciasLoading ? "Probando..." : "Probar GET /ai/sugerencias-menu"}
          </Button>
          {sugerenciasError && <p className="text-red-500 text-sm">{sugerenciasError}</p>}
          {sugerenciasRes && (
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(sugerenciasRes, null, 2)}
            </pre>
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
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(chatRes, null, 2)}
            </pre>
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
            {resumenLoading ? "Probando..." : "Probar POST /ai/resumen-dia"}
          </Button>
          {resumenError && <p className="text-red-500 text-sm">{resumenError}</p>}
          {resumenRes && (
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(resumenRes, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
