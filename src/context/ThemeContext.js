"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import useLocalStorage from "@/lib/useLocalStorage";

const ThemeContext = createContext(undefined);

// No-op subscribe: this value never changes after mount, we just need
// React to know the server snapshot and client snapshot differ.
const emptySubscribe = () => () => { };

function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,   // client snapshot
        () => false   // server snapshot (SSR/first paint)
    );
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage("fxchecker_theme", "dark");
    const mounted = useMounted();

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.classList.toggle("light", theme === "light");
    }, [theme, mounted]);

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}