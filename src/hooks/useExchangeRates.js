"use client";

import { useEffect, useRef } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { convertCurrency } from "@/services/frankfurter";
import useLocalStorage from "@/lib/useLocalStorage";

export default function useExchangeRates() {
    const {
        amount,
        fromCurrency,
        toCurrency,
        setConvertedAmount,
        setExchangeRate,
        setRatesStale,
        setLastUpdated,
    } = useCurrency();

    // Cache of last-known rates per pair: { "USD_EUR": { rate, timestamp }, ... }
    const [rateCache, setRateCache] = useLocalStorage("fxchecker_rate_cache", {});

    // Mirrors rateCache into a ref so the fetch effect can read the latest cache
    // without needing rateCache as a dependency — including it directly would
    // re-trigger the effect every time a fetch succeeds and writes to the cache,
    // causing a refetch loop.
    const rateCacheRef = useRef(rateCache);
    useEffect(() => {
        rateCacheRef.current = rateCache;
    }, [rateCache]);

    useEffect(() => {
        let cancelled = false;
        const cacheKey = `${fromCurrency}_${toCurrency}`;

        async function loadRate() {
            try {
                const data = await convertCurrency(amount, fromCurrency, toCurrency);
                if (cancelled) return;

                setConvertedAmount(data.convertedAmount);
                setExchangeRate(data.rate);
                setRatesStale(false);
                setLastUpdated(Date.now());

                setRateCache((prev) => ({
                    ...prev,
                    [cacheKey]: { rate: data.rate, timestamp: Date.now() },
                }));
            } catch (err) {
                if (cancelled) return;
                console.error(err);

                const cached = rateCacheRef.current[cacheKey];

                if (cached) {
                    // Fall back to the last known rate for this pair, recomputed
                    // against the current amount so it doesn't show a frozen total.
                    setExchangeRate(cached.rate);
                    setConvertedAmount(Number((amount * cached.rate).toFixed(2)));
                    setLastUpdated(cached.timestamp);
                } else {
                    // No cache for this pair — nothing to fall back to, but still
                    // surface that live data is unavailable rather than failing silently.
                    setLastUpdated(null);
                }

                setRatesStale(true);
            }
        }

        loadRate();
        return () => {
            cancelled = true;
        };
    }, [
        amount,
        fromCurrency,
        toCurrency,
        setConvertedAmount,
        setExchangeRate,
        setRatesStale,
        setLastUpdated,
        setRateCache,
    ]);
}