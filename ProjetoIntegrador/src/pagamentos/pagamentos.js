// pagamentos.js

// --- Mapeamento de Valores Fixos para Serviços ---
const VALORES_SERVICOS = {
    'Aula de Musculação': 50.00,
    'Consulta Nutricional': 120.00,
    'Treino Personalizado': 90.00,
    'Avaliação Fisica': 70.00,
    'Assinatura de Plano': 150.00,
    'Aula de Zumba': 60.00
};


// --- Seleção dos Elementos do DOM ---
const tabelaPagamento = document.getElementById('pagamentoTableDados');
const modalIdPagamento = document.getElementById('pagamento-id');
const modalServicoSelect = document.getElementById('pagamento-servico');
const modalValorPagamento = document.getElementById('pagamento-valor');
const modalFormaPagamento = document.getElementById('pagamento-forma');

const botaoSalvar = document.getElementById('btn-salvar');
const botaoExcluir = document.getElementById('btn-excluir');
const botaoLimpar = document.getElementById('btn-limpar');

// --- Event Listeners ---
botaoSalvar.addEventListener('click', funcaoSalvar);
botaoExcluir.addEventListener('click', excluirPagamento);
botaoLimpar.addEventListener('click', limparDados);
modalServicoSelect.addEventListener('change', atualizarValorServico);


// --- Lógica de Permissão ---
const validacaoPerfil = localStorage.getItem('perfil');
if (validacaoPerfil === 'user') {
    botaoExcluir.disabled = true;
}

// --- Funções ---

// Preenche o modal com os detalhes do pagamento
function mostrarDetalhes(id, id_servico, valor, forma_pagamento) {
    modalIdPagamento.value = id;
    modalServicoSelect.value = id_servico;
    const valorNumerico = parseFloat(String(valor).replace(/[^0-9,.-]+/g, "").replace(",", "."));
    modalValorPagamento.value = valorNumerico.toFixed(2);
    modalFormaPagamento.value = forma_pagamento;
}

// Limpa os campos do formulário
function limparDados() {
    mostrarDetalhes('', '', '', 'Cartão de Crédito');
}

// Atualiza o campo de valor quando um serviço é selecionado
function atualizarValorServico() {
    const servicoSelecionado = modalServicoSelect.options[modalServicoSelect.selectedIndex];
    if (!servicoSelecionado.value) {
        modalValorPagamento.value = '';
        return;
    }
    const tipoServico = servicoSelecionado.dataset.tipo;
    const valorFixo = VALORES_SERVICOS[tipoServico];

    if (valorFixo) {
        modalValorPagamento.value = valorFixo.toFixed(2);
    } else {
        modalValorPagamento.value = '0.00'; 
        console.warn(`Valor para o serviço "${tipoServico}" não encontrado no mapeamento.`);
    }
}


// Função para salvar (criar ou alterar) um pagamento
async function funcaoSalvar() {
    const id = modalIdPagamento.value;
    const servicoId = modalServicoSelect.value;
    
    // >>> ALTERAÇÃO IMPORTANTE <<<
    // Convertemos o valor do campo para um NÚMERO antes de enviar.
    const valor = parseFloat(modalValorPagamento.value);

    const formaPagamento = modalFormaPagamento.value;

    if (servicoId === '' || isNaN(valor) || valor <= 0) {
        alert("Preencha todos os dados obrigatórios corretamente.");
        return;
    }

   

    if (id) {
        await window.GymAPI.alterarPagamento(id, servicoId, valor, formaPagamento);
    } else {
        await window.GymAPI.salvarPagamento(servicoId, valor, formaPagamento );
    }
    
    carregarPagamentos();
    limparDados();
}

// Função para excluir um pagamento
async function excluirPagamento() {
    const id = modalIdPagamento.value;
    if (!id) {
        alert("Nenhum pagamento selecionado para excluir.");
        return;
    }
    
    const confirmar = confirm(`Tem certeza que deseja excluir este pagamento?`);
    if (confirmar) {
        await window.GymAPI.deletarPagamento(id);
        carregarPagamentos();
        limparDados();
    }
}

// Carrega os pagamentos do backend
async function carregarPagamentos() {
    const listaPagamentos = await window.GymAPI.buscarPagamentos();
    tabelaPagamento.innerHTML = "";

    if (!listaPagamentos || listaPagamentos.length === 0) {
        tabelaPagamento.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum pagamento registrado.</td></tr>';
        return;
    }
    
    listaPagamentos.forEach(criarLinhaPagamento);
    lucide.createIcons();
}

// Cria uma linha na tabela para cada pagamento
function criarLinhaPagamento(pagamento) {
    const linha = document.createElement("tr");

    const valorFormatado = parseFloat(String(pagamento.valor).replace(/[^0-9,.-]+/g, "").replace(",", ".")).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    linha.innerHTML = `
        <td>${pagamento.cliente_nome}</td>
        <td>${pagamento.servico}</td>
        <td>${valorFormatado}</td>
        <td>${pagamento.forma_pagamento}</td>
        <td>
            <button class="btn-edit">
                <i data-lucide="edit"></i>
            </button>
        </td>
    `;

    linha.querySelector('.btn-edit').addEventListener('click', () => {
        mostrarDetalhes(pagamento.id, pagamento.id_servico, pagamento.valor, pagamento.forma_pagamento);
    });

    tabelaPagamento.appendChild(linha);
}

// Popula o dropdown de serviços
async function dropdownServicos() {
    const servicos = await window.GymAPI.buscarServicos();
    modalServicoSelect.innerHTML = "<option value=''>Selecione um serviço a pagar</option>";
    
    servicos.forEach(servico => {
        const option = document.createElement("option");
        option.value = servico.id;
        option.dataset.tipo = servico.servico;

        let dataFormatada = 'Data não definida';
        if (servico.data) {
            const dataObj = new Date(servico.data);
            if (!isNaN(dataObj.getTime())) {
                dataFormatada = dataObj.toLocaleDateString('pt-BR');
            }
        }
        
        option.textContent = `${servico.servico} - ${servico.cliente} (${dataFormatada})`;
        modalServicoSelect.appendChild(option);
    });
}

// Função de inicialização
async function init() {
    await carregarPagamentos();
    await dropdownServicos();
    verificarPermissoes();
    lucide.createIcons();
}

// Função de verificação de permissões
function verificarPermissoes() {
    const validacaoPerfil = localStorage.getItem('perfil');
    if (validacaoPerfil === 'user') {
        botaoExcluir.disabled = true;
    }
}

// Inicia o script
init();
