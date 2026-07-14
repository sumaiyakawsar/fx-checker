"use client";
import { useState, useEffect } from "react";

import { getCurrencies } from "@/services/frankfurter";
import { HiArrowTrendingUp } from "react-icons/hi2";

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
        <header className="w-full h-16 bg-[#111111] border-b border-[#222]">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">

                {/* Logo */}
                <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-md bg-lime-400 flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                            <HiArrowTrendingUp className="text-black text-xl" />
                        </span>
                    </div>

                    <h1 className="text-white font-bold tracking-widest">
                        FX_CHECKER
                    </h1>

                </div>

                {/* Right Side */}
                <div className="hidden md:flex items-center gap-4 text-xs uppercase tracking-widest text-gray-400">
                    <span>{currencyCount ?? "—"} Currencies</span>
                    <span>•</span>
                    <span>{HEADER_INFO.updateType}</span>
                    <span>•</span>
                    <span>{HEADER_INFO.provider}</span>
                </div>

            </div>
        </header>
    );
}