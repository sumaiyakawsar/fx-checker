"use client";

import { useEffect, useRef } from "react";
import SignInForm from "./SignInForm";
import { HiXMark } from "react-icons/hi2";

const AUTO_CLOSE_DELAY = 4000;

export default function AuthModal({ open, onClose }) {
    const closeTimerRef = useRef(null);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        if (open) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    // Reset any pending auto-close timer whenever the modal opens/closes,
    // so re-opening doesn't inherit a stale timer from a previous session.
    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, [open]);

    function handleSent() {
        closeTimerRef.current = setTimeout(() => {
            onClose();
        }, AUTO_CLOSE_DELAY);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-elevated p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-fg">
                        Sync your data
                    </h2>
                    <button onClick={onClose} aria-label="Close">
                        <HiXMark className="h-5 w-5 text-fg-muted hover:text-fg" />
                    </button>
                </div>
                <p className="mb-4 text-sm text-fg-muted">
                    Sign in with a magic link to sync your favorites and log across devices.
                    Your local data stays put if you skip this.
                </p>
                <SignInForm onSent={handleSent} />
            </div>
        </div>
    );
}