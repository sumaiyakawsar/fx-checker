import { formatRate } from "@/utils/formatCurrency";

export default function TickerItem({ pair, rate, change }) {
    const positive = change >= 0;
    return (
        <div className="flex items-center gap-2 px-6 whitespace-nowrap border-r border-border">
            <span className="text-fg-muted font-semibold">{pair}</span>
            <span className="text-fg">{formatRate(pair, rate)}</span>
            <span
                className={`font-semibold ${positive ? "text-accent" : "text-red-500"
                    }`}
            >
                {positive ? "▲" : "▼"} {positive ? "+" : ""}
                {change.toFixed(2)}%
            </span>
        </div>
    );
}