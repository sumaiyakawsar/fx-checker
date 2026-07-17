"use client";
import CustomTooltip from "@/component/UI/Tooltip/CustomTooltip";
import { formatEODLabelGMT, formatTickDate } from "@/utils/formatDate";
import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ReferenceLine,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
 

export default function RateChart({ data, pair, loading, error }) {
    const chart = useMemo(() => {
        if (!data || data.length < 2) return null;

        const rates = data.map((d) => d.rate);
        const min = Math.min(...rates);
        const max = Math.max(...rates);
        const mid = (min + max) / 2;

        const labelCount = Math.min(5, data.length);
        const tickIndices = Array.from({ length: labelCount }, (_, i) =>
            Math.round((i / (labelCount - 1)) * (data.length - 1))
        );

        const lastPoint = { date: data.at(-1).date, rate: data.at(-1).rate };

        return { min, max, mid, tickIndices, lastPoint };
    }, [data]);

    const CHART_MARGIN = {
        top: 20,
        right: 20,
        left: 40,
        bottom: 10,
    };
    const AXIS_FONT = 11;

    return (
        <div className="mt-4 rounded-xl bg-bg-elevated shadow-lg p-5">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-fg">{pair}</span>
                {chart && !loading && !error && (
                    <span className="text-xs text-fg-muted">
                        {chart.lastPoint.rate.toFixed(4)} · {formatEODLabelGMT(chart.lastPoint.date)}
                    </span>
                )}
            </div>

            {loading && (
                <div className="flex h-80 items-center justify-center text-sm text-fg-muted animate-pulse rounded-lg bg-bg">Loading rates…</div>
            )}

            {!loading && error && (
                <div className="flex h-80 items-center justify-center text-sm text-red-400">{error}</div>
            )}

            {!loading && !error && !chart && (
                <div className="flex h-80 items-center justify-center text-sm text-fg-muted">
                    Not enough data to chart this range.
                </div>
            )}

            {!loading && !error && chart && (
                <div className="h-80 w-full"

                    aria-label={`Exchange rate chart for ${pair}`}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={CHART_MARGIN}>
                            <defs>
                                <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <ReferenceLine
                                y={chart.mid}
                                stroke="var(--color-fg)"
                                strokeOpacity={0.1}
                                strokeDasharray="4 4"
                                label={{
                                    value: chart.mid.toFixed(4),
                                    position: "left",
                                    fill: "var(--color-fg)",
                                    fillOpacity: 0.4,
                                    fontSize: { AXIS_FONT },
                                }}
                            />
                            <ReferenceLine
                                y={chart.max}
                                stroke="var(--color-fg)"
                                strokeOpacity={0.1}
                                strokeDasharray="4 4"
                                label={{
                                    value: chart.max.toFixed(4),
                                    position: "left",
                                    fill: "var(--color-fg)",
                                    fillOpacity: 0.4,
                                    fontSize: 11,
                                }}
                            />
                            <ReferenceLine
                                y={chart.min}
                                stroke="var(--color-fg)"
                                strokeOpacity={0.1}
                                strokeDasharray="4 4"
                                label={{
                                    value: chart.min.toFixed(4),
                                    position: "left",
                                    fill: "var(--color-fg)",
                                    fillOpacity: 0.4,
                                    fontSize: 11,
                                }}
                            />

                            <XAxis
                                dataKey="date"
                                ticks={chart.tickIndices.map((i) => data[i].date)}
                                tickFormatter={formatTickDate}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "var(--color-fg)", fillOpacity: 0.4, fontSize: 11 }}
                                dy={10}
                            />

                            <YAxis hide domain={[
                                dataMin => dataMin * 0.998,
                                dataMax => dataMax * 1.002,
                            ]} />

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: "var(--color-fg)", strokeOpacity: 0.3, strokeDasharray: "3 3" }}
                            />

                            <Area
                                type="monotone"
                                dataKey="rate"
                                stroke="var(--color-accent)"
                                strokeWidth={2}
                                fill="url(#rateFill)"
                                dot={false}
                                isAnimationActive
                                animationDuration={800}
                                animationEasing="ease-out"
                                activeDot={{
                                    r: 5,
                                    fill: "var(--color-accent)",
                                    stroke: "var(--color-bg)",
                                    strokeWidth: 2,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}