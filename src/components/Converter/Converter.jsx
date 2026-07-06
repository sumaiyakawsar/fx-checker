"use client";

import { useState } from "react";

import AmountInput from "./AmountInput";
import CurrencySelect from "./CurrencySelect";
import SwapButton from "./SwapButton";
import RateInfo from "./RateInfo";

export default function Converter() {
    const [amount, setAmount] = useState(1000);

    const [from, setFrom] = useState("USD");

    const [to, setTo] = useState("EUR");


    const handleFavorite = () => {
        console.log("Favorite clicked");
    };

    const handleLog = () => {
        console.log("Log clicked");
    };

    const [conversion, setConversion] = useState({
        amount: 1000,
        from: "USD",
        to: "EUR",
        rate: 0.8530,
        result: 853.02,
    });

    return (
        <section className="container mx-auto mt-14 px-6">

            <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest">
                Check The Rate
            </h2>

            <div className="w-full bg-[#1b1b1b] rounded-3xl p-8 shadow-xl">

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">

                    <div className="bg-[#242424] rounded-2xl p-6 w-full min-w-0">


                        <AmountInput
                            label="Send"
                            value={conversion.amount}
                            onChange={(e) => setAmount(e.target.value)}
                            textColor="text-white"
                        />

                        <div className="mt-6">
                            <CurrencySelect
                                value={conversion.from}
                                onChange={(e) =>
                                    setFrom(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    <SwapButton />

                    <div className="bg-[#242424] rounded-2xl p-6 w-full min-w-0">

                        <AmountInput
                            label="Receive"
                            value={conversion.result}
                            onChange={(e) => setAmount(e.target.value)}
                            readOnly
                            textColor="text-lime-400"
                        />
                        <div className="mt-6">
                            <CurrencySelect
                                value={conversion.to}
                                onChange={(e) =>
                                    setTo(e.target.value)
                                }
                            />
                        </div>

                    </div>

                </div>


                <RateInfo
                    rate={`1 ${conversion.from} = ${conversion.rate} ${conversion.to}`}
                    onFavorite={handleFavorite}
                    onLog={handleLog}
                />
            </div>

        </section>
    );
}