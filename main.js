// Processar a primeira planilha do arquivo
// Converter para formato CSV
// Converter CSV para TXT (se necessário, ajuste a formatação aqui)
// Criar e baixar o arquivo TXT

function loadFile() {
    var file = document.getElementById('input-file').files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        var firstSheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[firstSheetName];
        
        var csv = XLSX.utils.sheet_to_csv(worksheet);
        
        var txt = csv.replace(/,/g, "\t");

        downloadTXT(txt, "converted_file.txt");
    };

    reader.readAsArrayBuffer(file);
}

function downloadTXT(content, fileName) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarInterface();
});

document.addEventListener('DOMContentLoaded', () => {
    criarOpcoesAno();
    carregarDados();
});

function criarOpcoesAno() {
    const anoAtual = new Date().getFullYear();
    const selectAno = document.getElementById('ano');
    selectAno.innerHTML = ''; 

    for (let i = 0; i < 5; i++) {
        const ano = anoAtual - i;
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        selectAno.appendChild(option);
    }

    const anoSalvo = localStorage.getItem('ano');
    if (anoSalvo) {
        selectAno.value = anoSalvo;
    }
}


function editar(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.contentEditable = true;
        elemento.focus(); 
        elemento.onkeydown = function(event) {

            if (event.key === 'Enter') {
                event.preventDefault();
                elemento.blur();
            }
        };
    } else {
        console.error('Elemento não encontrado: ', elementId);
    }
}

function salvarAlteracoes(elementId) {
    const elemento = document.getElementById(elementId);
    let valor;

    if (elemento.tagName.toLowerCase() === 'span') {
        valor = elemento.textContent.trim();
        elemento.contentEditable = false;
    } else if (elemento.tagName.toLowerCase() === 'select') {
        valor = elemento.value;
    }

    localStorage.setItem(elementId, valor);
}


function carregarDados() {
    criarOpcoesAno(); 

    const elementos = ['cpf-text', 'nome-text', 'ddd-text', 'telefone-text', 'cpf-registrado-text'];

    elementos.forEach((elementId) => {
        const valorSalvo = localStorage.getItem(elementId);
        if (valorSalvo) {
            document.getElementById(elementId).textContent = valorSalvo;
        }
    });
}

document.addEventListener('DOMContentLoaded', carregarDados);

