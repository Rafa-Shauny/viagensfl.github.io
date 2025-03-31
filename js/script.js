// Configuração da API
const API_KEY = 7808d858a05442d56b60f995; 

// Conversor de Moedas
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;

    if(!amount || isNaN(amount)) {
        alert('Por favor, insira um valor válido');
        return;
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`);
        const data = await response.json();
        
        if(data.result === 'success') {
            const resultElement = document.getElementById('result');
            resultElement.innerHTML = `
                <div class="result-display">
                    <span class="original-amount">${amount} ${from}</span>
                    <span class="equals-sign">=</span>
                    <span class="converted-amount">${data.conversion_result.toFixed(2)} ${to}</span>
                </div>
                <small>Taxa atual: 1 ${from} = ${data.conversion_rate.toFixed(4)} ${to}</small>
            `;
        } else {
            throw new Error(data['error-type']);
        }
    } catch (error) {
        document.getElementById('result').innerHTML = `
            <div class="error-message">
                ❌ Erro na conversão: ${error.message}
            </div>
        `;
    }
}

// Inicialização do Widget de Voos
function initFlightWidget() {
    window.skyscannerLoader({
        container: 'flight-widget',
        settings: {
            currency: 'BRL',
            destination: {
                name: 'Rússia',
                code: 'RU'
            },
            redirectUrl: 'https://www.skyscanner.com.br/transport/flights/br/ru/',
            theme: {
                primaryColor: '#0033A0',
                textColor: '#FFFFFF'
            }
        }
    });
}

// Carregar vídeo dinamicamente
function loadVideo(videoId) {
    const videoContainer = document.querySelector('.video-container');
    videoContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allowfullscreen>
        </iframe>
    `;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initFlightWidget();
    
    // Exemplo de carregamento de vídeo (substituir pelo ID real)
    // loadVideo('ABCD1234');
});