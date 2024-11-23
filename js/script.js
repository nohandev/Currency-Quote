const select = e => document.querySelector(e);

const value = select('#value');
const convertFrom = select('#convert-from');
const currencySymbol = select('#currency-symbol');
const valueConverted = select('#converted-value');
const convertTo = select('#convert-to');
const convertBtn = select('#convert-btn');
const tradeBtn = select('.trade-btn');
let updateTimeContainer = select('#updateTime');
const historicSection = select('#historic-section')

function updateTime () {
  let now = new Date();

  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');
  let day = now.getDate().toString().padStart(2, '0');
  let month = (now.getMonth() + 1).toString().padStart(2, '0');
  let year = now.getFullYear().toString().padStart(4, '0');
  updateTimeContainer.innerHTML = `Cotação atualizada em: ${day}/${month}/${year} ás: ${hours}:${minutes}:${seconds}`
};

const updateCurrencySymbol = () => {
  currencySymbol.textContent = convertFrom.value;
};

const validateAndFixCurrencies = () => {
  if (convertFrom.value === convertTo.value) {
    window.alert('As moedas selecionadas são iguais! A moeda de destino será alterada automaticamente. xD');
    const alternateValue = convertTo.querySelector('option:not([value="' + convertFrom.value + '"])').value;
    convertTo.value = alternateValue;
  }
};

const swapCurrencies = () => {
  const temp = convertFrom.value;
  convertFrom.value = convertTo.value;
  convertTo.value = temp;
  updateCurrencySymbol(); 
};

async function getQuotation(fromTo) {
  try {
    const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${fromTo}`);
    if (response.status !== 200) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao obter cotação:', error.message);
    return null;
  }
}

const converter = async () => {
  validateAndFixCurrencies();
  
  const quotationObject = await getQuotation(`${convertTo.value}-${convertFrom.value}`);
  if (!quotationObject) {
    alert('Não foi possível obter a cotação. Tente novamente mais tarde.');
    return;
  }

  if (value.value === '') {  
    window.alert('Preencha o campo vazio, Por Favor!');
    return
  }

  const selectedValueTogether = convertTo.value + convertFrom.value;
  const quotation = quotationObject[selectedValueTogether].ask;
  const quotationNameConverted = quotationObject[selectedValueTogether].code;
  const quotationNameConvert = quotationObject[selectedValueTogether].codein;

  const convertedValue = (parseFloat(value.value) / parseFloat(quotation));
  valueConverted.value = `${quotationNameConverted} ${convertedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  historicSection.style.display = 'flex';
  let strToNumber = parseFloat(value.value);
  let contentHistoric = document.createElement('p');
  contentHistoric.innerText = `Converteu: ${quotationNameConvert} ${strToNumber.toFixed(2)} Para: ${valueConverted.value}`;
  historicSection.appendChild(contentHistoric);
};

convertBtn.addEventListener('click', converter);
convertFrom.addEventListener('change', updateCurrencySymbol);
tradeBtn.addEventListener('click', swapCurrencies);

updateCurrencySymbol();
setInterval(updateTime, 1000);
updateTime();