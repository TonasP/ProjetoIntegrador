// agendamento.js

// --- Variáveis Globais ---
let tabelaAgendamentos, modal, modalIDAgendamento;
let botaoExcluir, botaoSalvar, botaoLimparDados, botaoFiltrar, botaoLimparFiltro;
let dropdownClienteEl, dropdownFuncionarioEl, dropdownData, dropdownTipo, dropdownFiltro;
let choicesCliente = null;
let choicesFuncionario = null;

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // 1. Seleção dos Elementos do DOM
    tabelaAgendamentos = document.getElementById('AgendamentosTableDados');
    modal = document.getElementById('modal');
    modalIDAgendamento = document.getElementById('Agendamento-id');
    botaoExcluir = document.getElementById('btn-excluir');
    botaoSalvar = document.getElementById('btn-salvar');
    botaoLimparDados = document.getElementById('btn-limparDados');
    botaoFiltrar = document.getElementById('btnFiltro');
    botaoLimparFiltro = document.getElementById('btn-limparFiltro');
    dropdownClienteEl = document.getElementById('cliente-nome');
    dropdownFuncionarioEl = document.getElementById('funcionario-nome');
    dropdownData = document.getElementById('data');
    dropdownTipo = document.getElementById('tipo');
    dropdownFiltro = document.getElementById('filtro');

    // 2. Event Listeners
    botaoLimparDados.addEventListener('click', limparDadosModal);
    botaoSalvar.addEventListener('click', salvarDadosAgendamento);
    botaoExcluir.addEventListener('click', excluirAgendamento);
    botaoFiltrar.addEventListener('click', filtrarAgendamentos);
    botaoLimparFiltro.addEventListener('click', limparFiltro);

    // 3. Permissões
    verificarPermissoes();
    
    // 4. Configuração dos Dropdowns (Choices.js)
    const choicesConfig = {
        searchEnabled: true,
        placeholder: true,
        itemSelectText: 'Pressionar para selecionar',
        removeItemButton: true,
        noResultsText: 'Nenhum resultado encontrado',
        noChoicesText: 'Carregando...',
        placeholderValue: 'Selecione ou digite para buscar...'
    };
    choicesCliente = new Choices(dropdownClienteEl, choicesConfig);
    choicesFuncionario = new Choices(dropdownFuncionarioEl, choicesConfig);

    // 5. Carregamento Inicial de Dados
    await Promise.all([
        preencherDropdownClientes(),
        preencherDropdownFuncionarios()
    ]);
    
    await carregarAgendamentos();
    lucide.createIcons();
}

// --- Funções do Modal ---
function mostrarDetalhes(agendamento) {
    modalIDAgendamento.value = agendamento.id;
    // Formata a data para o input type="date"
    dropdownData.value = new Date(agendamento.data).toISOString().split('T')[0];
    dropdownTipo.value = agendamento.tipo;

    if (choicesCliente) {
        choicesCliente.setChoiceByValue(String(agendamento.cliente_id));
    }
    if (choicesFuncionario) {
        choicesFuncionario.setChoiceByValue(String(agendamento.funcionario_id));
    }
}

function limparDadosModal() {
    modalIDAgendamento.value = '';
    dropdownData.value = '';
    dropdownTipo.value = 'Aula de Musculação'; // Valor padrão

    if (choicesCliente && choicesCliente.getValue()) {
        choicesCliente.removeActiveItems();
        choicesCliente.setChoiceByValue('');
    }
    if (choicesFuncionario && choicesFuncionario.getValue()) {
        choicesFuncionario.removeActiveItems();
        choicesFuncionario.setChoiceByValue('');
    }
}

// --- Funções CRUD e Filtros ---
async function salvarDadosAgendamento() {
    try {
        const id = modalIDAgendamento.value;
        const clienteId = choicesCliente.getValue(true);
        const funcionarioId = choicesFuncionario.getValue(true);
        const dataMarcada = dropdownData.value;
        const tipoAtendimento = dropdownTipo.value;

        if (!clienteId || !funcionarioId || !dataMarcada) {
            alert("Por favor, preencha cliente, funcionário e data.");
            return;
        }

        const promessa = id 
            ? window.GymAPI.alterarAgendamento(id, clienteId, funcionarioId, dataMarcada, tipoAtendimento)
            : window.GymAPI.salvarAgendamento(clienteId, funcionarioId, dataMarcada, tipoAtendimento);

        await promessa;
        await carregarAgendamentos();
        limparDadosModal();
    } catch (error) {
        console.error("Erro ao salvar agendamento:", error);
    }
}

