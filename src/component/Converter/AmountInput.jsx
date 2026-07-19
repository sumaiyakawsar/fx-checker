export default function AmountInput({
    label,
    value,
    onChange,
    readOnly = false,
    textColor = "text-fg",
}) {
    return (
        <div className="flex flex-1 min-w-0 flex-col gap-2">

            <label className="text-[11px] uppercase tracking-[0.25em] text-fg-muted">
                {label}
            </label>

            <input
                type="number"
                value={value ?? ""}
                readOnly={readOnly}
                onChange={onChange}
                className={`w-full font-mono bg-transparent text-5xl font-bold outline-none ${textColor}`}
            />

        </div>
    );
}