"use client";

import { useCurrency } from "@/context/CurrencyContext";
import Button from "../UI/Button/Button";
import { FaStar, FaRegStar } from "react-icons/fa";
import { ACTIONS } from "@/constants/actions";

export default function RateInfo({
    onFavorite,
    onLog,
    isFavorited,
}) {
    const {
        exchangeRate,
        fromCurrency,
        toCurrency,
    } = useCurrency();

    if (!exchangeRate) return null;

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-neutral-400">
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

                <Button variant="outline" onClick={onLog}>
                    Log Conversion
                </Button>
            </div>
        </div>
    );
}