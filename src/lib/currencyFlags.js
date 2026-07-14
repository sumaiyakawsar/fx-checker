// Currencies where the ISO code doesn't map cleanly to a single country
const CURRENCY_TO_COUNTRY = {
    EUR: "eu",
    XCD: "ag", // East Caribbean Dollar
    XAF: "cm", // Central African CFA franc
    XOF: "sn", // West African CFA franc
    XPF: "pf", // CFP franc
    ANG: "cw", // Netherlands Antillean guilder
    SBD: "sb",
    BND: "bn",
    NZD: "nz",
    AUD: "au",
    USD: "us",
    GBP: "gb",
    SGD: "sg",
    HKD: "hk",
    CHF: "ch",
    DKK: "dk",
    SEK: "se",
    NOK: "no",
    ILS: "il",
    ZAR: "za",
    KRW: "kr",
    THB: "th",
    MXN: "mx",
    PHP: "ph",
    CZK: "cz",
    IDR: "id",
    HUF: "hu",
    PLN: "pl",
    TRY: "tr",
    INR: "in",
    MYR: "my",
    RON: "ro",
    ISK: "is",
    BGN: "bg",
};

/**
 * Returns the 2-letter country code used for building flag image URLs.
 * Falls back to the first two letters of the currency code
 * (works for most: USD -> us, JPY -> jp).
 */
export function getCurrencyCountryCode(currencyCode) {
    if (!currencyCode) return null;

    const override = CURRENCY_TO_COUNTRY[currencyCode.toUpperCase()];
    return override ?? currencyCode.slice(0, 2).toLowerCase();
}

/**
 * Returns a flagcdn.com image URL for a given currency code.
 * width: pixel width of the flag image (flagcdn provides fixed widths: 20, 40, 80, 160, 320)
 */
export function getCurrencyFlagUrl(currencyCode, width = 40) {
    const countryCode = getCurrencyCountryCode(currencyCode);
    if (!countryCode) return null;

    return `https://flagcdn.com/w${width}/${countryCode}.png`;
}