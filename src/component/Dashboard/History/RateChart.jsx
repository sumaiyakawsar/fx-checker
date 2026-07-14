"use client";
import { useMemo, useRef, useState } from "react";

const WIDTH = 1000;
const HEIGHT = 320;
const PAD_LEFT = 60;
const PAD_RIGHT = 20;
const PAD_TOP = 20;
const PAD_BOTTOM = 30;
const TOOLTIP_W = 110;
const TOOLTIP_H = 40;
const CURSOR_OFFSET = 16;

export default function RateChart({ data, pair, loading, error }) {
    const svgRef = useRef(null);
    const [hover, setHover] = useState(null); // { idx, cursorX, cursorY }

    const chart = useMemo(() => {
        if (!data || data.length < 2) return null;

        const rates = data.map((d) => d.rate);
        const min = Math.min(...rates);
        const max = Math.max(...rates);
        const range = max - min || 1;
        const mid = (min + max) / 2;

        const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
        const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;

        const points = data.map((d, i) => [
            PAD_LEFT + (i / (data.length - 1)) * innerW,
            PAD_TOP + (1 - (d.rate - min) / range) * innerH,
        ]);

        const linePath = points
            .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
            .join(" ");

        const areaPath = `${linePath} L ${points.at(-1)[0].toFixed(2)} ${HEIGHT - PAD_BOTTOM} L ${points[0][0].toFixed(2)} ${HEIGHT - PAD_BOTTOM} Z`;

        const labelCount = Math.min(5, data.length);
        const xLabels = Array.from({ length: labelCount }, (_, i) => {
            const idx = Math.round((i / (labelCount - 1)) * (data.length - 1));
            const d = new Date(data[idx].date);
            return { x: points[idx][0], label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
        });

        const lastPoint = { date: data.at(-1).date, rate: data.at(-1).rate };

        return { linePath, areaPath, min, max, mid, xLabels, lastPoint, points };
    }, [data]);

    function formatEODLabelGMT(dateStr) {
        // Look up Europe/Berlin's actual UTC offset for this date (handles CET vs CEST correctly)
        const offsetFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "Europe/Berlin",
            timeZoneName: "shortOffset",
            hour: "2-digit",
        });
        const parts = offsetFormatter.formatToParts(new Date(`${dateStr}T12:00:00Z`));
        const offsetLabel = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
        const offsetHours = parseInt(offsetLabel.replace("GMT", ""), 10) || 1;

        // ECB publishes at 16:00 Berlin local time; convert that to UTC/GMT
        const berlin16 = new Date(`${dateStr}T16:00:00Z`);
        const utcTime = new Date(berlin16.getTime() - offsetHours * 60 * 60 * 1000);

        const datePart = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric", 
            timeZone: "UTC",
        }).format(utcTime);

        const timePart = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
        }).format(utcTime);

        return `${datePart} ${timePart} GMT`;
    }

    function handleMove(e) {
        if (!chart || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * WIDTH;
        const svgY = ((e.clientY - rect.top) / rect.height) * HEIGHT;

        let idx = 0;
        let minDist = Infinity;
        chart.points.forEach(([px], i) => {
            const dist = Math.abs(px - svgX);
            if (dist < minDist) {
                minDist = dist;
                idx = i;
            }
        });

        setHover({ idx, cursorX: svgX, cursorY: svgY });
    }

    function handleLeave() {
        setHover(null);
    }

    const point = chart && hover ? chart.points[hover.idx] : null;
    const entry = hover ? data[hover.idx] : null;

    // tooltip follows raw cursor position, offset to the right; flips left near the edge
    let tooltipX = 0;
    let tooltipY = 0;
    if (hover) {
        const overflowsRight = hover.cursorX + CURSOR_OFFSET + TOOLTIP_W > WIDTH - PAD_RIGHT;
        tooltipX = overflowsRight ? hover.cursorX - CURSOR_OFFSET - TOOLTIP_W : hover.cursorX + CURSOR_OFFSET;
        tooltipY = Math.min(Math.max(hover.cursorY - TOOLTIP_H / 2, PAD_TOP), HEIGHT - PAD_BOTTOM - TOOLTIP_H);
    }

    return (
        <div className="mt-4 rounded-xl  bg-[#1b1b1b] shadow-lg p-5">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-white">{pair}</span>
                {chart && !loading && !error && (
                    <span className="text-xs text-white/50">
                        {chart.lastPoint.rate.toFixed(4)} · {formatEODLabelGMT(chart.lastPoint.date)}
                    </span>
                )}
            </div>

            {loading && (
                <div className="flex h-80 items-center justify-center text-sm text-white/40">Loading rates…</div>
            )}

            {!loading && error && (
                <div className="flex h-80 items-center justify-center text-sm text-red-400">{error}</div>
            )}

            {!loading && !error && !chart && (
                <div className="flex h-80 items-center justify-center text-sm text-white/40">
                    Not enough data to chart this range.
                </div>
            )}

            {!loading && !error && chart && (
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                    className="w-full cursor-crosshair"
                    preserveAspectRatio="none"
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                >
                    <defs>
                        <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c8f31d" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#c8f31d" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <line
                        x1={PAD_LEFT}
                        x2={WIDTH - PAD_RIGHT}
                        y1={PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) / 2}
                        y2={PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) / 2}
                        stroke="white"
                        strokeOpacity="0.1"
                        strokeDasharray="4 4"
                    />

                    <text x={4} y={PAD_TOP + 4} fill="white" fillOpacity="0.4" fontSize="11">
                        {chart.max.toFixed(4)}
                    </text>
                    <text x={4} y={PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) / 2 + 4} fill="white" fillOpacity="0.4" fontSize="11">
                        {chart.mid.toFixed(4)}
                    </text>
                    <text x={4} y={HEIGHT - PAD_BOTTOM} fill="white" fillOpacity="0.4" fontSize="11">
                        {chart.min.toFixed(4)}
                    </text>

                    {chart.xLabels.map((l, i) => (
                        <text key={i} x={l.x} y={HEIGHT - 6} fill="white" fillOpacity="0.4" fontSize="11" textAnchor="middle">
                            {l.label}
                        </text>
                    ))}

                    <path d={chart.areaPath} fill="url(#rateFill)" />
                    <path d={chart.linePath} fill="none" stroke="#c8f31d" strokeWidth="2" />

                    {point && entry && (
                        <>
                            <line
                                x1={point[0]}
                                x2={point[0]}
                                y1={PAD_TOP}
                                y2={HEIGHT - PAD_BOTTOM}
                                stroke="white"
                                strokeOpacity="0.3"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                            <circle cx={point[0]} cy={point[1]} r="4" fill="#c8f31d" stroke="black" strokeWidth="1.5" />

                            <g
                                transform={`translate(${tooltipX}, ${tooltipY})`}
                                style={{ transition: "transform 60ms linear" }}
                            >
                                <rect
                                    width={TOOLTIP_W}
                                    height={TOOLTIP_H}
                                    rx="6"
                                    fill="black"
                                    stroke="white"
                                    strokeOpacity="0.15"
                                />
                                <text x={10} y={16} fill="white" fillOpacity="0.5" fontSize="10" textAnchor="start">
                                    {new Date(entry.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </text>
                                <text x={10} y={31} fill="#c8f31d" fontSize="12" fontWeight="600" textAnchor="start">
                                    Rate: {entry.rate.toFixed(4)}
                                </text>
                            </g>
                        </>
                    )}
                </svg>
            )}
        </div>
    );
}