const currencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
];

export default function CurrencySelect({
    value,
    onChange,
}) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="bg-neutral-700 flex-1 text-white px-4 py-3 rounded-lg"
        >
            {currencies.map((currency) => (
                <option key={currency}>
                    {currency}
                </option>
            ))}
        </select>
    );
}