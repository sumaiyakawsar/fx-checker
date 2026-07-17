"use client";

import { useMemo, useEffect } from "react";
import useLocalStorage from "@/lib/useLocalStorage";
import { useCurrency } from "@/context/CurrencyContext";
import { getRates } from "@/services/frankfurter";

export default function FavoritesTab({ onLoadPair }) {

    const { rates, setRates, setFromCurrency, setToCurrency } = useCurrency();

    const [favorites, setFavorites] = useLocalStorage("fxchecker_favorites", []);

    // Fetch rates for every unique base among the pinned pairs
    useEffect(() => {
        if (favorites.length === 0) return;

        const basesNeeded = {};
        favorites.forEach(({ fromCurrency, toCurrency }) => {
            if (!basesNeeded[fromCurrency]) basesNeeded[fromCurrency] = new Set();
            basesNeeded[fromCurrency].add(toCurrency);
        });

        let cancelled = false;

        async function fetchAllRates() {
            try {
                const entries = Object.entries(basesNeeded);
                const results = await Promise.all(
                    entries.map(([base, quoteSet]) => getRates(base, [...quoteSet]))
                );

                if (!cancelled) {
                    setRates((prev) => {
                        const next = { ...prev };
                        entries.forEach(([base], i) => {
                            next[base] = { ...next[base], ...results[i] };
                        });
                        return next;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch favorite rates:", err);
            }
        }

        fetchAllRates();
        return () => { cancelled = true; };
    }, [favorites, setRates]);

    const withRates = useMemo(
        () =>
            favorites.map((f) => ({
                ...f,
                rate: rates?.[f.fromCurrency]?.[f.toCurrency] ?? null,
            })),
        [favorites, rates]
    );

    function unpin(fromCurrency, toCurrency) {
        setFavorites((prev) =>
            prev.filter((f) => !(f.fromCurrency === fromCurrency && f.toCurrency === toCurrency))
        );
    }

    function load(fromCurrency, toCurrency) {
        setFromCurrency(fromCurrency);
        setToCurrency(toCurrency);
        onLoadPair?.();
    }

    if (favorites.length === 0) {
        return (
            <div className="rounded-2xl bg-bg-elevated p-10 text-center">
                <p className="text-sm text-fg-muted">No pinned pairs yet.</p>
                <p className="mt-2 text-xs text-fg-muted/70">
                    Pin a pair from the Converter to see it here.
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-6">

            <p className="text-xs uppercase tracking-widest text-fg-muted">
                Pinned pairs · {favorites.length}
            </p>

            <div className="divide-y divide-border rounded-2xl bg-bg-elevated">
                {withRates.map(({ fromCurrency, toCurrency, rate }) => (
                    <div
                        key={`${fromCurrency}${toCurrency}`}
                        className="flex items-center justify-between px-5 py-4"
                    >
                        <div>
                            <p className="font-mono text-sm text-fg">
                                {fromCurrency}/{toCurrency}
                            </p>
                            <p className="mt-0.5 font-mono text-lg text-accent">
                                {rate ? rate.toFixed(4) : "—"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => load(fromCurrency, toCurrency)}
                                className="rounded-lg px-3 py-1.5 text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
                            >
                                Load
                            </button>
                            <button
                                onClick={() => unpin(fromCurrency, toCurrency)}
                                aria-label={`Unpin ${fromCurrency}/${toCurrency}`}
                                className="text-accent hover:text-fg-muted"
                                title="Unpin"
                            >
                                ★
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}