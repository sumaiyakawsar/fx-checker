"use client";

import { useState } from "react";
import useLocalStorage from "@/lib/useLocalStorage";

export default function LogTab() {
    const [log, setLog] = useLocalStorage("fxchecker_log", []);
    const [confirmClear, setConfirmClear] = useState(false);

    function deleteEntry(id) {
        setLog((prev) => prev.filter((entry) => entry.id !== id));
    }

    function clearAll() {
        setLog([]);
        setConfirmClear(false);
    }

    function formatTime(ts) {
        return new Date(ts).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (log.length === 0) {
        return (
            <div className="rounded-2xl bg-[#1b1b1b] p-10 text-center">
                <p className="text-sm text-zinc-500">
                    Nothing logged yet. Hit “Log conversion” on any rate to save it here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Conversion log · {log.length}
                </p>
                {!confirmClear ? (
                    <button
                        onClick={() => setConfirmClear(true)}
                        className="text-xs uppercase tracking-widest text-zinc-500 hover:text-red-400"
                    >
                        Clear log
                    </button>
                ) : (
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-zinc-500">Clear all entries?</span>
                        <button onClick={clearAll} className="uppercase tracking-widest text-red-400">
                            Confirm
                        </button>
                        <button
                            onClick={() => setConfirmClear(false)}
                            className="uppercase tracking-widest text-zinc-500"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="divide-y divide-zinc-800 rounded-2xl bg-[#1b1b1b]">
                {[...log]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((entry) => (
                        <div
                            key={entry.id}
                            className="group flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="font-mono text-sm text-white">
                                    {entry.amount.toLocaleString()} {entry.fromCurrency}
                                    <span className="mx-2 text-zinc-600">→</span>
                                    <span className="text-lime-400">
                                        {entry.convertedAmount.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}{" "}
                                        {entry.toCurrency}
                                    </span>
                                </p>
                                <p className="mt-0.5 text-xs text-zinc-500">
                                    {formatTime(entry.timestamp)} · 1 {entry.fromCurrency} ={" "}
                                    {entry.exchangeRate.toFixed(4)} {entry.toCurrency}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteEntry(entry.id)}
                                aria-label="Delete entry"
                                className="text-zinc-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}