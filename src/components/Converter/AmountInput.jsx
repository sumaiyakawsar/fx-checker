export default function AmountInput({
    label,
    value,
    onChange,
    readOnly = false,
    textColor = "text-white",
}) {
    return (
        <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs uppercase tracking-widest text-neutral-500">
                {label}
            </label>

            <input
                type="number"
                value={value}
                readOnly={readOnly}
                onChange={onChange}
                className={`bg-transparent text-5xl font-bold outline-none ${textColor}`}
            />
        </div>
    );
}