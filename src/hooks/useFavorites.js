"use client";
import useSyncedList from "@/lib/useSyncedList";

export default function useFavorites() {
    return useSyncedList(
        "fxchecker_favorites",
        "favorites",
        (row) => ({ fromCurrency: row.from_currency, toCurrency: row.to_currency }),
        (item) => ({ from_currency: item.fromCurrency, to_currency: item.toCurrency })
    );
}