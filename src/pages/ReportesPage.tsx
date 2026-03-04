import { Link } from "react-router-dom";

const ReportesPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <Link
  to="/"
  className="inline-block mb-4 text-sm text-blue-600 hover:underline"
>
  ← Volver
</Link>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Generar Reporte
        </h1>

        <form className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ingrese su nombre"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Reporte
            </label>
            <select
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Queja</option>
              <option>Sugerencia</option>
              <option>Error en el sistema</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              rows={4}
              placeholder="Describa el problema o sugerencia"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Enviar Reporte
          </button>

        </form>

      </div>
    </div>
  );
};

export default ReportesPage;