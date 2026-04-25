import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, UtensilsCrossed, X } from "lucide-react";
import {
  clearSession,
  getToken,
  getUser,
  getUserRole,
  isTokenExpired,
} from "../services/tokenService";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Cocina", path: "/cocina" },
  { label: "Administrador", path: "/admin" },
  { label: "Reporte", path: "/reportes" },
];

const getSessionState = () => {
  const token = getToken();
  return {
    isLoggedIn: !!token && !isTokenExpired(token),
    user: getUser(),
  };
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState(getSessionState);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const isLoggedIn = session.isLoggedIn;
  const role = getUserRole();
  const visibleNavItems = navItems.filter((item) =>
    item.path === "/admin" ? role === "admin" : true,
  );
  const currentLabel = useMemo(
    () => visibleNavItems.find((item) => location.pathname.startsWith(item.path))?.label,
    [location.pathname, visibleNavItems],
  );

  useEffect(() => {
    setSession(getSessionState());
    setMobileOpen(false);
    setIsVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    const onStorageChange = () => setSession(getSessionState());
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollYRef.current;
      const delta = currentY - previousY;

      // Always show near the top for better discoverability.
      if (currentY <= 20) {
        setIsVisible(true);
        lastScrollYRef.current = currentY;
        return;
      }

      // Ignore tiny movements to prevent jitter.
      if (Math.abs(delta) < 8) {
        return;
      }

      if (delta > 0 && currentY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      setIsVisible(true);
    }
  }, [mobileOpen]);

  const handleLogout = () => {
    clearSession();
    setSession(getSessionState());
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-amber-200/70 bg-amber-50/95 backdrop-blur-xl transition-transform duration-300 ease-out dark:border-white/[0.07] dark:bg-[#0a0c10]/95 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-amber-100/70 dark:hover:bg-white/[0.05]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 ring-1 ring-orange-500/30">
            <UtensilsCrossed className="h-4 w-4 text-orange-400" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">SIGER</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/25"
                    : "text-slate-600 hover:bg-amber-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop session */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {isLoggedIn ? (
            <>
              <span className="rounded-full border border-amber-200 bg-amber-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-800 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-400">
                {session.user?.role || "usuario"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-orange-400"
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((p) => !p)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white text-slate-700 transition hover:bg-amber-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-slate-200 lg:hidden"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-amber-200/60 bg-amber-50 px-4 py-3 dark:border-white/[0.06] dark:bg-[#0e1014] lg:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-1">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500/15 text-orange-300"
                      : "text-slate-700 hover:bg-amber-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/15"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
              )}
            </div>

            {isLoggedIn && (
                <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-600">
                Sesión activa · {currentLabel || "SIGER"}
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
