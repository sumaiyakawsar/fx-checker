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


export function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diffSec = Math.floor((now - timestamp) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 10) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    if (diffDay < 30) return `${diffWeek}w ago`;
    if (diffDay < 365) return `${diffMonth}mo ago`;
    if (diffYear < 2) return `${diffYear}y ago`;

    return new Date(timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatRelativeDay(timestamp) {
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round(
        (startOfDay(new Date()) - startOfDay(new Date(timestamp))) / 86400000
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffDays < 30) return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffDays < 365) return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;

    const diffYears = Math.floor(diffDays / 365);
    if (diffYears < 2) return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;

    return new Date(timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}