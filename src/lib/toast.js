import { toast } from "sonner";

export const toasts = {
    fromCurrencyChanged: (code) =>
        toast(`Changed send currency to ${code}`),
    toCurrencyChanged: (code) =>
        toast(`Changed receive currency to ${code}`),

    swapped: (from, to) =>
        toast(`Swapped to ${from} → ${to}`),

    favoriteAdded: (from, to) =>
        toast.success(`Added ${from} → ${to} to favorites`),
    favoriteRemoved: (from, to) =>
        toast(`Removed ${from} → ${to} from favorites`),

    compareAdded: (code) =>
        toast.success(`Added ${code} to compare`),
    compareRemoved: (code) =>
        toast(`Removed ${code} from compare`),

    logAdded: (from, to) =>
        toast.success(`Logged ${from} → ${to}`),
    logEntryRemoved: (from, to) =>
        toast(`Removed ${from} → ${to} from log`),
    logCleared: () =>
        toast("Cleared log"),
    csvExported: (filename) =>
        toast.success(`Exported ${filename} as CSV`),
};