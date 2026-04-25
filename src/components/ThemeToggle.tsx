import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeMode = "dark" | "light";

const THEME_KEY = "siger-theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="fixed bottom-24 right-5 z-[80] md:bottom-24 md:right-6">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="h-11 w-11 rounded-full border-amber-400/40 bg-white/85 text-amber-700 shadow-lg backdrop-blur-sm transition hover:bg-white dark:border-orange-500/35 dark:bg-[#141820]/90 dark:text-orange-300"
        aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
        title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
      </Button>
    </div>
  );
}