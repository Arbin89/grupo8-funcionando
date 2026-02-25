import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const CreateReservationPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">Crear Reserva</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Completa el formulario para reservar tu mesa
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Tu nombre" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="personas">Personas</label>
              <input id="personas" type="number" min="1" max="20" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="¿Cuántas personas?" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="fecha">Fecha</label>
              <input id="fecha" type="date" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="hora">Hora</label>
              <input id="hora" type="time" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Reservar</button>
          </form>
          <Link to="/" className="block mt-6 text-center text-indigo-500 hover:underline text-sm">Volver al inicio</Link>
        </div>
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground bg-foreground text-background">
        © 2026 SIGER - Sistema de Gestión de Restaurante
      </footer>
    </div>
  );
};

export default CreateReservationPage;
