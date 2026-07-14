"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map(); // key -> Set<callback>
const cache = new Map();     // key -> { raw: string|null, parsed: any }

function getListeners(key) {
    if (!listeners.has(key)) listeners.set(key, new Set());
    return listeners.get(key);
}

// Returns a cached parsed value, only re-parsing when the raw
// localStorage string has actually changed since last read.
function readValue(key, initialValue) {
    if (typeof window === "undefined") return initialValue;

    const raw = window.localStorage.getItem(key);
    const cached = cache.get(key);

    if (cached && cached.raw === raw) {
        return cached.parsed;
    }

    let parsed = initialValue;
    if (raw !== null) {
        try {
            parsed = JSON.parse(raw);
        } catch {
            parsed = initialValue;
        }
    }

    cache.set(key, { raw, parsed });
    return parsed;
}

function subscribe(key, callback) {
    const set = getListeners(key);
    set.add(callback);

    const onStorage = (e) => {
        if (e.key === key) callback();
    };
    window.addEventListener("storage", onStorage);

    return () => {
        set.delete(callback);
        window.removeEventListener("storage", onStorage);
    };
}

export default function useLocalStorage(key, initialValue) {
    const value = useSyncExternalStore(
        (callback) => subscribe(key, callback),
        () => readValue(key, initialValue),
        () => initialValue // server snapshot
    );

    const setValue = useCallback(
        (next) => {
            const prev = readValue(key, initialValue);
            const resolved = typeof next === "function" ? next(prev) : next;

            const raw = JSON.stringify(resolved);
            try {
                window.localStorage.setItem(key, raw);
            } catch {
                // storage full or unavailable
            }

            // update cache immediately so the next getSnapshot call
            // (triggered by the notify below) sees the new value
            cache.set(key, { raw, parsed: resolved });

            getListeners(key).forEach((callback) => callback());
        },
        [key, initialValue]
    );

    return [value, setValue];
}