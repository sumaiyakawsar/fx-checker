"use client";

import { useEffect } from "react";

import { useCurrency } from "@/context/CurrencyContext";

import { convertCurrency } from "@/services/frankfurter";

export default function useExchangeRates() {

    const {

        amount,

        fromCurrency,

        toCurrency,

        setConvertedAmount,

        setExchangeRate,

    } = useCurrency();

    useEffect(() => {

        async function loadRate() {

            try {
                // console.log("Fetching...");

                const data = await convertCurrency(

                    amount,
                    fromCurrency,
                    toCurrency

                );
                // console.log("API returned:", data);

                setConvertedAmount(data.convertedAmount);
                setExchangeRate(data.rate);

            } catch (err) {

                console.error(err);

            }

        }

        loadRate();

    }, [

        amount,

        fromCurrency,

        toCurrency,

        setConvertedAmount,

        setExchangeRate,

    ]);

}