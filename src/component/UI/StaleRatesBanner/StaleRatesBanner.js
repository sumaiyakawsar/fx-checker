"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { formatTime } from "@/utils/formatDate";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function StaleRatesBanner() {
    const { ratesStale, lastUpdated } = useCurrency();

    if (!ratesStale) return null;

    return (
        <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-yellow-600/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-500"
        >
            <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
                {lastUpdated
                    ? `Live rates unavailable — showing rates from ${formatTime(lastUpdated)}.`
                    : "Live rates unavailable, and no cached rate exists for this pair yet."}
            </span>
        </div>
    );
}