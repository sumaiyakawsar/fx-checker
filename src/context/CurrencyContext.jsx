"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [amount, setAmount] = useState(1000);

    // Initialize directly from the URL so there's no flash of default values
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

    // Keep a ref to the latest searchParams so updateUrl doesn't need
    // to be recreated (and doesn't go stale) every time the URL changes
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

    // On first load with no query params at all (e.g. a fresh visit to "/"),
    // write the defaults into the URL so the page is bookmarkable immediately
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
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}