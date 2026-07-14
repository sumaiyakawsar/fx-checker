import clsx from "clsx";
import { buttonVariants } from "./buttonVariants";

export default function Button({
    children,
    variant = "primary",
    icon,
    className = "",
    ...props
}) {
    return (
        <button
            className={clsx(
                "inline-flex items-center uppercase justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2  cursor-pointer focus:ring-lime-300 disabled:opacity-50 disabled:cursor-not-allowed",
                buttonVariants[variant],
                className
            )}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
}