export default function TickerItem({ pair, rate, change }) {
    const positive = change >= 0;

    return (
        <div className="flex items-center gap-2 px-6 whitespace-nowrap border-r border-neutral-800">

            <span className="text-neutral-400 font-semibold">
                {pair}
            </span>

            <span className="text-white">
                {rate}
            </span>

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