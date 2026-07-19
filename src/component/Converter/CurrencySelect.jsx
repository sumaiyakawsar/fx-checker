"use client";
 
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useCurrency } from "@/context/CurrencyContext"; 
import FlagImage from "../UI/FlagImage";

 
const CurrencySelect = forwardRef(function CurrencySelect({
    value,
    onChange,
    className = "w-28",
    placeholder = "Select currency",
    openUpward = false,
    excludeCodes = [],
}, ref
) {
    const { currencies } = useCurrency();

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const hasValue = Boolean(value);

    const filtered = currencies
        .filter((currency) => !excludeCodes.includes(currency.code))
        .filter((currency) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;

            return (
                currency.code.toLowerCase().includes(q) ||
                currency.name?.toLowerCase().includes(q)
            );
        });

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openDropdown = () => {
        setIsOpen(true);
        setQuery("");
        setHighlightedIndex(0);
        requestAnimationFrame(() => inputRef.current?.focus());
    };
    // Expose openDropdown to parent components via ref, e.g. ref.current.open()
    useImperativeHandle(ref, () => ({
        open: openDropdown,
    }));
    const selectCurrency = (code) => {
        onChange({ target: { value: code } });
        setIsOpen(false);
        setQuery("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[highlightedIndex]) {
                selectCurrency(filtered[highlightedIndex].code);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
                className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-xl
                    bg-bg-subtle
                    px-3
                    py-3
                    text-sm
                    font-mono
                    text-fg
                    outline-none
                    text-left
                    hover:bg-fg-muted/30
                    transition-colors
                    cursor-pointer
                "
            >
                {hasValue ? (
                    <>
                        <FlagImage code={value} size={20} />
                        <span className="flex-1">{value}</span>
                    </>
                ) : (
                    <span className="flex-1 text-fg-muted">{placeholder}</span>
                )}

                <FaCaretDown
                    className={`
                        h-4 w-4 shrink-0 text-fg-muted
                        transition-transform duration-200
                        ${isOpen ? "rotate-180" : "rotate-0"}
                    `}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className={`
                        absolute
                        z-20
                        right-0
                        w-full
                        min-w-[16rem]
                        rounded-xl
                        bg-bg-elevated
                        border
                        border-border
                        shadow-2xl
                        overflow-hidden
                        ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}
                    `}
                >
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setHighlightedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search currency..."
                        className="
                            w-full
                            bg-bg
                            px-3
                            py-2
                            text-sm
                            font-mono
                            text-fg
                            placeholder-fg-muted
                            outline-none
                            border-b
                            border-border
                        "
                    />

                    <ul className="max-h-56 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {filtered.length === 0 && (
                            <li className="px-3 py-2 text-sm font-mono text-fg-muted">
                                No matches
                            </li>
                        )}

                        {filtered.map((currency, index) => (
                            <li key={currency.code}>
                                <button
                                    type="button"
                                    onClick={() => selectCurrency(currency.code)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`
                                        flex w-full items-center gap-2 cursor-pointer
                                        px-3 py-2 text-sm font-mono text-left
                                        ${index === highlightedIndex
                                            ? "bg-border text-accent"
                                            : "text-fg"
                                        }
                                        ${currency.code === value ? "font-bold" : ""}
                                    `}
                                >
                                    <FlagImage code={currency.code} size={20} />
                                    <span>{currency.code}</span>
                                    {currency.name && (
                                        <span className="ml-auto truncate text-xs text-fg-muted">
                                            {currency.name}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
});

export default CurrencySelect;
