"use client";

import { useTheme } from "@/context/ThemeContext";
import { HiSun, HiMoon } from "react-icons/hi2";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            suppressHydrationWarning
            className="flex items-center justify-center w-9 h-9 rounded
                 text-fg-muted hover:text-accent 
                 transition-colors"
        >
            <span suppressHydrationWarning>
                {theme === "dark" ? <HiMoon className="w-4 h-4" /> : <HiSun className="w-4 h-4" />}
            </span>
        </button>
    );
}