 export default function StatCard({
    title,
    value,
    valueColor = "text-fg",
}) {
    return (
        <div className="rounded-lg bg-bg-elevated shadow-lg px-4 py-3">

            <p className="uppercase text-[11px] tracking-wide text-fg-muted">
                {title}
            </p>

            <h3 className={`mt-1 font-mono text-lg  ${valueColor || "text-fg"}`}>
                {value}
            </h3>
        </div>
    );
}