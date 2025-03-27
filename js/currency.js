class CurrencyConverter {
    constructor() {
        this.rates = {};
        this.lastUpdate = null;
        this.cacheDuration = 3600000; // 1 hora em ms
    }

    async fetchRates() {
        try {
            const response = await fetch(
                `${API_CONFIG.OPEN_EXCHANGE_RATES.BASE_URL}/latest.json?app_id=${API_CONFIG.OPEN_EXCHANGE_RATES.KEY}`
            );
            
            if (!response.ok) throw new Error('Falha na requisição');
            
            const data = await response.json();
            this.rates = data.rates;
            this.lastUpdate = data.timestamp * 1000;
            
            // Salva no localStorage como fallback
            localStorage.setItem('oxr_rates', JSON.stringify({
                rates: this.rates,
                timestamp: this.lastUpdate
            }));
            
            return true;
            
        } catch (error) {
            console.error("Erro ao buscar taxas:", error);
            this.loadFromLocalStorage();
            return false;
        }
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('oxr_rates');
        if (saved) {
            const data = JSON.parse(saved);
            this.rates = data.rates || FALLBACK_RATES;
            this.lastUpdate = data.timestamp || Date.now();
        } else {
            this.rates = FALLBACK_RATES;
            this.lastUpdate = Date.now();
        }
    }

    async convert(amount, from, to) {
        // Se os dados são velhos ou não existem, busca novos
        if (!this.lastUpdate || (Date.now() - this.lastUpdate) > this.cacheDuration) {
            await this.fetchRates();
        }

        // Verifica se temos as moedas necessárias
        if (!this.rates[from] || !this.rates[to]) {
            throw new Error('Moeda não suportada');
        }

        // Converte via USD (base da API free)
        const amountInUSD = amount / this.rates[from];
        return amountInUSD * this.rates[to];
    }

    async getCountryCurrency(country) {
        const countryCurrencies = {
            'Rússia': 'RUB',
            'EUA': 'USD',
            'Canadá': 'CAD',
            'Alemanha': 'EUR'
            // Adicione outros países
        };
        
        return countryCurrencies[country] || 'USD';
    }
}

// Instância global do conversor
const currencyConverter = new CurrencyConverter();

// Funções de conveniência para o front-end
async function converterPrecoPrincipal() {
    const moeda = document.getElementById('moeda-conversao').value;
    const precoBRL = 8900; // Valor fixo do projeto Rússia
    
    try {
        const resultado = await currencyConverter.convert(precoBRL, 'BRL', moeda);
        document.getElementById('preco-russia').innerText = 
            `${moeda} ${resultado.toFixed(2)}`;
    } catch (error) {
        console.error("Erro na conversão:", error);
        alert("Não foi possível converter. Tente novamente mais tarde.");
    }
}
