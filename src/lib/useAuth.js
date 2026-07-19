"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function useAuth() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });

        return () => listener.subscription.unsubscribe();
    }, [supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return { session, user: session?.user ?? null, loading, signOut };
}