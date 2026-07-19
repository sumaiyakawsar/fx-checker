"use client";

import { useCurrency } from "@/context/CurrencyContext";
import Button from "../UI/Button/Button";
import { FaStar, FaRegStar } from "react-icons/fa";
import { ACTIONS } from "@/constants/actions";

export default function RateInfo({
    onFavorite,
    onLog,
    isFavorited, canLog = true,

}) {
    const {
        exchangeRate,
        fromCurrency,
        toCurrency,
    } = useCurrency();

    if (!exchangeRate) return null;

    return (
        <div className="flex flex-col gap-4 md:flex-row items-center md:justify-between">
            <p className="font-mono text-sm text-neutral-400">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </p>

            <div className="flex items-center gap-3">
                <Button
                    variant={isFavorited ? "primary" : "outline"}
                    icon={isFavorited ? <FaStar /> : <FaRegStar />}
                    onClick={onFavorite}
                >
                    {isFavorited ? "Favorited" : ACTIONS.favorite}
                </Button>

                <Button variant="outline" onClick={onLog} disabled={!canLog}
                    className="w-full xs:w-auto whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Log Conversion
                </Button>
            </div>
        </div>
    );
}