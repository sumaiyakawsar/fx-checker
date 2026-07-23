"use client";

import { useEffect, useRef } from "react";

const SHORTCUT_GROUPS = [
    {
        title: "Converter",
        shortcuts: [
            { key: "C", description: "Open 'Send' currency" },
            { key: "R", description: "Open 'Receive' currency" },
            { key: "S", description: "Swap currencies" },
            { key: "F", description: "Favorite pair" },
            { key: "L", description: "Log " },
        ],
    },
    {
        title: "Chart Ranges",
        shortcuts: [
            { key: "1 - 6", description: "Select range (1D, 1W, 1M, 3M, 1Y, 5Y)" },
        ],
    },
    {
        title: "General",
        shortcuts: [
            { key: "?", description: "Toggle shortcuts panel" },
            { key: "Esc", description: "Close panel" },
        ],
    },
];

export default function ShortcutsModal({ open, onClose }) {
    const panelRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        }

        function handleKeyDown(e) {
            if (e.key === "Escape" && open) {
                onClose();
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={panelRef}
            className="absolute top-full right-4 sm:right-6 mt-3 w-80 sm:w-96 rounded-2xl 
                         bg-white/60 dark:bg-white/10
                         backdrop-blur-xl  
                         border border-black/10 dark:border-white/10
                         shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                         p-5 z-50 
                         animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* Glass reflection overlay - adapts to theme */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/40 dark:from-white/10 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/20">
                    <h3 className="text-xs font-bold text-black/80 dark:text-white/90 tracking-widest uppercase drop-shadow-sm">
                        Keyboard Shortcuts
                    </h3>
                    <span className="text-[10px] text-black/40 dark:text-white/40 tracking-wider">
                        Click outside to close
                    </span>
                </div>

                {/* Content List */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 
                                  scrollbar-thin scrollbar-thumb-black/20 dark:scrollbar-thumb-white/20 
                                  scrollbar-track-transparent">
                    {SHORTCUT_GROUPS.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-[10px] font-semibold text-black/50 dark:text-white/60 tracking-wider uppercase mb-2 drop-shadow-sm">
                                {group.title}
                            </h4>
                            <div className="space-y-1.5">
                                {group.shortcuts.map((shortcut) => (
                                    <div
                                        key={shortcut.key}
                                        className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg 
                                                     hover:bg-black/5 dark:hover:bg-white/10 
                                                     transition-colors duration-200"
                                    >
                                        <span className="text-black/80 dark:text-white/90 drop-shadow-sm">
                                            {shortcut.description}
                                        </span>
                                        <kbd className="px-2.5 py-0.5 text-[11px] font-mono font-semibold 
                                                           text-black/80 dark:text-white/90
                                                           bg-white/60 dark:bg-white/20 
                                                           backdrop-blur-md 
                                                           border border-black/20 dark:border-white/30
                                                           rounded-lg 
                                                           shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                                                           transition-all duration-200
                                                           hover:bg-white/80 dark:hover:bg-white/30 hover:scale-105">
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}