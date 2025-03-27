// API de câmbio (exemplo usando ExchangeRate-API)
async function converterMoeda(de, para, valor) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${de}`);
        const data = await response.json();
        const taxa = data.rates[para];
        return (valor * taxa).toFixed(2);
    } catch (error) {
        console.error("Erro na conversão:", error);
        return null;
    }
}

async function compararPaises() {
    const pais = document.getElementById('pais-comparacao').value;
    let resultado = document.getElementById('resultado-comparacao');
    
    // Valores base da Rússia em BRL
    const custoRussia = 8900;
    const custoDiarioRussia = 300;
    
    switch(pais) {
        case 'eua':
            const custoEUA = await converterMoeda('USD', 'BRL', 4000);
            const diariaEUA = await converterMoeda('USD', 'BRL', 150);
            resultado.innerHTML = `
                <div class="comparacao-box">
                    <h3>Estados Unidos vs Rússia</h3>
                    <p><strong>Passagem:</strong> R$ ${custoEUA} vs R$ ${custoRussia}</p>
                    <p><strong>Custo diário:</strong> R$ ${diariaEUA} vs R$ ${custoDiarioRussia}</p>
                </div>
            `;
            break;
    }
}
