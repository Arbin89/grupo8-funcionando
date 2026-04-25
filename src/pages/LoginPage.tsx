import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AlertCircle, LockKeyhole, ShieldCheck, UtensilsCrossed, User } from "lucide-react";
import { loginUser } from "../services/authService";
import {
  clearSession,
  getToken,
  isTokenExpired,
  saveToken,
  saveUser,
} from "../services/tokenService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  // Si ya hay token válido, manda al admin.
  useEffect(() => {
    const token = getToken();

    if (token && !isTokenExpired(token)) {
      navigate("/admin");
      return;
    }

    if (token && isTokenExpired(token)) {
      clearSession();
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

      // Guarda token y usuario con seguridad (sin espacios en blanco)
      saveToken(data.token);
      saveUser(data.user);

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
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,#fff4d6_0%,#fff9eb_30%,#ffffff_65%)] dark:bg-[radial-gradient(circle_at_top_left,#151a25_0%,#0d1119_34%,#0a0c10_68%)]">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 md:px-8">
        <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl dark:bg-indigo-500/20" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-72 w-72 rounded-full bg-yellow-300/25 blur-3xl dark:bg-sky-500/15" />

        <Card className="relative z-10 w-full max-w-5xl overflow-hidden border-amber-200/70 shadow-[0_30px_80px_-35px_rgba(120,53,15,0.45)] dark:border-white/10 dark:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.85)]">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-between bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-400 p-8 text-amber-950 md:p-10">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm font-semibold">
                  <UtensilsCrossed className="h-4 w-4" />
                  SIGER ACCESS
                </div>

                <h2 className="text-3xl font-black leading-tight md:text-4xl">
                  Bienvenido al panel de gestión del restaurante
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-amber-950/85">
                  Controla reservas, inventario, cocina y reportes desde un entorno seguro, rápido y centralizado.
                </p>
              </div>

              <div className="mt-8 space-y-3 rounded-xl border border-white/35 bg-white/30 p-4 text-sm">
                <p className="font-semibold">Credenciales de prueba</p>
                <p>Admin: admin / admin123</p>
                <p>Cocina: cocina / cocina123</p>
                <p>Mesero: mesero / mesero123</p>
              </div>
            </div>

            <div className="bg-card p-8 md:p-10">
              <CardHeader className="px-0 pb-6 pt-0">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-orange-500/15 dark:text-orange-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white">Iniciar sesión</CardTitle>
                <CardDescription className="text-sm">
                  Accede con tu usuario para administrar SIGER.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuario</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="usuario"
                        type="text"
                        autoComplete="username"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="h-11 border-slate-200 pl-10 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-100"
                        placeholder="Ingresa tu usuario"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contrasena">Contraseña</Label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contrasena"
                        type="password"
                        autoComplete="current-password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="h-11 border-slate-200 pl-10 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-100"
                        placeholder="Ingresa tu contraseña"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error de autenticación</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full bg-amber-500 font-semibold text-black hover:bg-amber-400"
                  >
                    {loading ? "Ingresando..." : "Ingresar al sistema"}
                  </Button>
                </form>
              </CardContent>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;