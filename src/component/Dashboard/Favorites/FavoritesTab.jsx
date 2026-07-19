"use client";

import { useMemo, useEffect, useState } from "react";
import useLocalStorage from "@/lib/useLocalStorage";
import { useCurrency } from "@/context/CurrencyContext";
import { getTickerRates } from "@/services/frankfurter";
import { FaArrowRight, FaStar } from "react-icons/fa6";


export default function FavoritesTab({ onLoadPair }) {

    const { rates, setRates, setFromCurrency, setToCurrency } = useCurrency();

    const [favorites, setFavorites] = useLocalStorage("fxchecker_favorites", []);
    const [changes, setChanges] = useState({}); // key: `${from}${to}` -> % change

    useEffect(() => {
        if (favorites.length === 0) return;

        let cancelled = false;

        async function fetchAllRates() {
            try {
                const pairs = favorites.map(({ fromCurrency, toCurrency }) => ({
                    pair: `${fromCurrency}${toCurrency}`,
                    base: fromCurrency,
                    quote: toCurrency,
                }));

                const results = await getTickerRates(pairs);
                if (cancelled) return;

                setRates((prev) => {
                    const next = { ...prev };
                    results.forEach(({ pair, rate }) => {
                        const match = favorites.find(
                            (f) => `${f.fromCurrency}${f.toCurrency}` === pair
                        );
                        if (!match || rate === null) return;
                        next[match.fromCurrency] = {
                            ...next[match.fromCurrency],
                            [match.toCurrency]: rate,
                        };
                    });
                    return next;
                });

                setChanges((prev) => {
                    const next = { ...prev };
                    results.forEach(({ pair, change }) => {
                        next[pair] = change;
                    });
                    return next;
                });
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
                change: changes[`${f.fromCurrency}${f.toCurrency}`] ?? null,
            })),
        [favorites, rates, changes]
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
                <p className="font-mono text-sm text-fg-muted">No pinned pairs yet.</p>
                <p className="mt-2 font-mono text-xs text-fg-muted/70">
                    Pin a pair from the Converter to see it here.
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-bg-elevated">

                <div className="divide-y divide-border ">
                    {withRates.map(({ fromCurrency, toCurrency, rate, change }, i) => {
                        const hasChange = change !== null && change !== undefined;
                        const positive = hasChange && change >= 0;
                        const colorClass = positive ? "text-accent" : "text-red-500";

                        return (
                            <div
                                key={`${fromCurrency}${toCurrency}`}
                                className="group flex items-center gap-8 border-l-2 border-transparent px-5 py-3.5 transition-colors hover:border-l-accent hover:bg-bg/60"
                                onClick={() => load(fromCurrency, toCurrency)}
                            >
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="min-w-0 font-mono text-lg text-fg flex flex-row gap-2 items-center">
                                        {fromCurrency}
                                        <FaArrowRight className="" />
                                        {toCurrency}
                                    </div>

                                    <div className="text-right">
                                        <p className="font-mono text-base tabular-nums text-fg">
                                            {rate ? rate.toFixed(4) : "—"}
                                        </p>
                                        <p className={`mt-0.5 font-mono text-xs font-semibold tabular-nums ${hasChange ? colorClass : "text-fg-muted/40"}`}>
                                            {hasChange ? (
                                                <>
                                                    {positive ? "▲" : "▼"} {positive ? "+" : ""}
                                                    {change.toFixed(2)}%
                                                </>
                                            ) : (
                                                "—"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2.5 opacity-60 transition-opacity group-hover:opacity-100">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            unpin(fromCurrency, toCurrency);
                                        }}
                                        aria-label={`Unpin ${fromCurrency}/${toCurrency}`}
                                        title="Unpin"
                                        className="text-accent hover:text-fg-muted"
                                    >
                                        <FaStar />

                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}