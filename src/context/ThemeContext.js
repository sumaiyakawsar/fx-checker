"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

if (typeof window !== "undefined") {
    const originalError = console.error;
    console.error = (...args) => {
        if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
            return;
        }
        originalError(...args);
    };
}

export function ThemeProvider({ children }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
        </NextThemesProvider>
    );
}