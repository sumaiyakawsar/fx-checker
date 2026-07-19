"use client";

import { useMemo, useEffect, useState } from "react";
import { IoCloseOutline, IoAddOutline, IoStar, IoStarOutline } from "react-icons/io5";

import { useCurrency } from "@/context/CurrencyContext";
import { getRates } from "@/services/frankfurter";
import useLocalStorage from "@/lib/useLocalStorage";
import FlagImage from "@/component/UI/FlagImage";
import CurrencySelect from "@/component/Converter/CurrencySelect";

const DEFAULT_TARGETS = ["EUR", "GBP", "JPY", "AUD"];

export default function CompareTab() {

    const { currencies, rates, setRates, amount, fromCurrency } = useCurrency();

    const [targets, setTargets] = useLocalStorage("fxchecker_compare_targets", DEFAULT_TARGETS);
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const [favorites, setFavorites] = useLocalStorage("fxchecker_favorites", []);

    const numericAmount = Number(amount) || 0;

    useEffect(() => {
        const quotes = targets.filter((code) => code !== fromCurrency);
        if (!quotes.length) return;

        let cancelled = false;

        async function fetchRates() {
            setLoading(true);
            try {
                const newRates = await getRates(fromCurrency, quotes);
                if (!cancelled) {
                    setRates((prev) => ({
                        ...prev,
                        [fromCurrency]: { ...prev[fromCurrency], ...newRates },
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch compare rates:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchRates();
        return () => { cancelled = true; };
    }, [fromCurrency, targets, setRates]);

    const results = useMemo(() => {
        return targets
            .filter((code) => code !== fromCurrency)
            .map((code) => {
                const rate = rates?.[fromCurrency]?.[code] ?? null;
                const name = currencies.find((c) => c.code === code)?.name ?? null;
                return { code, name, rate, value: rate ? numericAmount * rate : null };
            });
    }, [targets, fromCurrency, rates, numericAmount, currencies]);

    const isFavorite = (code) =>
        favorites.some(
            (f) => f.fromCurrency === fromCurrency && f.toCurrency === code
        );

    function toggleFavorite(code) {
        setFavorites((prev) => {
            const exists = prev.some(
                (f) => f.fromCurrency === fromCurrency && f.toCurrency === code
            );
            if (exists) {
                return prev.filter(
                    (f) => !(f.fromCurrency === fromCurrency && f.toCurrency === code)
                );
            }
            return [...prev, { fromCurrency, toCurrency: code }];
        });
    }

    function removeTarget(code) {
        setTargets((prev) => prev.filter((c) => c !== code));
    }

    function addTarget(code) {
        setTargets((prev) => (prev.includes(code) ? prev : [...prev, code]));
        setAdding(false);
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map(({ code, name, rate, value }) => (
                    <div
                        key={code}
                        className="group relative flex h-40 flex-col overflow-hidden rounded-2xl bg-bg-elevated p-5 transition-colors hover:bg-border/60"
                    >
                        <div className="pointer-events-none absolute -right-5 -top-5 opacity-[0.08] transition-opacity group-hover:opacity-[0.14]">
                            <FlagImage code={code} size={104} />
                        </div>

                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className="font-mono text-xs font-extrabold tracking-[0.25em] text-fg-muted">{code}</p>
                                <p className="mt-1 text-xs text-fg-muted">{name ?? "\u00A0"}</p>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                    onClick={() => toggleFavorite(code)}
                                    className={isFavorite(code) ? "text-accent hover:text-fg-muted opacity-100" : "text-fg-muted hover:text-accent"}
                                    aria-label={isFavorite(code) ? `Unpin ${fromCurrency}/${code}` : `Pin ${fromCurrency}/${code}`}
                                    title={isFavorite(code) ? "Unpin" : "Pin to favourites"}
                                >
                                    {isFavorite(code) ? <IoStar /> : <IoStarOutline />}
                                </button>
                                <button onClick={() => removeTarget(code)} className="text-fg-muted hover:text-fg" aria-label={`Remove ${code}`}>
                                    <IoCloseOutline />
                                </button>
                            </div>
                        </div>

                        <div className="relative mt-auto flex items-end justify-between">
                            <p className="font-mono text-[2.5rem] font-bold leading-none tracking-tight text-accent">
                                {value !== null ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
                            </p>
                            <span className="mb-1 font-mono text-xs tabular-nums text-fg-muted">
                                @ {rate ? rate.toFixed(4) : "—"}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Add currency tile */}
                <div className="flex h-40 flex-col justify-center rounded-2xl border border-dashed border-border p-5 transition-colors hover:border-fg-muted">
                    {!adding ? (
                        <button
                            onClick={() => setAdding(true)}
                            className="group flex h-full w-full flex-col items-center justify-center gap-2"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted transition-colors group-hover:border-accent group-hover:text-accent">
                                <IoAddOutline className="text-xl" />
                            </span>
                            <span className="font-mono text-xs tracking-widest text-fg-muted transition-colors group-hover:text-accent">
                                add currency
                            </span>
                        </button>
                    ) : (
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-xs font-bold tracking-[0.25em] text-fg-muted">
                                    compare against
                                </p>
                                <button
                                    onClick={() => setAdding(false)}
                                    className="text-fg-muted hover:text-fg"
                                    aria-label="Cancel"
                                >
                                    <IoCloseOutline />
                                </button>
                            </div>

                            <div className="mt-auto">
                                <CurrencySelect
                                    value=""
                                    onChange={(e) => addTarget(e.target.value)}
                                    className="w-full"
                                    openUpward
                                    excludeCodes={[fromCurrency, ...targets]}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}