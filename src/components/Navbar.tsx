import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Tablet", path: "/menu" },
  { label: "Cocina", path: "/cocina" },
  { label: "Admin", path: "/admin" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar-gradient px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-primary-foreground font-bold text-xl">
        <UtensilsCrossed className="w-6 h-6" />
        SIGER
      </Link>
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm font-medium transition-colors hover:text-primary-foreground/80 ${
              location.pathname === item.path
                ? "text-primary-foreground"
                : "text-primary-foreground/70"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/login"
          className="bg-foreground text-primary-foreground text-sm px-5 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
