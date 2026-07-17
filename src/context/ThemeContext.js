"use client";

import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "@/lib/useLocalStorage";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage("fxchecker_theme", "dark");

    useEffect(() => {
        document.documentElement.classList.toggle("light", theme === "light");
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}