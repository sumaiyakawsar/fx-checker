"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { useEffect, useRef, useCallback } from "react";
import { isTypingTarget } from "@/lib/keyboardUtils";
import AmountInput from "./AmountInput";
import CurrencySelect from "./CurrencySelect";
import RateInfo from "./RateInfo";

import useExchangeRates from "@/hooks/useExchangeRates";
import useCurrencies from "@/hooks/useCurrencies";
import { HiArrowsRightLeft } from "react-icons/hi2";
import useLogEntries from "@/hooks/useLogEntries";
import useFavorites from "@/hooks/useFavorites";
import { toasts } from "@/lib/toast";

export default function Converter() {
    useCurrencies();
    useExchangeRates();

    const {
        amount,
        setAmount,

        fromCurrency,
        setFromCurrency,

        toCurrency,
        setToCurrency,

        convertedAmount,
        exchangeRate,

        swapCurrencies
    } = useCurrency();

    const { items: favorites, addItem: addFavorite, removeItem: removeFavorite } = useFavorites();
    const { addItem: addLog } = useLogEntries();

    const isFavorited = favorites.some(
        (f) => f.fromCurrency === fromCurrency && f.toCurrency === toCurrency
    );
    
    const handleFromChange = useCallback((newCode) => {
        if (newCode === fromCurrency) return;
        setFromCurrency(newCode);
        toasts.fromCurrencyChanged(newCode);
    }, [fromCurrency, setFromCurrency]);

    const handleToChange = useCallback((newCode) => {
        if (newCode === toCurrency) return;
        setToCurrency(newCode);
        toasts.toCurrencyChanged(newCode);
    }, [toCurrency, setToCurrency]);

    const handleFavorite = useCallback(() => {
        const existing = favorites.find(
            (f) => f.fromCurrency === fromCurrency && f.toCurrency === toCurrency
        );

        if (existing) {
            removeFavorite(existing);
            toasts.favoriteRemoved(fromCurrency, toCurrency);
        } else {
            addFavorite({ fromCurrency, toCurrency });
            toasts.favoriteAdded(fromCurrency, toCurrency);

        }
    }, [fromCurrency, toCurrency, favorites, addFavorite, removeFavorite]);

    const handleLog = useCallback(() => {
        if (!exchangeRate || !amount || amount <= 0) return;

        addLog({
            id: crypto.randomUUID(),
            fromCurrency,
            toCurrency,
            amount,
            convertedAmount,
            exchangeRate,
            timestamp: Date.now(),
        });

        toasts.logAdded(fromCurrency, toCurrency);

    }, [fromCurrency, toCurrency, amount, convertedAmount, exchangeRate, addLog]);

    const handleSwap = useCallback(() => {
        toasts.swapped(toCurrency, fromCurrency);
        swapCurrencies();
    }, [fromCurrency, toCurrency, swapCurrencies]);

    const fromSelectRef = useRef(null);
    const toSelectRef = useRef(null);

    useEffect(() => {
        function handleKeyDown(e) {
            if (isTypingTarget(e.target)) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (e.key === "c" || e.key === "C") {
                e.preventDefault();
                fromSelectRef.current?.open();
            } else if (e.key === "r" || e.key === "R") {
                e.preventDefault();
                toSelectRef.current?.open();
            } else if (e.key === "s" || e.key === "S") {
                e.preventDefault();
                handleSwap();
            } else if (e.key === "f" || e.key === "F") {
                e.preventDefault();
                handleFavorite();
            } else if (e.key === "l" || e.key === "L") {
                e.preventDefault();
                if (amount > 0) handleLog();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSwap, handleFavorite, handleLog, amount]);


    return (
        <section className="w-full">
            <h2 className="mb-8 text-3xl font-bold uppercase tracking-[0.25em] text-fg">
                Check The Rate
            </h2>

            <div className="divide-y-3 divide-border divide-dashed rounded-3xl bg-bg-elevated shadow-2xl">

                {/* Converter */}
                <div className="flex flex-col items-center gap-5 md:flex-row p-6 md:p-8">

                    {/* SEND */}
                    <div className="flex flex-1 items-end justify-between rounded-2xl bg-border p-4 min-w-0">

                        <AmountInput
                            label="Send"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            textColor="text-fg"
                        />

                        <CurrencySelect
                            ref={fromSelectRef}
                            value={fromCurrency}
                            onChange={(e) => handleFromChange(e.target.value)}
                        />
                    </div>

                    {/* SWAP */}
                    <button
                        className="p-3 cursor-pointer rounded-xl bg-border hover:bg-fg-muted/40 flex items-center justify-center transition"
                        onClick={handleSwap}
                    >
                        <HiArrowsRightLeft className="text-fg text-2xl rotate-90 md:rotate-0" />
                    </button >

                    {/* RECEIVE */}
                    <div className="flex flex-1 items-end justify-between rounded-2xl bg-border p-4 min-w-0">

                        <AmountInput
                            label="Receive"
                            value={convertedAmount ?? ""}
                            readOnly
                            textColor="text-accent"
                        />

                        <CurrencySelect
                            ref={toSelectRef}
                            value={toCurrency}
                            onChange={(e) => handleToChange(e.target.value)}
                        />

                    </div>
                </div>

                {/* Rate + Buttons */}
                <div className="px-8 py-6">
                    <RateInfo
                        onFavorite={handleFavorite}
                        onLog={handleLog}
                        isFavorited={isFavorited}
                        canLog={amount > 0}
                    />
                </div>
            </div>
        </section>
    );
}