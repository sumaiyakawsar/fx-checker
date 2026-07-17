export function formatEODLabelGMT(dateStr) {
    const offsetFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Berlin",
        timeZoneName: "shortOffset",
        hour: "2-digit",
    });
    const parts = offsetFormatter.formatToParts(new Date(`${dateStr}T12:00:00Z`));
    const offsetLabel = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
    const offsetHours = parseInt(offsetLabel.replace("GMT", ""), 10) || 1;

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

export function formatTickDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTime(ts) {
    return new Date(ts).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}