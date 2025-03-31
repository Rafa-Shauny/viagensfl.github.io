// Conversor de Moedas (versão com fallback)
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const resultElement = document.getElementById('result');

    // Fallback para demonstração
    const fallbackRates = {
        BRL: { USD: 0.19, EUR: 0.17, RUB: 17.45 },
        USD: { BRL: 5.30, EUR: 0.91, RUB: 92.50 },
        EUR: { BRL: 5.80, USD: 1.10, RUB: 101.20 },
        RUB: { BRL: 0.057, USD: 0.011, EUR: 0.0099 }
    };

    try {
        // Tenta API gratuita
        const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
        const data = await response.json();
        
        if(data.success) {
            resultElement.innerHTML = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
        } else {
            // Usa fallback se API falhar
            const rate = fallbackRates[from][to];
            const converted = (amount * rate).toFixed(2);
            resultElement.innerHTML = `${amount} ${from} ≈ ${converted} ${to} (taxa simulada)`;
        }
    } catch (error) {
        // Fallback definitivo
        const rate = fallbackRates[from][to];
        const converted = (amount * rate).toFixed(2);
        resultElement.innerHTML = `${amount} ${from} ≈ ${converted} ${to} (offline)`;
    }
}

// Inicializa conversor ao carregar
document.addEventListener('DOMContentLoaded', () => {
    // Exemplo inicial
    convertCurrency();
});