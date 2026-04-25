import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import { getToken, isTokenExpired } from "../services/tokenService";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Cocina", path: "/cocina" },
  { label: "Administrador", path: "/admin" },
  { label: "Reporte", path: "/reportes"}
];

const Navbar = () => {
  const location = useLocation();
  const token = getToken();
  const isLoggedIn = !!token && !isTokenExpired(token);

  return (
    <nav className="navbar-gradient px-6 py-[17px] flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-black font-bold text-xl">
        <UtensilsCrossed className="w-6 h-6 text-black" />
        SIGER
      </Link>
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-[22px] font-medium transition-colors hover:text-black/80 ${
              location.pathname === item.path
                ? "text-black"
                : "text-black/75"
            }`}
          >
            {item.label}
          </Link>
        ))}
        {!isLoggedIn && (
          <Link
            to="/login"
            className="bg-white text-black text-[22px] px-5 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Iniciar Sesion
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
