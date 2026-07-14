"use client";

import { useMemo, useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { getRates } from "@/services/frankfurter";
import CurrencySelect from "@/component/Converter/CurrencySelect";

const DEFAULT_TARGETS = ["EUR", "GBP", "JPY", "AUD"];

export default function CompareTab() {

    const { currencies, rates, setRates, amount, fromCurrency } = useCurrency();

    const [targets, setTargets] = useState(DEFAULT_TARGETS);
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const numericAmount = Number(amount) || 0;

    // Fetch rates whenever the base currency or the set of targets changes
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
                const rate = rates?.[fromCurrency]?.[code] ?? null; // nested lookup
                return { code, rate, value: rate ? numericAmount * rate : null };
            });
    }, [targets, fromCurrency, rates, numericAmount]);


    const availableToAdd = (currencies ?? []).filter(
        (c) => c.code !== fromCurrency && !targets.includes(c.code)
    );

    function removeTarget(code) {
        setTargets((prev) => prev.filter((c) => c !== code));
    }

    function addTarget(code) {
        setTargets((prev) => [...prev, code]);
        setAdding(false);
    }

    return (
        <div className="space-y-6">
            {/* Result grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map(({ code, rate, value }) => (
                    <div
                        key={code}
                        className="group relative rounded-2xl bg-[#1b1b1b] p-5 transition-colors hover:bg-[#212121]"
                    >
                        <button
                            onClick={() => removeTarget(code)}
                            className="absolute right-3 top-3 text-zinc-600 opacity-0 transition-opacity hover:text-zinc-300 group-hover:opacity-100"
                            aria-label={`Remove ${code}`}
                        >
                            ✕
                        </button>
                        <p className="text-xs uppercase tracking-widest text-zinc-500">{code}</p>
                        <p className="mt-2 font-mono text-2xl text-lime-400">
                            {value !== null
                                ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                                : "—"}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            1 {fromCurrency} = {rate ? rate.toFixed(4) : "—"} {code}
                        </p>
                    </div>
                ))}

                {/* Add currency tile */}
                <div className="rounded-2xl border border-dashed border-zinc-700 p-5">
               {!adding ? (
                        <button
                            onClick={() => setAdding(true)}
                            className="flex h-full w-full items-center justify-center gap-2 text-sm text-zinc-500 hover:text-lime-400"
                        >
                            + Add currency
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Add to compare
                            </p>

                            <CurrencySelect
                                value=""
                                onChange={(e) => addTarget(e.target.value)}
                                className="w-full"
                                    openUpward
                            />

                            <button
                                onClick={() => setAdding(false)}
                                className="text-xs text-zinc-600 hover:text-zinc-400"
                            >
                                cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


