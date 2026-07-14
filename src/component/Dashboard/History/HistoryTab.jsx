"use client";
import { useEffect, useState } from "react";
import HistoryStats from "./HistoryStats";
import RangeSelector from "./RangeSelector";
import RateChart from "./RateChart"; 
import { useCurrency } from "@/context/CurrencyContext";
import { getHistoricalRates } from "@/services/frankfurter";

export default function HistoryTab() {
    const { fromCurrency, toCurrency } = useCurrency();
    const [range, setRange] = useState("1M");
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await getHistoricalRates(fromCurrency, toCurrency, range);
                if (!cancelled) {
                    setChartData(range === "1D" ? data.slice(-2) : data);
                }
            } catch (err) {
                if (!cancelled) setError("Couldn't load rate history.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [fromCurrency, toCurrency, range]);

    const open = chartData[0]?.rate;
    const last = chartData[chartData.length - 1]?.rate;
    const change = open != null && last != null ? last - open : undefined;
    const changePercent = open ? (change / open) * 100 : undefined;

    return (
        <section className="pb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
                <HistoryStats
                    open={open}
                    last={last}
                    change={change}
                    changePercent={changePercent}
                    loading={loading}
                />
                <RangeSelector selectedRange={range} setSelectedRange={setRange} />
            </div>
            <RateChart
                data={chartData}
                pair={`${fromCurrency}/${toCurrency}`}
                loading={loading}
                error={error}
            />
        </section>
    );
}