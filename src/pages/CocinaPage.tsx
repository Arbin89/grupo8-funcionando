
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const ingredientes = [
  { nombre: "Lechuga", stock: 25, unidad: "unidades", estado: "Óptimo" },
  { nombre: "Carne", stock: 10, unidad: "kg", estado: "Bajo" },
  { nombre: "Salsa", stock: 5, unidad: "litros", estado: "Óptimo" },
  { nombre: "Queso", stock: 2, unidad: "kg", estado: "Crítico" },
  { nombre: "Tomate", stock: 15, unidad: "unidades", estado: "Óptimo" },
  { nombre: "Pan", stock: 8, unidad: "unidades", estado: "Bajo" },
];

const estadoBadge = {
  "Óptimo": { variant: "default", color: "bg-green-500" },
  "Bajo": { variant: "secondary", color: "bg-yellow-400" },
  "Crítico": { variant: "destructive", color: "bg-red-500" },
};

const CocinaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center py-10">
      <Card className="w-full max-w-3xl shadow-2xl border-2 border-blue-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-4xl text-blue-700 font-extrabold drop-shadow-lg">Stock de Ingredientes</CardTitle>
            <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200">
              ← Volver
            </Button>
          </div>
          <CardDescription className="text-lg mt-2 text-blue-500">Cantidad de ingredientes que disponemos al momento</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption className="text-blue-400 font-medium">Actualizado hoy</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-blue-100 text-blue-700">Ingrediente</TableHead>
                <TableHead className="bg-blue-100 text-blue-700">Stock</TableHead>
                <TableHead className="bg-blue-100 text-blue-700">Unidad</TableHead>
                <TableHead className="bg-blue-100 text-blue-700">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredientes.map((item) => (
                <TableRow key={item.nombre} className="hover:bg-blue-50 transition-all">
                  <TableCell className="font-semibold text-blue-900 text-lg">{item.nombre}</TableCell>
                  <TableCell className="text-blue-800 text-lg">{item.stock}</TableCell>
                  <TableCell className="text-blue-800 text-lg">{item.unidad}</TableCell>
                  <TableCell>
                    <Badge variant={estadoBadge[item.estado].variant} className={estadoBadge[item.estado].color + " text-white px-4 py-1 text-base shadow-md"}>
                      {item.estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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