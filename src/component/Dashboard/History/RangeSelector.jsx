const RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

export default function RangeSelector({ selectedRange, setSelectedRange }) {
    return (
        <div className="flex gap-1 rounded-lg shadow-lg bg-fg/5 p-1">
            {RANGES.map((r) => (
                <button
                    key={r}
                    onClick={() => setSelectedRange(r)}
                    className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${selectedRange === r
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