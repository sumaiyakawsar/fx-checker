"use client";

import { useCallback, useMemo, useState } from "react";
import useLogEntries from "@/hooks/useLogEntries";
import { formatRelativeDay, formatRelativeTime } from "@/utils/formatDate";
import { buildLogCsv, downloadCsv } from "@/lib/exportCSV";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { toasts } from "@/lib/toast";

export default function LogTab() {
    const { items: log, removeItem: removeLogEntry, clearAll } = useLogEntries();
    const [confirmClear, setConfirmClear] = useState(false);

    const sortedLog = useMemo(
        () => [...log].sort((a, b) => b.timestamp - a.timestamp),
        [log]
    );

    const deleteEntry = useCallback(
        (entry) => {
            removeLogEntry(entry);
            toasts.logEntryRemoved(entry.fromCurrency, entry.toCurrency);
        },
        [removeLogEntry]
    );

    const handleClearAll = useCallback(() => {
        clearAll();
        setConfirmClear(false);
        toasts.logCleared();
    }, [clearAll]);

    const handleExport = useCallback(() => {
        if (sortedLog.length === 0) return;
        const csv = buildLogCsv(sortedLog);
        const filename = `fxchecker_log_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCsv(csv, filename);
        toasts.csvExported(filename);
    }, [sortedLog]);

    const groupedLog = useMemo(() => {
        const groups = [];
        let lastKey = null;
        for (const entry of sortedLog) {
            const key = new Date(entry.timestamp).toDateString();
            if (key !== lastKey) {
                groups.push({ key, label: formatRelativeDay(entry.timestamp), entries: [] });
                lastKey = key;
            }
            groups[groups.length - 1].entries.push(entry);
        }
        return groups;
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
            <div className="flex items-center justify-end gap-4">

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
                        <button onClick={handleClearAll} className="uppercase tracking-widest text-red-400">
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

            <div className="space-y-4">
                {groupedLog.map((group) => {
                    const dayNum = new Date(group.entries[0].timestamp).getDate();
                    return (
                        <div key={group.key} className="overflow-hidden rounded-2xl bg-bg-elevated">
                            <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                                <p className="font-mono text-xl leading-none text-fg-muted">{dayNum}</p>
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">
                                        {group.label}
                                    </p>
                                    <p className="font-mono text-[10px] text-fg-muted/50">
                                        {group.entries.length} {group.entries.length === 1 ? "entry" : "entries"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                {group.entries.map((entry, i) => (
                                    <div key={entry.id} className="group flex gap-4 px-5 py-3">
                                        <div className="flex flex-col items-center pt-1.5">
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fg-muted/40 group-hover:bg-accent" />
                                            {i !== group.entries.length - 1 && (
                                                <span className="mt-1.5 w-px flex-1 bg-border" />
                                            )}
                                        </div>

                                        <div className="flex flex-1 items-center justify-between pb-1">
                                            <div>
                                                <p className="font-mono text-sm text-fg">
                                                    {entry.amount.toLocaleString()} {entry.fromCurrency}
                                                    <span className="mx-2 text-fg-muted">→</span>
                                                    <span className="text-accent">
                                                        {entry.convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {entry.toCurrency}
                                                    </span>
                                                </p>
                                                <p className="mt-0.5 text-xs text-fg-muted">
                                                    1 {entry.fromCurrency} = {entry.exchangeRate.toFixed(4)} {entry.toCurrency}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-xs text-fg-muted">
                                                    {formatRelativeTime(entry.timestamp)}
                                                </span>
                                                <button
                                                    onClick={() => deleteEntry(entry)}
                                                    aria-label="Delete entry"
                                                    className="text-fg-muted opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                                                >
                                                    <IoCloseOutline />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}