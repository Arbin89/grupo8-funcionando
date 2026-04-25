import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = activeTheme === "dark";

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="gap-2 rounded-full opacity-0 pointer-events-none">
        <SunMedium className="h-4 w-4" />
        Tema
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="gap-2 rounded-full border-black/10 bg-white/80 text-foreground hover:bg-white hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      type="button"
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      <span>{isDark ? "Claro" : "Oscuro"}</span>
    </Button>
  );
};

export default ThemeToggle;