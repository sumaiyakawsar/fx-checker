"use client";

import { useEffect, useRef, useState } from "react";
import TickerItem from "./TickerItem";
import { tickerPairs } from "@/data/tickerData";
import { getTickerRates } from "@/services/frankfurter";


const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // Frankfurter data updates ~once/day, no need to poll harder

export default function LiveTicker() {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        async function loadRates() {
            try {
                const data = await getTickerRates(tickerPairs);
                if (mountedRef.current) {
                    setRates(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to fetch ticker rates:", err);
                if (mountedRef.current) setLoading(false);
            }
        }

        loadRates();
        const interval = setInterval(loadRates, REFRESH_INTERVAL_MS);

        return () => {
            mountedRef.current = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <section className="w-full bg-[#1A1A1A] border-b border-neutral-800">
            <div className="flex overflow-hidden">
                {/* Left Label */}
                <div className="bg-lime-400 text-black p-2 flex items-center gap-2 font-bold uppercase tracking-wider shrink-0 z-10">
                    <span>●</span>
                    <span>Live Markets</span>
                </div>

                {/* Marquee */}
                <div className="relative flex flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center px-6 text-neutral-500 text-sm">
                            Loading live rates...
                        </div>
                    ) : (
                        <div className="flex w-max animate-marquee">
                            {[...rates, ...rates].map((item, i) => (
                                <TickerItem key={`${item.pair}-${i}`} {...item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}