const BASE_URL = "https://api.frankfurter.dev/v2";

async function fetchAPI(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            ...options.headers,
        },
    }); 

    if (!response.ok) {
        let message = `HTTP ${response.status}`;

        try {
            const error = await response.json();
            message = error.message || message;
        } catch {
            // Ignore if response isn't JSON
        }

        throw new Error(message);
    }

    return response.json();
}

/*
|--------------------------------------------------------------------------
| Get Supported Currencies 
| https://api.frankfurter.dev/v2/currencies 
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
| https://api.frankfurter.dev/v2/rate/from/to
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
| 
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

function getPreviousBusinessDay() {
    const date = new Date();

    do {
        date.setDate(date.getDate() - 1);
    } while (date.getDay() === 0 || date.getDay() === 6);

    return date.toISOString().split("T")[0];
}

export async function getTickerRates(pairs) {
    const bases = [...new Set(pairs.map((p) => p.base))];
 
    const dateStr = getPreviousBusinessDay();

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


/*
|--------------------------------------------------------------------------
| Get Rates (base -> multiple quotes, for Compare tab)
| https://api.frankfurter.dev/rates?base=USD&quotes=EUR`
|--------------------------------------------------------------------------
*/
export async function getRates(base, quotes) {
    if (!quotes.length) return {};

    const symbols = quotes.join(",");
    const data = await fetchAPI(`${BASE_URL}/rates?base=${base}&quotes=${symbols}`);

    return normalizeRates(data, quotes);

}


/*
|--------------------------------------------------------------------------
| Get Historical Rates (for History tab chart)
| https://api.frankfurter.dev/v2/rates?base=USD&quotes=JPY&from=2026-04-23&TO=2026-07-23
|--------------------------------------------------------------------------
*/
function getDateRangeForPeriod(range) {
    const today = new Date();
    const to = today.toISOString().split("T")[0];
    const from = new Date(today);

    switch (range) {
        case "1D":
            from.setDate(from.getDate() - 5);
            break;
        case "1W":
            from.setDate(from.getDate() - 7);
            break;
        case "1M":
            from.setMonth(from.getMonth() - 1);
            break;
        case "3M":
            from.setMonth(from.getMonth() - 3);
            break;
        case "1Y":
            from.setFullYear(from.getFullYear() - 1);
            break;
        case "5Y":
            from.setFullYear(from.getFullYear() - 5);
            break;
        default:
            from.setMonth(from.getMonth() - 1);
    }

    return { from: from.toISOString().split("T")[0], to };
}


export async function getHistoricalRates(base, quote, range) {
    const { from, to } = getDateRangeForPeriod(range);
    const params = new URLSearchParams({ base, quotes: quote, from, to });

    const data = await fetchAPI(`${BASE_URL}/rates?${params.toString()}`);
 
    
    return data
        .map((row) => ({ date: row.date, rate: row.rate }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}


