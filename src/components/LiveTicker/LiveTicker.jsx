import TickerItem from "./TickerItem";
import { tickerData } from "@/data/tickerData";

export default function LiveTicker() {
    return (
        <section className="w-full bg-[#1A1A1A] border-b border-neutral-800">

            <div className="flex overflow-hidden">

                {/* Left Label */}

                <div className="bg-lime-400 text-black px-6 flex items-center gap-2 font-bold uppercase tracking-wider shrink-0">

                    <span>●</span>

                    <span>Live Markets</span>

                </div>

                {/* Ticker */}

                <div className="flex flex-1 overflow-x-auto scrollbar-hide">

                    {tickerData.map((item) => (
                        <TickerItem
                            key={item.pair}
                            {...item}
                        />
                    ))}

                </div>

            </div>

        </section>
    );
}