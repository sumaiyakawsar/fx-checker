"use client";

import { useCurrency } from "@/context/CurrencyContext";
import useLocalStorage from "@/lib/useLocalStorage";

import AmountInput from "./AmountInput";
import CurrencySelect from "./CurrencySelect";
import RateInfo from "./RateInfo";

import useExchangeRates from "@/hooks/useExchangeRates";
import useCurrencies from "@/hooks/useCurrencies";
import { HiArrowsRightLeft } from "react-icons/hi2";

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

    const [favorites, setFavorites] = useLocalStorage("fxchecker_favorites", []);
    const [, setLog] = useLocalStorage("fxchecker_log", []);

    const isFavorited = favorites.some(
        (f) => f.fromCurrency === fromCurrency && f.toCurrency === toCurrency
    );

    const handleFavorite = () => {
        setFavorites((prev) => {
            const exists = prev.some(
                (f) => f.fromCurrency === fromCurrency && f.toCurrency === toCurrency
            );

            if (exists) {
                return prev.filter(
                    (f) => !(f.fromCurrency === fromCurrency && f.toCurrency === toCurrency)
                );
            }

            return [...prev, { fromCurrency, toCurrency }];
        });
    };

    const handleLog = () => {
        if (!exchangeRate) return;

        setLog((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                fromCurrency,
                toCurrency,
                amount,
                convertedAmount,
                exchangeRate,
                timestamp: Date.now(),
            },
        ]);
    };



    return (
        <section className="w-full">
            <h2 className="mb-8 text-3xl font-bold uppercase tracking-[0.25em] text-white">
                Check The Rate
            </h2>

            <div className="divide-y-3 divide-zinc-800 divide-dashed rounded-3xl bg-[#1b1b1b]  shadow-2xl">

                {/* Converter */}
                <div className="flex flex-col items-center gap-5 md:flex-row p-6 md:p-8">

                    {/* SEND */}
                    <div className="flex flex-1 items-end justify-between rounded-2xl bg-[#252525] p-4 min-w-0">

                        <AmountInput
                            label="Send"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            textColor="text-white"
                        />

                        <CurrencySelect
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                        />
                    </div>

                    {/* SWAP */}
                    <button
                        className="p-3 cursor-pointer rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] flex items-center justify-center transition
                "
                        onClick={swapCurrencies}
                    >
                        <HiArrowsRightLeft
                            className="text-white text-2xl"
                        />
                    </button >

                    {/* RECEIVE */}
                    <div className="flex flex-1 items-end justify-between rounded-2xl bg-[#252525] p-4 min-w-0">

                        <AmountInput
                            label="Receive"
                            value={convertedAmount ?? ""}
                            readOnly
                            textColor="text-lime-400"
                        />

                        <CurrencySelect
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                        />

                    </div>
                </div>

                {/* Rate + Buttons */}
                <div className="px-8 py-6">
                    <RateInfo
                        onFavorite={handleFavorite}
                        onLog={handleLog}
                        isFavorited={isFavorited}
                    />
                </div>
            </div>
        </section>
    );
}