async function excluirAgendamento() {
    const id = modalIDAgendamento.value;
    if (!id) {
        alert("Nenhum agendamento selecionado para excluir.");
        return;
    }
    const confirmar = confirm("Tem certeza que deseja excluir este agendamento?");
    if (confirmar) {
        try {
            await window.GymAPI.deletarAgendamento(id);
            await carregarAgendamentos();
            limparDadosModal();
        } catch (error) {
            console.error("Erro ao excluir agendamento:", error);
        }
    }
}

async function filtrarAgendamentos() {
    const filtro = dropdownFiltro.value;
    // Se o filtro for '0' (Todos), carrega todos os agendamentos
    if (filtro == 0) {
        await carregarAgendamentos();
        return;
    }
    try {
        const agendamentosFiltrados = await window.GymAPI.filtrarAgendamentos(filtro);
        renderizarTabela(agendamentosFiltrados, 'Nenhum agendamento encontrado para este tipo.');
    } catch (error) {
        console.error("Erro ao filtrar agendamentos:", error);
    }
}

async function limparFiltro() {
    dropdownFiltro.value = 0;
    await carregarAgendamentos();
}

// --- Funções de Carregamento e Renderização ---
async function carregarAgendamentos() {
    try {
        const agendamentos = await window.GymAPI.buscarAgendamentos();
        renderizarTabela(agendamentos, 'Nenhum agendamento encontrado.');
    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
    }
}

// Função auxiliar para renderizar a tabela (evita repetição de código)
function renderizarTabela(dados, mensagemVazio) {
    tabelaAgendamentos.innerHTML = "";
    if (!dados || dados.length === 0) {
        tabelaAgendamentos.innerHTML = `<tr><td colspan="5" style="text-align: center;">${mensagemVazio}</td></tr>`;
    } else {
        dados.forEach(criarLinhaAgendamento);
    }
    lucide.createIcons();
}

function criarLinhaAgendamento(agendamento) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
        <td>${agendamento.cliente}</td>
        <td>${agendamento.funcionario}</td>
        <td>${agendamento.data_formatada}</td>
        <td>${agendamento.tipo}</td>
        <td><button class="edit-btn"><i data-lucide="edit"></i></button></td>
    `;
    linha.querySelector('.edit-btn').addEventListener('click', () => mostrarDetalhes(agendamento));
    tabelaAgendamentos.appendChild(linha);
}

async function preencherDropdownClientes() {
    try {
        const clientes = await window.GymAPI.buscarClientes();
        const clienteChoices = clientes.map(c => ({ value: String(c.id), label: c.nome }));
        choicesCliente.setChoices([{ value: '', label: 'Selecione...' }, ...clienteChoices], 'value', 'label', false);
    } catch (error) {
        console.error("FALHA AO BUSCAR CLIENTES:", error);
    }
}

async function preencherDropdownFuncionarios() {
    try {
        const funcionarios = await window.GymAPI.buscarFuncionarios();
        const funcionarioChoices = funcionarios.map(f => ({ value: String(f.id), label: f.nome }));
        choicesFuncionario.setChoices([{ value: '', label: 'Selecione...' }, ...funcionarioChoices], 'value', 'label', false);
    } catch (error) {
        console.error("FALHA AO BUSCAR FUNCIONÁRIOS:", error);
    }
}

// --- Lógica de Permissões ---
function verificarPermissoes() {
    const validacaoPerfil = localStorage.getItem('perfil');
    if (validacaoPerfil === 'user') {
        botaoExcluir.disabled = true;
        botaoExcluir.style.opacity = '0.4';
        botaoExcluir.style.cursor = 'not-allowed';
        botaoExcluir.title = "Você não tem permissão para excluir.";
    }
}
