"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            supabase.auth.exchangeCodeForSession(code).then(() => {
                router.replace("/");
            });
        } else {
            router.replace("/");
        }
    }, [router]);

    return <p>Signing you in…</p>;
}