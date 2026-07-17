const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
});

export function formatRate(pair, rate) {
    if (rate === null || rate === undefined) return "—";
    // JPY-quoted pairs conventionally show 2 decimals, everything else 4
    const decimals = pair.endsWith("/JPY") ? 2 : 4;
    return rate.toFixed(decimals);
}
