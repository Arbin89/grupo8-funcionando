import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UtensilsCrossed } from "lucide-react";

const LoginPage = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend only - navigate to admin
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-card rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-primary">Iniciar Sesión</h2>
            </div>
            <p className="text-sm text-muted-foreground">Sistema de Gestión de Restaurante</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Contraseña</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-foreground text-background py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 bg-muted rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">Credenciales de prueba:</p>
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
