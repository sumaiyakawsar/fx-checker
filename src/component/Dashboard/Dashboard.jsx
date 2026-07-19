"use client";

import { useState } from "react";
import useLocalStorage from "@/lib/useLocalStorage";

import DashboardTabs from "./DashboardTabs";
import HistoryTab from "./History/HistoryTab";
import CompareTab from "./Compare/CompareTab";
import FavoritesTab from "./Favorites/FavoritesTab";
import LogTab from "./Log/LogTab";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("History");

    const [favorites] = useLocalStorage("fxchecker_favorites", []);
    const [log] = useLocalStorage("fxchecker_log", []);

    const counts = {
        Favorites: favorites.length,
        Log: log.length,
    };

    return (
        <section className="pb-8">

            <DashboardTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                counts={counts}
            />

            <div className="mt-8">

                {activeTab === "History" && <HistoryTab />}

                {activeTab === "Compare" && <CompareTab />}

                {activeTab === "Favorites" && (
                    <FavoritesTab onLoadPair={() => setActiveTab("History")} />
                )}

                {activeTab === "Log" && <LogTab />}
                
            </div>

        </section>
    );
}