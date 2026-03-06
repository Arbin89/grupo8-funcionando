import { Link } from "react-router-dom";

const reportesMock = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@gmail.com",
    tipo: "Queja",
    descripcion: "El pedido tardó más de lo esperado.",
    fecha: "03/03/2026",
  },
  {
    id: 2,
    nombre: "María Rodríguez",
    email: "maria@gmail.com",
    tipo: "Sugerencia",
    descripcion: "Agregar más opciones vegetarianas.",
    fecha: "02/03/2026",
  },
  {
    id: 3,
    nombre: "Carlos López",
    email: "carlos@gmail.com",
    tipo: "Error en el sistema",
    descripcion: "No me dejó finalizar el pago.",
    fecha: "01/03/2026",
  },
];

const ReportA = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          Panel de Reportes (Admin)
        </h1>

        <div className="space-y-4">
          {reportesMock.map((reporte) => (
            <div
              key={reporte.id}
              className="bg-white shadow-md rounded-xl p-5 border"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">
                  {reporte.tipo}
                </h2>
                <span className="text-sm text-gray-500">
                  {reporte.fecha}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Nombre:</strong> {reporte.nombre}
              </p>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {reporte.email}
              </p>

              <p className="text-gray-700">
                {reporte.descripcion}
              </p>

              <div className="mt-4 flex gap-3">
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:opacity-90">
                  Marcar como resuelto
                </button>

                <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:opacity-90">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ReportA;