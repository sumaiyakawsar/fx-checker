"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";

const emptySubscribe = () => () => { };

function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,   // client snapshot
        () => false   // server snapshot
    );
}

export default function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const mounted = useMounted();

    if (!mounted) {
        return (
            <button aria-label="Toggle theme" className="w-4 h-4">
                {/* empty placeholder, same size, avoids layout shift */}
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <HiMoon className="w-4 h-4" /> : <HiSun className="w-4 h-4" />}
        </button>
    );
}