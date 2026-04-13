import { useState } from "react";
import { Link } from "react-router-dom";
import { createReport } from "../services/reportService";

const TIPOS = ["Queja", "Sugerencia", "Error en el sistema", "Otro"];

const ReportesPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "Queja",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createReport(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", type: "Queja", description: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <Link to="/" className="bg-foreground text-primary-foreground text-sm px-5 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity">
          ← Volver
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-center text-black">Enviar Reporte</h1>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="text-5xl">✅</div>
            <p className="text-green-700 font-semibold text-lg">¡Reporte enviado correctamente!</p>
            <p className="text-sm text-gray-500">Nuestro equipo lo revisará en breve.</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Enviar otro reporte
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Nombre:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ingrese su nombre"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="correo@ejemplo.com"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Tipo de Reporte:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describa el problema o sugerencia"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar Reporte"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportesPage;