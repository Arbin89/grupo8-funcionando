import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section con Parallax */}
        <div className="relative w-full h-screen overflow-hidden bg-black">
          <div
            className="absolute inset-0"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop"
              alt="SIGER Restaurant"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay oscuro mejorado */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40"></div>

          {/* Contenido del Hero */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 max-w-6xl mx-auto">
            <div className="text-white">
              <p className="text-sm font-light tracking-widest mb-6 text-gray-300 uppercase">Visita nuestro restaurante</p>
              <h1 className="text-7xl md:text-8xl font-serif font-light mb-8 tracking-tight">
                HAZ TU RESERVA EN <span className="font-bold">SIGER</span>
              </h1>
              <p className="text-xl font-light text-gray-200 max-w-xl mb-12">
                Una experiencia gastronómica extraordinaria con los mejores ingredientes y preparaciones
              </p>
              <div className="flex gap-6">
                <Link
                  to="/reservar"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 font-semibold text-lg transition transform hover:scale-105 uppercase tracking-wider"
                >
                  Reservar
                </Link>
                <Link
                  to="/menu"
                  className="border-2 border-white text-white px-8 py-3 font-light text-lg hover:bg-white hover:text-black transition uppercase tracking-wider"
                >
                  Ver Menú
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sobre SIGER - Elegante */}
        <section className="py-32 px-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-6xl font-serif font-light mb-8 text-black">
                Bienvenido a <span className="font-bold">SIGER</span>
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-800 font-serif font-light leading-relaxed text-justify">
                  En SIGER fusionamos la tradición culinaria con ingredientes frescos y técnicas modernas para ofrecerte una experiencia gastronómica única.
                </p>
                <p className="text-lg text-gray-800 font-serif font-light leading-relaxed text-justify">
                  Nuestro menú cuidadosamente seleccionado refleja un compromiso con la calidad, la creatividad y la excelencia en cada plato.
                </p>
              </div>
              <div className="flex gap-4 mt-12">
                <Link
                  to="/menu"
                  className="bg-black text-white px-8 py-3 font-light uppercase tracking-widest hover:bg-gray-900 transition text-sm"
                >
                  Ver Menú Completo
                </Link>
                <Link
                  to="/reservar"
                  className="border border-black text-black px-8 py-3 font-light uppercase tracking-widest hover:bg-black hover:text-white transition text-sm"
                >
                  Reservar Mesa
                </Link>
              </div>
            </div>
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ transform: `translateY(${Math.max(0, 100 - scrollY * 0.3)}px)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=500&fit=crop"
                alt="Restaurant ambiance"
                className="w-full h-96 object-cover hover:scale-110 transition duration-700"
              />
            </div>
          </div>
        </section>

        {/* Características - Elegante */}
        <section className="bg-gray-50 py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-6xl font-serif font-light mb-20 text-center text-black">
              ¿Por Qué <span className="font-bold">SIGER</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-12 hover:shadow-2xl transition duration-500">
                <div className="text-6xl mb-6">🍽️</div>
                <h3 className="text-2xl font-serif font-light mb-4 text-black">Menú Exquisito</h3>
                <p className="text-gray-600 font-light leading-relaxed text-justify">Más de 100 platos cuidadosamente seleccionados con los mejores ingredientes del mercado</p>
              </div>
              <div className="bg-white p-12 hover:shadow-2xl transition duration-500">
                <div className="text-6xl mb-6">👨‍🍳</div>
                <h3 className="text-2xl font-serif font-light mb-4 text-black">Chef Experto</h3>
                <p className="text-gray-600 font-light leading-relaxed text-justify">Nuestro equipo de cocineros profesionales prepara cada plato con pasión y precisión</p>
              </div>
              <div className="bg-white p-12 hover:shadow-2xl transition duration-500">
                <div className="text-6xl mb-6">⭐</div>
                <h3 className="text-2xl font-serif font-light mb-4 text-black">Calidad Premium</h3>
                <p className="text-gray-600 font-light leading-relaxed text-justify">Ingredientes frescos y de primera calidad para garantizar una experiencia inolvidable</p>
              </div>
            </div>
          </div>
        </section>

        {/* Info y Reserva - Elegante */}
        <section className="bg-black text-white py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Información */}
              <div>
                <h2 className="text-5xl font-serif font-light mb-16 text-white">
                  Visita Nuestro <span className="font-bold">Restaurante</span>
                </h2>

                <div className="space-y-12">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 mt-1">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg mb-2">Dirección</h3>
                      <p className="text-gray-300 font-light">Avenida Principal 123, Centro, 10000</p>
                      <p className="text-gray-300 font-light">Santo Domingo, República Dominicana</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 mt-1">
                      <Phone className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg mb-2">Teléfono</h3>
                      <p className="text-gray-300 font-light">+1 (809) 555-0123</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg mb-2">Horario</h3>
                      <p className="text-gray-300 font-light">Lunes a Viernes: 12:00 PM - 11:00 PM</p>
                      <p className="text-gray-300 font-light">Sábado y Domingo: 1:00 PM - 12:00 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 mt-1">
                      <Mail className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg mb-2">Email</h3>
                      <p className="text-gray-300 font-light">info@siger.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col justify-center">
                <div className="border border-gray-700 p-16">
                  <h3 className="text-4xl font-serif font-light mb-6">Reserva tu Mesa Hoy</h3>
                  <p className="text-gray-300 mb-12 leading-relaxed font-light text-justify">
                    Asegura tu lugar en SIGER y disfruta de una experiencia culinaria extraordinaria. Nuestro equipo está listo para recibirte.
                  </p>
                  <div className="space-y-4">
                    <Link
                      to="/reservar"
                      className="block bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 font-semibold text-lg transition text-center uppercase tracking-widest"
                    >
                      Reservar Mesa
                    </Link>
                    <Link
                      to="/menu"
                      className="block border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 font-light text-lg transition text-center uppercase tracking-widest"
                    >
                      Ver Menú
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-xl font-light mb-4">SIGER</h3>
              <p className="text-gray-400 text-sm font-light">Sistema de Gestión de Restaurante</p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-light mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/menu" className="text-gray-400 hover:text-white transition font-light">Menú</Link></li>
                <li><Link to="/reservar" className="text-gray-400 hover:text-white transition font-light">Reservar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl font-light mb-4">Contacto</h3>
              <p className="text-gray-400 text-sm font-light">+1 (809) 555-0123</p>
              <p className="text-gray-400 text-sm font-light">info@siger.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm font-light">© 2026 SIGER - Ofreciendo la mejor experiencia gastronómica</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
