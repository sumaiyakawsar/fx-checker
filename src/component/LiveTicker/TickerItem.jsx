function formatRate(pair, rate) {
    if (rate === null || rate === undefined) return "—";
    // JPY-quoted pairs conventionally show 2 decimals, everything else 4
    const decimals = pair.endsWith("/JPY") ? 2 : 4;
    return rate.toFixed(decimals);
}

export default function TickerItem({ pair, rate, change }) {
    const positive = change >= 0;
    return (
        <div className="flex items-center gap-2 px-6 whitespace-nowrap border-r border-neutral-800">
            <span className="text-neutral-400 font-semibold">{pair}</span>
            <span className="text-white">{formatRate(pair, rate)}</span>
            <span
                className={`font-semibold ${positive ? "text-lime-400" : "text-red-500"
                    }`}
            >
                {positive ? "▲" : "▼"} {positive ? "+" : ""}
                {change.toFixed(2)}%
            </span>
        </div>
    );
}