import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-foreground mb-4 animate-fade-in">
          Bienvenido a SIGER
        </h1>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Disfruta de la mejor experiencia gastronómica
        </p>
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link
            to="/reservar"
            className="bg-foreground text-background px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition text-sm"
          >
            Hacer Reserva
          </Link>
          <Link
            to="/menu"
            className="border border-foreground text-foreground px-6 py-2.5 rounded-full font-medium hover:bg-foreground hover:text-background transition text-sm"
          >
            Ver Menú
          </Link>
        </div>
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground bg-foreground text-background">
        © 2026 SIGER - Sistema de Gestión de Restaurante
      </footer>
    </div>
  );
};

export default Index;
