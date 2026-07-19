"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const TABS = ["History", "Compare", "Favorites", "Log"];

export default function DashboardTabs({
    activeTab,
    setActiveTab,
    counts = {},
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeCount = counts[activeTab];

    return (
        <div className="">
            {/* Mobile: dropdown */}
            <div className="relative md:hidden" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-bg-elevated p-4  gap-4 text-xs uppercase tracking-widest text-fg"
                >
                    <span className="flex items-center justify-between flex-1">
                        {activeTab}
                        {typeof activeCount === "number" && activeCount > 0 && (
                            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-mono text-accent">
                                {activeCount}
                            </span>
                        )}
                    </span>
                    <FiChevronDown
                        size={16}
                        className={`text-fg-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-xl border border-border bg-bg-elevated p-1.5 shadow-xl shadow-black/20">
                        {TABS.map((tab) => {
                            const isActive = tab === activeTab;
                            const count = counts[tab];

                            return (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setIsOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3.5 py-3 text-sm uppercase tracking-widest transition-colors ${isActive
                                        ? "bg-bg-subtle text-fg"
                                        : "text-fg-muted hover:bg-bg-subtle/60 hover:text-fg"
                                        }`}
                                >
                                    {tab}
                                    {typeof count === "number" && count > 0 && (
                                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-mono text-accent">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Desktop: tabs */}
            <div className="hidden gap-8 md:flex border-b border-border">
                {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    const count = counts[tab];

                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative flex items-center gap-2 pb-3 text-sm uppercase tracking-widest transition-colors ${isActive ? "text-fg" : "text-fg-muted hover:text-fg/70"
                                }`}
                        >
                            {tab}

                            {typeof count === "number" && count > 0 && (
                                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-mono text-accent">
                                    {count}
                                </span>
                            )}

                            {isActive && (
                                <span className="absolute -bottom-px left-0 h-0.5 w-full bg-accent" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}