// planos.js

// --- Seleção dos Elementos do DOM ---
const tabelaPlano = document.getElementById('planoTableDados');
const modalIdPlano = document.getElementById('plano-id');
const modalNomePlano = document.getElementById('plano-nome');
const modalValorPlano = document.getElementById('plano-valor');

const botaoSalvar = document.getElementById('btn-salvar');
const botaoExcluir = document.getElementById('btn-excluir');
const botaoLimpar = document.getElementById('btn-limpar');

// --- Event Listeners ---
botaoSalvar.addEventListener('click', funcaoSalvar);
botaoExcluir.addEventListener('click', excluirPlano);
botaoLimpar.addEventListener('click', limparDados);

// --- Lógica de Permissão ---
const validacaoPerfil = localStorage.getItem('perfil');
if (validacaoPerfil === 'user') {
    botaoExcluir.disabled = true;
    botaoSalvar.disabled = true
}

// --- Funções ---

// Preenche o modal com os detalhes do plano ao clicar em editar
function mostrarDetalhes(id, nome, valor) {
    modalIdPlano.value = id;
    modalNomePlano.value = nome;
    // Garante que o valor esteja no formato correto para o input 'number'
    modalValorPlano.value = parseFloat(valor).toFixed(2);
}

// Limpa os campos do formulário
function limparDados() {
    mostrarDetalhes('', '', '');
}

// Função principal para salvar (decide entre criar novo ou alterar)
async function funcaoSalvar() {
    const nome = modalNomePlano.value;
    const valor = modalValorPlano.value;

    // Se o ID está vazio, é um novo plano
    if (modalIdPlano.value === '') {
        if (nome === '' || valor === '') {
            alert("Preencha todos os dados do plano.");
            return;
        }
        await window.GymAPI.salvarPlano(nome, valor);
    } else {
        // Se tem ID, é uma alteração
        await alterarPlano();
    }
    
    // Atualiza a tabela e limpa o formulário
    carregarPlanos();
    limparDados();
}

// Função para alterar um plano existente
async function alterarPlano() {
    const id = modalIdPlano.value;
    const nome = modalNomePlano.value;
    const valor = modalValorPlano.value;
    
    await window.GymAPI.alterarPlano(id, nome, valor);
}

// Função para excluir um plano
async function excluirPlano() {
    const id = modalIdPlano.value;

    if (!id) {
        alert("Nenhum plano selecionado para excluir.");
        return;
    }
    
    const confirmar = confirm(`Tem certeza que deseja excluir o plano "${modalNomePlano.value}"?`);
    if (confirmar) {
        await window.GymAPI.deletarPlano(id);
        carregarPlanos();
        limparDados();
    }
}

// Carrega os planos do backend e os exibe na tabela
async function carregarPlanos() {
    const listaPlanos = await window.GymAPI.buscarPlanos();
    tabelaPlano.innerHTML = ""; // Limpa a tabela antes de preencher

    if (!listaPlanos || listaPlanos.length === 0) {
        tabelaPlano.innerHTML = '<tr><td colspan="3" style="text-align: center;">Nenhum plano cadastrado.</td></tr>';
        return;
    }
    
    listaPlanos.forEach(criarLinhaPlano);
    lucide.createIcons(); // Renderiza os ícones
}

// Cria uma linha <tr> na tabela para um plano
function criarLinhaPlano(plano) {
    const linha = document.createElement("tr");

    // Formata o valor monetário que vem do banco (ex: 'R$ 50,00') para um número
    const valorNumerico = parseFloat(String(plano.valor).replace(/[^0-9,.-]+/g, "").replace(",", "."));
    const valorFormatado = valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


    const celulaNome = document.createElement("td");
    celulaNome.textContent = plano.nome;
    linha.appendChild(celulaNome);

    const celulaValor = document.createElement("td");
    celulaValor.textContent = valorFormatado;
    linha.appendChild(celulaValor);

    const celulaBotao = document.createElement("td");
    const botao = document.createElement("button");
    botao.addEventListener("click", () => {
        mostrarDetalhes(plano.id, plano.nome, valorNumerico);
    });

    const icone = document.createElement("i");
    icone.setAttribute("data-lucide", "edit");
    botao.appendChild(icone);
    
    celulaBotao.appendChild(botao);
    linha.appendChild(celulaBotao);

    tabelaPlano.appendChild(linha);
}

// Função de inicialização
function init() {
    carregarPlanos();
    
    // Define os ícones estáticos do modal uma única vez
    const iconeLimpar = document.getElementById('iLimpar');
    if(iconeLimpar) iconeLimpar.setAttribute('data-lucide', 'eraser');

    const iconeSalvar = document.getElementById('iSalvar');
    if(iconeSalvar) iconeSalvar.setAttribute('data-lucide', 'save-all');
    
    const iconeExcluir = document.getElementById('iExcluir');
    if(iconeExcluir) iconeExcluir.setAttribute('data-lucide', 'trash-2');

    lucide.createIcons();
}

// Inicia o script quando o documento estiver pronto
init();

