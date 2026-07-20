"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignInForm({ onSent }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("sending");

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/fx-checker/auth/callback`,
            },
        });

        if (error) {
            setStatus("error");
        } else {
            setStatus("sent");
            onSent?.();
        }
    }

    if (status === "sent") {
        return (
            <p className="text-sm text-fg-muted">
                Check your inbox — we sent a sign-in link to {email}.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-fg"
            />
            <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-50"
            >
                {status === "sending" ? "Sending..." : "Send magic link"}
            </button>
            {status === "error" && (
                <p className="text-sm text-red-400">Something went wrong. Try again.</p>
            )}
        </form>
    );
}