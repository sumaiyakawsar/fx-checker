"use client";

import { useEffect } from "react"; 
import { useCurrency } from "@/context/CurrencyContext";
import { getCurrencies } from "@/services/frankfurter";

export default function useCurrencies() {
    const { currencies, setCurrencies } = useCurrency();

    useEffect(() => {
        if (currencies.length) return;

        async function loadCurrencies() {
            try {
                const data = await getCurrencies();
                setCurrencies(data);
            } catch (err) {
                console.error(err);
            }
        }

        loadCurrencies();
    }, [currencies, setCurrencies]);
}