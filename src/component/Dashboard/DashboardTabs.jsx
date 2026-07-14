const TABS = ["History", "Compare", "Favorites", "Log"];


export default function DashboardTabs({
    activeTab,
    setActiveTab, counts = {}
}) {
    return (

        <div className="border-b border-neutral-800">

            <div className="flex gap-8">

                {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    const count = counts[tab];

                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative flex items-center gap-2 pb-3 text-sm uppercase tracking-widest transition-colors ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            {tab}

                            {typeof count === "number" && count > 0 && (
                                <span className="rounded-full bg-lime-400/15 px-2 py-0.5 text-xs font-mono text-lime-400">
                                    {count}
                                </span>
                            )}

                            {isActive && (
                                <span className="absolute -bottom-px left-0 h-0.5 w-full bg-lime-400" />
                            )}
                        </button>
                    );
                })}

            </div>

        </div>

    );
}