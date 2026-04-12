import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UtensilsCrossed } from "lucide-react";
import { loginUser } from "../services/authService";

const LoginPage = () => {
  // Guarda el usuario escrito
  const [usuario, setUsuario] = useState("");

  // Guarda la contraseña escrita
  const [contrasena, setContrasena] = useState("");

  // Guarda mensaje de error
  const [error, setError] = useState("");

  // Indica si el login está procesando
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Si ya hay token, manda al admin
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Llama al backend con usuario y contraseña
      const data = await loginUser(usuario, contrasena);

      // Guarda token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirige al admin si el login fue exitoso
      navigate("/admin");
    } catch (err: unknown) {
      // Muestra error si el backend rechazó el login
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-card rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-black">Iniciar Sesión</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistema de Gestión de Restaurante
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 bg-muted rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1 text-black">Credenciales de prueba:</p>
            <p className="text-muted-foreground">Admin: admin / admin123</p>
            <p className="text-muted-foreground">Cocina: cocina / cocina123</p>
            <p className="text-muted-foreground">Mesero: mesero / mesero123</p>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs bg-foreground text-background">
        © 2026 SIGER - Sistema de Gestión de Restaurante
      </footer>
    </div>
  );
};

export default LoginPage;