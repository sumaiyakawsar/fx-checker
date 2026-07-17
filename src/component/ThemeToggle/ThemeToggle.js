"use client";

import { useTheme } from "@/context/ThemeContext";
import { HiSun, HiMoon } from "react-icons/hi2";

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex items-center justify-center w-9 h-9 
            text-fg-muted hover:text-accent hover:border-accent
            transition-colors"
        >
            {theme === "dark" ? (
                <HiMoon className="w-6 h-6" />
            ) : (
                <HiSun className="w-6 h-6" />
            )}
        </button>
    );
}