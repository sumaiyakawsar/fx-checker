"use client";

import { useCallback, useMemo, useState } from "react";
import useLocalStorage from "@/lib/useLocalStorage";
import { formatTime } from "@/utils/formatDate";
import { buildLogCsv, downloadCsv } from "@/lib/exportCSV";
import { HiOutlineArrowDownTray } from "react-icons/hi2";


export default function LogTab() {
    const [log, setLog] = useLocalStorage("fxchecker_log", []);
    const [confirmClear, setConfirmClear] = useState(false);

    // Computed once per log change, reused for both the visible list and the CSV export —
    // avoids sorting the same array twice on every render.
    const sortedLog = useMemo(
        () => [...log].sort((a, b) => b.timestamp - a.timestamp),
        [log]
    );

    const deleteEntry = useCallback(
        (id) => {
            setLog((prev) => prev.filter((entry) => entry.id !== id));
        },
        [setLog]
    );

    const clearAll = useCallback(() => {
        setLog([]);
        setConfirmClear(false);
    }, [setLog]);

    const handleExport = useCallback(() => {
        if (sortedLog.length === 0) return;
        const csv = buildLogCsv(sortedLog);
        const filename = `fxchecker_log_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCsv(csv, filename);
    }, [sortedLog]);



    if (log.length === 0) {
        return (
            <div className="rounded-2xl bg-bg-elevated p-10 text-center">
                <p className="text-sm text-fg-muted">
                    Nothing logged yet. Hit “Log conversion” on any rate to save it here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-fg-muted">
                    Conversion log · {log.length}
                </p>


                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExport}
                        aria-label="Export conversion log as CSV"
                        className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
                    >
                        <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
                        Export CSV
                    </button>
                    {!confirmClear ? (
                        <button
                            onClick={() => setConfirmClear(true)}
                            className="text-xs uppercase tracking-widest text-fg-muted hover:text-red-400"
                        >
                            Clear log
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 text-xs">
                            <span className="text-fg-muted">Clear all entries?</span>
                            <button onClick={clearAll} className="uppercase tracking-widest text-red-400">
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmClear(false)}
                                className="uppercase tracking-widest text-fg-muted"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="divide-y divide-border rounded-2xl bg-bg-elevated">
                {[...log]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((entry) => (
                        <div
                            key={entry.id}
                            className="group flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="font-mono text-sm text-fg">
                                    {entry.amount.toLocaleString()} {entry.fromCurrency}
                                    <span className="mx-2 text-fg-muted">→</span>
                                    <span className="text-accent">
                                        {entry.convertedAmount.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}{" "}
                                        {entry.toCurrency}
                                    </span>
                                </p>
                                <p className="mt-0.5 text-xs text-fg-muted">
                                    {formatTime(entry.timestamp)} · 1 {entry.fromCurrency} ={" "}
                                    {entry.exchangeRate.toFixed(4)} {entry.toCurrency}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteEntry(entry.id)}
                                aria-label="Delete entry"
                                className="text-fg-muted opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}