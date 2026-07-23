"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { getCurrencies } from "@/services/frankfurter";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "../Auth/AuthModal"; 
import { isTypingTarget } from "@/lib/keyboardUtils";
import useAuth from "@/lib/useAuth";
import logo from "@/app/logo.svg";
import ShortcutsModal from "./ShortcutsModal";

export default function Header() {
    const [currencyCount, setCurrencyCount] = useState(null);
    const [authOpen, setAuthOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const { user, loading, signOut } = useAuth();

    useEffect(() => {
        getCurrencies()
            .then((data) => setCurrencyCount(data.length))
            .catch((err) => console.error("Failed to load currencies:", err));
    }, []);

    useEffect(() => {
        function handleKeyDown(e) {
            if (isTypingTarget(e.target)) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (e.key === "?" || (e.shiftKey && e.key === "/")) {
                e.preventDefault();
                setShortcutsOpen((prev) => !prev);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const HEADER_INFO = {
        provider: "ECB Data",
        updateType: "EOD",
    };

    return (
        <>
            <header className="relative w-full h-16 bg-bg border-b border-border">
                <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6">

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="w-8 h-8 flex items-center justify-center overflow-hidden shrink-0">
                            <Image src={logo} alt="FX_CHECKER logo" width={25} height={25} className="object-contain" />
                        </div>
                        <h1 className="text-fg font-bold tracking-widest text-sm sm:text-base">
                            FX_CHECKER
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 text-xs uppercase tracking-widest text-fg-muted">
                        <div className="hidden md:flex items-center gap-4">
                            <span>{currencyCount ?? "—"} Currencies</span>
                            <span>•</span>
                            <span>{HEADER_INFO.updateType}</span>
                            <span>•</span>
                            <span>{HEADER_INFO.provider}</span>
                        </div>

                        <span className="md:hidden">{currencyCount ?? "—"} Currencies</span>

                        {!loading && (
                            user ? (
                                <button
                                    onClick={signOut}
                                    className="rounded-lg border border-border px-3 py-1.5 text-fg hover:bg-bg-subtle"
                                >
                                    Sign out
                                </button>
                            ) : (
                                <button
                                    onClick={() => setAuthOpen(true)}
                                    className="rounded-lg bg-accent px-3 py-1.5 text-accent-fg"
                                >
                                    Sync
                                </button>
                            )
                        )}

                        {/* Shortcuts Dropdown Trigger */}
                        <button
                            onClick={() => setShortcutsOpen((prev) => !prev)}
                            className={`flex items-center justify-center w-7 h-7 rounded-lg border text-fg font-mono text-xs transition ${shortcutsOpen
                                    ? "bg-bg-subtle border-fg-muted"
                                    : "border-border hover:bg-bg-subtle"
                                }`}
                            title="Keyboard Shortcuts (?)"
                            aria-label="Keyboard Shortcuts"
                        >
                            ?
                        </button>

                        <ThemeToggle />
                    </div>

                </div>

                {/* Dropdown Panel */}
                <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
            </header>

            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}