import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import {
  getReporteDiario,
  getAlertasInventario,
  getSugerenciasMenu,
  chat,
} from "@/services/aiService";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function IAPage() {
  // Tab 1 — Reporte del Día
  const [reporteTexto, setReporteTexto] = useState("");
  const [reporteDatos, setReporteDatos] = useState<any>(null);
  const [reporteLoading, setReporteLoading] = useState(false);
  const [reporteError, setReporteError] = useState("");

  // Tab 2 — Alertas de Inventario
  const [alertasTexto, setAlertasTexto] = useState("");
  const [alertasItems, setAlertasItems] = useState<any[]>([]);
  const [alertasLoading, setAlertasLoading] = useState(false);
  const [alertasError, setAlertasError] = useState("");

  // Tab 3 — Sugerencias del Menú
  const [sugerenciasTexto, setSugerenciasTexto] = useState("");
  const [sugerenciasLoading, setSugerenciasLoading] = useState(false);
  const [sugerenciasError, setSugerenciasError] = useState("");

  // Tab 4 — Asistente
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMensaje, setInputMensaje] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar alertas automáticamente al montar
  useEffect(() => {
    cargarAlertas();
  }, []);

  // Scroll automático al último mensaje
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
    if (e.key === "Enter") enviarMensaje();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Asistente IA</h1>
      <p className="text-muted-foreground text-sm">
        Análisis inteligente impulsado por Gemini 2.0 Flash
      </p>

      <Tabs defaultValue="reporte">
        <TabsList className="mb-4">
          <TabsTrigger value="reporte">Reporte del Día</TabsTrigger>
          <TabsTrigger value="alertas">Alertas de Inventario</TabsTrigger>
          <TabsTrigger value="sugerencias">Sugerencias del Menú</TabsTrigger>
          <TabsTrigger value="asistente">Asistente</TabsTrigger>
        </TabsList>

        {/* TAB 1 — Reporte del Día */}
        <TabsContent value="reporte" className="space-y-4">
          <Button onClick={cargarReporte} disabled={reporteLoading}>
            {reporteLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              "Generar Reporte"
            )}
          </Button>

          {reporteError && (
            <p className="text-red-500 text-sm">{reporteError}</p>
          )}

          {reporteTexto && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reporte del Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {reporteTexto}
                  </p>
                </CardContent>
              </Card>

              {reporteDatos && (
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Total reservas hoy</p>
                      <p className="text-2xl font-bold">
                        {reporteDatos.reservas?.total ?? 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Items con stock bajo</p>
                      <p className="text-2xl font-bold">
                        {reporteDatos.inventarioBajo?.length ?? 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Platos populares</p>
                      <p className="text-2xl font-bold">
                        {reporteDatos.platosPopulares?.length ?? 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* TAB 2 — Alertas de Inventario */}
        <TabsContent value="alertas" className="space-y-4">
          {alertasLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analizando inventario...
            </div>
          )}

          {alertasError && (
            <p className="text-red-500 text-sm">{alertasError}</p>
          )}

          {!alertasLoading && alertasTexto && (
            <>
              {alertasItems.length === 0 ? (
                <Badge variant="default" className="bg-green-600 text-white text-sm px-3 py-1">
                  {alertasTexto}
                </Badge>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Análisis de Alertas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {alertasTexto}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Detalle de Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Stock actual</TableHead>
                            <TableHead>Stock mínimo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {alertasItems.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.categoria ?? "—"}</TableCell>
                              <TableCell className="text-red-600 font-semibold">
                                {item.stock_available}
                              </TableCell>
                              <TableCell>{item.stock_minimum}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </TabsContent>

        {/* TAB 3 — Sugerencias del Menú */}
        <TabsContent value="sugerencias" className="space-y-4">
          <Button onClick={cargarSugerencias} disabled={sugerenciasLoading}>
            {sugerenciasLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              "Generar Sugerencias"
            )}
          </Button>

          {sugerenciasError && (
            <p className="text-red-500 text-sm">{sugerenciasError}</p>
          )}

          {sugerenciasTexto && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Especiales del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {sugerenciasTexto}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 4 — Asistente */}
        <TabsContent value="asistente" className="space-y-4">
          <Card className="h-[420px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Chat con el Asistente</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.length === 0 && (
                <p className="text-muted-foreground text-sm text-center mt-8">
                  Escribe un mensaje para comenzar...
                </p>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm italic">
                    Escribiendo...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>

          {chatError && (
            <p className="text-red-500 text-sm">{chatError}</p>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu pregunta..."
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chatLoading}
              className="flex-1"
            />
            <Button onClick={enviarMensaje} disabled={chatLoading || !inputMensaje.trim()}>
              {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
