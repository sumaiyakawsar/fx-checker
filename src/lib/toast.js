import { toast } from "sonner";
import { HiTrash } from "react-icons/hi2";

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
        toast(`Removed ${from} → ${to} from favorites`, {
            icon: <HiTrash className="text-red-500 shrink-0" />,
        }),

    compareAdded: (code) =>
        toast.success(`Added ${code} to compare`),

    compareRemoved: (code) =>
        toast(`Removed ${code} from compare`, {
            icon: <HiTrash className="text-red-500 shrink-0" />,

        }),

    logAdded: (from, to) =>
        toast.success(`Logged ${from} → ${to}`),

    logEntryRemoved: (from, to) =>
        toast(`Removed ${from} → ${to} from log`, {
            icon: <HiTrash className="text-red-500 shrink-0" />,
        }),

    logCleared: () =>
        toast("Cleared log", {
            icon: <HiTrash className="text-red-500 shrink-0" />,
        }),

    csvExported: (filename) =>
        toast.success(`Exported ${filename} as CSV`),
};