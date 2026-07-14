const BASE_URL = "https://api.frankfurter.dev/v2";

async function fetchAPI(url) {

    const response = await fetch(url);

    if (!response.ok) {
        const text = await response.text();
        console.log(response.status);
        console.log(text);

        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

/*
|--------------------------------------------------------------------------
| Get Supported Currencies
|--------------------------------------------------------------------------
*/

export async function getCurrencies() {
    const data = await fetchAPI(`${BASE_URL}/currencies`);

    return data.map((currency) => ({
        code: currency.iso_code,
        name: currency.name,
    }));
}

/*
|--------------------------------------------------------------------------
| Convert Currency
|--------------------------------------------------------------------------
*/

export async function convertCurrency(
    amount,
    from,
    to
) {
    const data = await fetchAPI(
        `${BASE_URL}/rate/${from}/${to}`
    );


    return {
        convertedAmount: Number((amount * data.rate).toFixed(2)),
        rate: data.rate,
    };
}

/*
|--------------------------------------------------------------------------
| Get Ticker Rates (latest + 24h change)
|--------------------------------------------------------------------------
| Groups pairs by base currency so each base only needs one "latest" call
| and one "yesterday" call, instead of one call per pair.
*/
function normalizeRates(data, quotes) {
    const map = {};
    if (Array.isArray(data)) {
        data.forEach((entry) => {
            if (quotes.includes(entry.quote)) map[entry.quote] = entry.rate;
        });
    } else if (data?.rates) {
        Object.assign(map, data.rates);
    } else if (data && typeof data === "object") {
        quotes.forEach((q) => {
            if (data[q] !== undefined) map[q] = data[q];
        });
    }
    return map;
}

export async function getTickerRates(pairs) {
    const bases = [...new Set(pairs.map((p) => p.base))];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    const perBase = await Promise.all(
        bases.map(async (base) => {
            const quotes = pairs
                .filter((p) => p.base === base)
                .map((p) => p.quote);
            const symbols = quotes.join(",");

            const [latestData, pastData] = await Promise.all([
                fetchAPI(`${BASE_URL}/rates?base=${base}&quotes=${symbols}`),
                fetchAPI(
                    `${BASE_URL}/rates?base=${base}&quotes=${symbols}&date=${dateStr}`
                ),
            ]);

            return {
                base,
                latest: normalizeRates(latestData, quotes),
                past: normalizeRates(pastData, quotes),
            };
        })
    );

    return pairs.map(({ pair, base, quote }) => {
        const entry = perBase.find((r) => r.base === base);
        const rate = entry?.latest[quote];
        const pastRate = entry?.past[quote];

        if (rate === undefined || pastRate === undefined) {
            return { pair, rate: null, change: 0 };
        }

        const change = ((rate - pastRate) / pastRate) * 100;
        return { pair, rate, change };
    });
}
