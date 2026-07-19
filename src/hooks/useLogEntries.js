"use client";

import useSyncedList from "@/lib/useSyncedList";

export default function useLogEntries() {
    return useSyncedList(
        "fxchecker_log",
        "logs",
        (row) => ({
            id: row.id,
            fromCurrency: row.from_currency,
            toCurrency: row.to_currency,
            amount: row.amount,
            convertedAmount: row.converted_amount,
            exchangeRate: row.exchange_rate,
            timestamp: row.timestamp,
        }),
        (item) => ({
            id: item.id,
            from_currency: item.fromCurrency,
            to_currency: item.toCurrency,
            amount: item.amount,
            converted_amount: item.convertedAmount,
            exchange_rate: item.exchangeRate,
            timestamp: item.timestamp,
        })
    );
}