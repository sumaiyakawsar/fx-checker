"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { getCurrencies } from "@/services/frankfurter";
import ThemeToggle from "./ThemeToggle";
import logo from "@/app/logo.svg";

export default function Header() {
    const [currencyCount, setCurrencyCount] = useState(null);

    useEffect(() => {
        getCurrencies()
            .then((data) => setCurrencyCount(data.length))
            .catch((err) => console.error("Failed to load currencies:", err));
    }, []);

    const HEADER_INFO = {
        provider: "ECB Data",
        updateType: "EOD",
    };

    return (
        <header className="w-full h-16 bg-bg border-b border-border">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6">

                {/* Logo */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                    <div className="w-8 h-8 flex items-center justify-center overflow-hidden shrink-0">
                        <Image
                            src={logo}
                            alt="FX_CHECKER logo"
                            width={25}
                            height={25}
                            className="object-contain"
                        />
                    </div>

                    <h1 className="text-fg font-bold tracking-widest text-sm sm:text-base">
                        FX_CHECKER
                    </h1>

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs uppercase tracking-widest text-fg-muted">

                    {/* Full info: desktop only */}
                    <div className="hidden md:flex items-center gap-4">
                        <span>{currencyCount ?? "—"} Currencies</span>
                        <span>•</span>
                        <span>{HEADER_INFO.updateType}</span>
                        <span>•</span>
                        <span>{HEADER_INFO.provider}</span>
                    </div>

                    {/* Compact info: mobile/tablet only */}
                    <span className="md:hidden">
                        {currencyCount ?? "—"} Currencies
                    </span>

                    <ThemeToggle />
                </div>

            </div>
        </header>
    );
}