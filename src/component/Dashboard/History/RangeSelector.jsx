"use client";

import { useEffect } from "react";
import { isTypingTarget } from "@/lib/keyboardUtils"; 

const RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

export default function RangeSelector({ selectedRange, setSelectedRange }) {
    useEffect(() => {
        function handleKeyDown(e) {
            if (isTypingTarget(e.target)) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            const index = Number(e.key) - 1;
            if (index >= 0 && index < RANGES.length) {
                e.preventDefault();
                setSelectedRange(RANGES[index]);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setSelectedRange]);
    
    return (
        <div className="flex w-full gap-1 rounded-lg shadow-lg bg-fg/5 p-1 lg:w-auto">
            {RANGES.map((r) => (
                <button
                    key={r}
                    onClick={() => setSelectedRange(r)}
                    className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors lg:flex-none ${selectedRange === r
                            ? "bg-fg/10 text-fg"
                            : "text-fg-muted hover:text-fg/70"
                        }`}
                >
                    {r}
                </button>
            ))}
        </div>
    );
}