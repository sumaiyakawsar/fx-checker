/**
 * Escapes a value for safe inclusion in a CSV field.
 * Wraps in quotes and doubles any embedded quotes if the value
 * contains a comma, quote, or newline.
 */
function escapeCsvField(value) {
    const str = String(value);
    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

const LOG_CSV_HEADERS = [
    "Date",
    "Amount Sent",
    "From Currency",
    "Amount Received",
    "To Currency",
    "Exchange Rate",
];

function logEntryToCsvRow(entry) {
    return [
        new Date(entry.timestamp).toISOString(),
        entry.amount,
        entry.fromCurrency,
        entry.convertedAmount,
        entry.toCurrency,
        entry.exchangeRate,
    ];
}

/**
 * Converts an array of conversion-log entries into a CSV string.
 * Does not sort — pass entries in the order you want them exported.
 */
export function buildLogCsv(entries) {
    const rows = entries.map(logEntryToCsvRow);
    return [LOG_CSV_HEADERS, ...rows]
        .map((row) => row.map(escapeCsvField).join(","))
        .join("\n");
}

/**
 * Triggers a browser download of the given CSV string.
 */
export function downloadCsv(csvContent, filename) {
    // Prepend BOM so Excel opens UTF-8 CSVs correctly instead of mangling special characters
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}