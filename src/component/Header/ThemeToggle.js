"use client";

import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";

export default function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <HiMoon className="w-4 h-4" /> : <HiSun className="w-4 h-4" />}

        </button>
    );
}