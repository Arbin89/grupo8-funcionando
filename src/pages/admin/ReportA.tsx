import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reportesMock = [
  {
    id: 1,
    nombre: "Juan Perez",
    email: "juan@gmail.com",
    tipo: "Queja",
    descripcion: "El pedido tardo mas de lo esperado.",
    fecha: "03/03/2026",
  },
  {
    id: 2,
    nombre: "Maria Rodriguez",
    email: "maria@gmail.com",
    tipo: "Sugerencia",
    descripcion: "Agregar mas opciones vegetarianas.",
    fecha: "02/03/2026",
  },
  {
    id: 3,
    nombre: "Carlos Lopez",
    email: "carlos@gmail.com",
    tipo: "Error en el sistema",
    descripcion: "No me dejo finalizar el pago.",
    fecha: "01/03/2026",
  },
];

const ReportA = () => {
  return (
    <div className="space-y-6 p-6">
      <Button asChild variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100">
        <Link to="/admin">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </Button>

      <Card className="border-amber-200/70 bg-gradient-to-r from-white to-amber-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-slate-900">Panel de Reportes</CardTitle>
          <CardDescription>Vista alternativa para seguimiento interno de incidencias.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {reportesMock.map((reporte) => (
          <Card key={reporte.id} className="border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{reporte.tipo}</h2>
                <Badge className="border border-amber-200 bg-amber-100 text-amber-800">
                  {reporte.fecha}
                </Badge>
              </div>

              <p className="text-sm text-slate-600">
                <strong>Nombre:</strong> {reporte.nombre}
              </p>

              <p className="text-sm text-slate-600">
                <strong>Email:</strong> {reporte.email}
              </p>

              <p className="text-sm text-slate-700">{reporte.descripcion}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button className="bg-amber-500 text-black hover:bg-amber-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar como resuelto
                </Button>

                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportA;
