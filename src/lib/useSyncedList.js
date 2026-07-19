"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { createClient } from "@/lib/supabase/client";

export default function useSyncedList(key, table, mapRowToLocal, mapLocalToRow) {
    const [localItems, setLocalItems] = useLocalStorage(key, []);
    const [session, setSession] = useState(null);
    const migrated = useRef(false);
    const [supabase] = useState(() => createClient());

    const localItemsRef = useRef(localItems);
    const mapRowToLocalRef = useRef(mapRowToLocal);
    const mapLocalToRowRef = useRef(mapLocalToRow);

    useEffect(() => {
        localItemsRef.current = localItems;
        mapRowToLocalRef.current = mapRowToLocal;
        mapLocalToRowRef.current = mapLocalToRow;
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });
        return () => listener.subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        if (!session || migrated.current) return;
        migrated.current = true;

        async function sync() {
            const currentLocalItems = localItemsRef.current;
            const toRow = mapLocalToRowRef.current;
            const toLocal = mapRowToLocalRef.current;

            if (currentLocalItems.length > 0) {
                const rows = currentLocalItems.map((item) => ({
                    ...toRow(item),
                    user_id: session.user.id,
                }));
                
                await supabase.from(table).upsert(rows, { ignoreDuplicates: true });
            }

            const { data, error } = await supabase.from(table).select("*");
            if (!error && data) {
                setLocalItems(data.map(toLocal));
            }
        }

        sync();
    }, [session, supabase, table, setLocalItems]);

    const addItem = useCallback(
        async (item) => {
            setLocalItems((prev) => [...prev, item]);

            if (session) {
                await supabase.from(table).insert({
                    ...mapLocalToRowRef.current(item),
                    user_id: session.user.id,
                });
            }
        },
        [session, setLocalItems, supabase, table]
    );

    // Matches by `id` when the item has one (logs); otherwise falls back to matching on every mapped column (favorites, which have no id and rely on the from/to pair being unique).
    const removeItem = useCallback(
        async (item) => {
            const targetRow = mapLocalToRowRef.current(item);

            setLocalItems((prev) =>
                prev.filter((i) => {
                    if (item.id !== undefined) return i.id !== item.id;
                    return JSON.stringify(mapLocalToRowRef.current(i)) !== JSON.stringify(targetRow);
                })
            );

            if (session) {
                const matchCriteria =
                    item.id !== undefined
                        ? { id: targetRow.id, user_id: session.user.id }
                        : { ...targetRow, user_id: session.user.id };

                await supabase.from(table).delete().match(matchCriteria);
            }
        },
        [session, setLocalItems, supabase, table]
    );

    const clearAll = useCallback(async () => {
        setLocalItems([]);
        if (session) {
            await supabase.from(table).delete().eq("user_id", session.user.id);
        }
    }, [session, setLocalItems, supabase, table]);

    return { items: localItems, addItem, removeItem, clearAll, isSynced: !!session };
}