"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const listeners = new Map();
const cache = new Map();

function getListeners(key) {
    if (!listeners.has(key)) listeners.set(key, new Set());
    return listeners.get(key);
}

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
    const initialValueRef = useRef(initialValue);

    // Keep the ref in sync AFTER render, not during it.
    useEffect(() => {
        initialValueRef.current = initialValue;
    });

    const value = useSyncExternalStore(
        useCallback((callback) => subscribe(key, callback), [key]),
        useCallback(() => readValue(key, initialValueRef.current), [key]),
        () => initialValue // server snapshot
    );

    const setValue = useCallback(
        (next) => {
            const prev = readValue(key, initialValueRef.current);
            const resolved = typeof next === "function" ? next(prev) : next;

            const raw = JSON.stringify(resolved);
            try {
                window.localStorage.setItem(key, raw);
            } catch {
                // storage full or unavailable
            }

            cache.set(key, { raw, parsed: resolved });
            getListeners(key).forEach((callback) => callback());
        },
        [key]
    );

    return [value, setValue];
}