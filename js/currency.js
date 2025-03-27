import { OXR_API_KEY } from './api-config.js';

let ratesCache = null;
let lastFetch = 0;

async function fetchExchangeRates() {
    if (ratesCache && Date.now() - lastFetch < 600000) {
        return ratesCache;
    }

    try {
        const response = await fetch(
            `https://openexchangerates.org/api/latest.json?app_id=${OXR_API_KEY}&base=USD`
        );
        const data = await response.json();
        
        ratesCache = data.rates;
        lastFetch = Date.now();
        return ratesCache;
        
    } catch (error) {
        console.error("Erro ao buscar cotações:", error);
        return null;
    }
}

async function converterMoeda(valor, deMoeda, paraMoeda) {
    const rates = await fetchExchangeRates();
    if (!rates) return null;

    const valorEmUSD = valor / rates[deMoeda];
    const valorConvertido = valorEmUSD * rates[paraMoeda];

    return valorConvertido.toFixed(2);
}
