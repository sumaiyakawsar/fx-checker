import StatCard from "./StatCard";
import { BsTriangleFill } from "react-icons/bs";

export default function HistoryStats({ open, last, change, changePercent, loading }) {
    const isUp = change >= 0;

    const stats = [
        { label: "OPEN", value: loading || open == null ? "—" : open.toFixed(4) },
        { label: "LAST", value: loading || last == null ? "—" : last.toFixed(4) },
        {
            label: "CHANGE",
            value: loading || change == null ? "—" : `${isUp ? "+" : ""}${change.toFixed(4)}`,
            color: isUp ? "text-accent" : "text-red-400",
        },
        {
            label: "% CHANGE",
            value:
                loading || changePercent == null
                    ? "—"
                    : (
                        <span className="flex items-center gap-1">
                            {isUp ? <BsTriangleFill size={12} /> : <BsTriangleFill size={12} className="rotate-180" />}
                            {isUp ? "+" : ""}
                            {changePercent.toFixed(2)}%
                        </span>
                    ),
            color: isUp ? "text-accent" : "text-red-400",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
                    <StatCard key={s.label} 
                        title={s.label}
                        value={s.value}
                        valueColor={s.color || "text-fg"}
                    />
            ))}
        </div>
    );
}