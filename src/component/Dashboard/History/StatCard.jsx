export default function StatCard({
    title,
    value,
    valueColor = "text-white",
}) {
    return (
        <div className="rounded-lg bg-[#1b1b1b] shadow-lg px-4 py-3">

            <p className="uppercase text-[11px] tracking-wide text-white/40">
                {title}
            </p>

            <h3 className={`mt-1 font-mono text-lg  ${valueColor || "text-white"}`}>
                {value}
            </h3>
        </div>
    );
}