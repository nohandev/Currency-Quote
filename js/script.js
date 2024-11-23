const select = e => document.querySelector(e);

const value = select('#value');
const convertFrom = select('#convert-from');

const valueConverted = select('#converted-value');
const convertTo = select('#convert-to');

const convertBtn = select('#convert-btn');

async function getQuotation(fromTo) {
  try {
    const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${fromTo}`);

    if (response.status !== 200) {
      throw new Error(`Erro Na Requisição: ${response.status}`)
    }

    const data = await response.json();
    
    return data;
  }   catch (error) {
  console.error('Erro ao obter cotação:', error.message);
  return null;
  }
}

const converter = async () => {
  if (convertTo.value === convertFrom.value) {
    window.alert('n da pra fazer se o bagui for igual cabeça de jamanta')
    return
  }
  const quotationObject = await getQuotation(`${convertTo.value}-${convertFrom.value}`);
  const selectedValueTogether = convertTo.value + convertFrom.value;
  const quotation = quotationObject[selectedValueTogether].ask;
  const quotationName = quotationObject[selectedValueTogether].code;

  const convertedValue = (parseFloat(value.value) / parseFloat(quotation))

  valueConverted.value = `${quotationName} ${convertedValue.toLocaleString("pt-BR",{minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
};

convertBtn.addEventListener('click', converter);

