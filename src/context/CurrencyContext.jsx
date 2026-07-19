"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [amount, setAmount] = useState(1000);

    const [fromCurrency, setFromCurrencyState] = useState(
        () => searchParams.get("from") || "USD"
    );
    const [toCurrency, setToCurrencyState] = useState(
        () => searchParams.get("to") || "EUR"
    );

    const [exchangeRate, setExchangeRate] = useState(null);
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [rates, setRates] = useState({});
    const [currencies, setCurrencies] = useState([]);

    // True when the last fetch failed and we're showing a cached/fallback rate instead
    const [ratesStale, setRatesStale] = useState(false);
    // Timestamp (ms) of the rate currently being displayed — fresh or cached
    const [lastUpdated, setLastUpdated] = useState(null);

    const searchParamsRef = useRef(searchParams);
    useEffect(() => {
        searchParamsRef.current = searchParams;
    }, [searchParams]);

    const updateUrl = useCallback(
        (from, to) => {
            const params = new URLSearchParams(searchParamsRef.current.toString());
            params.set("from", from);
            params.set("to", to);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [router, pathname]
    );

    const setFromCurrency = useCallback(
        (value) => {
            setFromCurrencyState(value);
            updateUrl(value, toCurrency);
        },
        [toCurrency, updateUrl]
    );

    const setToCurrency = useCallback(
        (value) => {
            setToCurrencyState(value);
            updateUrl(fromCurrency, value);
        },
        [fromCurrency, updateUrl]
    );

    const swapCurrencies = useCallback(() => {
        setFromCurrencyState(toCurrency);
        setToCurrencyState(fromCurrency);
        updateUrl(toCurrency, fromCurrency);
    }, [fromCurrency, toCurrency, updateUrl]);

    useEffect(() => {
        if (!searchParams.get("from") || !searchParams.get("to")) {
            updateUrl(fromCurrency, toCurrency);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <CurrencyContext.Provider
            value={{
                amount,
                setAmount,

                fromCurrency,
                setFromCurrency,

                toCurrency,
                setToCurrency,

                exchangeRate,
                setExchangeRate,

                convertedAmount,
                setConvertedAmount,

                swapCurrencies,

                currencies,
                setCurrencies,

                rates,
                setRates,

                ratesStale,
                setRatesStale,

                lastUpdated,
                setLastUpdated,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}