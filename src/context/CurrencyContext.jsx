"use client";

import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const [amount, setAmount] = useState(1000);

    const [fromCurrency, setFromCurrency] = useState("USD");

    const [toCurrency, setToCurrency] = useState("EUR");

    const [exchangeRate, setExchangeRate] = useState(null);

    const [convertedAmount, setConvertedAmount] = useState(null);

    const [rates, setRates] = useState({}); 


    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const [currencies, setCurrencies] = useState([]);

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