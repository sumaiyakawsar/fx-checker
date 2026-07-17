export default function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0].payload;

    return (
        <div className="rounded-md bg-bg border border-fg/15 px-3 py-2 shadow-lg transition-all
duration-150">
            <p className="text-[10px] text-fg-muted">
                {new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </p>
            <p className="text-xs font-semibold text-accent">Rate: {entry.rate.toFixed(4)}</p>
        </div>
    );
}