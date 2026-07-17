const TABS = ["History", "Compare", "Favorites", "Log"];

export default function DashboardTabs({
    activeTab,
    setActiveTab, counts = {}
}) {
    return (

        <div className="border-b border-border">

            <div className="flex gap-8">

                {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    const count = counts[tab];

                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative flex items-center gap-2 pb-3 text-sm uppercase tracking-widest transition-colors ${isActive ? "text-fg" : "text-fg-muted hover:text-fg/70"
                                }`}
                        >
                            {tab}

                            {typeof count === "number" && count > 0 && (
                                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-mono text-accent">
                                    {count}
                                </span>
                            )}

                            {isActive && (
                                <span className="absolute -bottom-px left-0 h-0.5 w-full bg-accent" />
                            )}
                        </button>
                    );
                })}

            </div>

        </div>

    );
}
