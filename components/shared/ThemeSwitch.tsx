"use client";

import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        aria-label="Toggle theme"
        className="group relative flex items-center justify-center bg-default-50/70 dark:bg-content1/70 backdrop-blur-md rounded-full w-11 h-11 border border-divider/50 shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:border-primary/30 hover:shadow-[0_6px_18px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_26px_rgba(0,0,0,0.32)]"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {/* subtle inner ring for cohesion */}
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/5 dark:ring-white/10" />
        <Icon
          className="w-5 h-5 text-default-600 transition-transform duration-200 group-hover:rotate-180 group-hover:text-primary"
          icon={theme === "dark" ? "solar:sun-bold" : "solar:moon-bold"}
        />
        {/* soft drop highlight for depth on light bg */}
        <span className="pointer-events-none absolute -z-10 inset-0 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none" />
      </button>
    </div>
  );
}
