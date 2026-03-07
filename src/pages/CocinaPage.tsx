import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { getItems, InventoryItem } from "../services/inventoryService";

const getEstado = (available: number, minimum: number): string => {
  if (minimum === 0) return "Óptimo";
  const ratio = available / minimum;
  if (ratio > 1.5) return "Óptimo";
  if (ratio > 1) return "Bajo";
  return "Crítico";
};

const estadoBadge: Record<string, { variant: "default" | "secondary" | "destructive"; color: string }> = {
  "Óptimo": { variant: "default", color: "bg-green-500" },
  "Bajo": { variant: "secondary", color: "bg-yellow-400" },
  "Crítico": { variant: "destructive", color: "bg-red-500" },
};

const CocinaPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getItems()
      .then((data) => setItems(data.filter((i) => i.status === "activo")))
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar datos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center py-10">
      <Card className="w-full max-w-3xl shadow-2xl border-2 border-blue-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-4xl text-blue-700 font-extrabold drop-shadow-lg">Stock de Ingredientes</CardTitle>
            <Button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              ← Volver
            </Button>
          </div>
          <CardDescription className="text-lg mt-2 text-blue-500">
            Cantidad de ingredientes disponibles al momento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-blue-500 py-6">Cargando inventario...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-6">{error}</p>
          ) : (
            <Table>
              <TableCaption className="text-blue-400 font-medium">Actualizado en tiempo real</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-blue-100 text-blue-700">Ingrediente</TableHead>
                  <TableHead className="bg-blue-100 text-blue-700">Stock</TableHead>
                  <TableHead className="bg-blue-100 text-blue-700">Categoría</TableHead>
                  <TableHead className="bg-blue-100 text-blue-700">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const estado = getEstado(item.stock_available, item.stock_minimum);
                  return (
                    <TableRow key={item.id} className="hover:bg-blue-50 transition-all">
                      <TableCell className="font-semibold text-blue-900 text-lg">{item.name}</TableCell>
                      <TableCell className="text-blue-800 text-lg">
                        {item.stock_available}
                        {item.stock_available <= item.stock_minimum && (
                          <span className="ml-2 text-xs text-red-500">(mín. {item.stock_minimum})</span>
                        )}
                      </TableCell>
                      <TableCell className="text-blue-800 text-lg">{item.category_name ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={estadoBadge[estado].variant}
                          className={estadoBadge[estado].color + " text-white px-4 py-1 text-base shadow-md"}
                        >
                          {estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No hay productos en el inventario.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CocinaPage;