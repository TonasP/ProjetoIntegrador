

let tabelaAgendamentos, modal, modalIDAgendamento;
let botaoExcluir, botaoSalvar, botaoLimparDados, botaoFiltrar, botaoLimparFiltro;
let dropdownClienteEl, dropdownFuncionarioEl, dropdownData, dropdownTipo, dropdownFiltro;
let choicesCliente = null;
let choicesFuncionario = null;

let validacaoPerfil = localStorage.getItem('perfil')


document.addEventListener('DOMContentLoaded', init);
async function init() {
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

    botaoLimparDados.addEventListener('click', limparDadosModal);
    botaoSalvar.addEventListener('click', salvarDadosAgendamento);
    botaoExcluir.addEventListener('click', excluirAgendamento);
    botaoFiltrar.addEventListener('click', filtrarAgendamentos);
    botaoLimparFiltro.addEventListener('click', limparFiltro);

    if (validacaoPerfil === 'user'){
    botaoExcluir.disabled = true;
    botaoExcluir.style.opacity = '0.4';
    botaoExcluir.style.cursor = 'not-allowed'
    botaoExcluir.title = "Você não tem permissão para excluir."
}
    
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

    await Promise.all([
        preencherDropdownClientes(),
        preencherDropdownFuncionarios()
    ]);
    
    await carregarAgendamentos();
}

function mostrarDetalhes(agendamento) {
    modalIDAgendamento.value = agendamento.id;
    dropdownData.value = agendamento.data;
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
    dropdownTipo.value = 'Aula de Musculação';

    if (choicesCliente && choicesCliente.getValue()) {
        choicesCliente.removeActiveItems();
        choicesCliente.setChoiceByValue('');
    }
    if (choicesFuncionario && choicesFuncionario.getValue()) {
        choicesFuncionario.removeActiveItems();
        choicesFuncionario.setChoiceByValue('');
    }
}

async function carregarAgendamentos() {
    try {
        const agendamentos = await window.GymAPI.buscarAgendamentos();
        tabelaAgendamentos.innerHTML = "";
        if (!agendamentos || agendamentos.length === 0) {
            tabelaAgendamentos.innerHTML = '<tr><td colspan="5">Nenhum agendamento encontrado.</td></tr>';
        } else {
            agendamentos.forEach(criarLinhaAgendamento);
        }
        // Renderiza os ícones após a tabela ser criada/atualizada
        lucide.createIcons();
    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
    }
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
        choicesCliente.setChoices(clienteChoices, 'value', 'label', true);
    } catch (error) {
        console.error("FALHA AO BUSCAR CLIENTES:", error);
    }
}

async function preencherDropdownFuncionarios() {
    try {
        const funcionarios = await window.GymAPI.buscarFuncionarios();
        const funcionarioChoices = funcionarios.map(f => ({ value: String(f.id), label: f.nome }));
        choicesFuncionario.setChoices(funcionarioChoices, 'value', 'label', true);
    } catch (error) {
        console.error("FALHA AO BUSCAR FUNCIONÁRIOS:", error);
    }
}

async function salvarDadosAgendamento() {
    try {
        const id = modalIDAgendamento.value;
        const clienteId = choicesCliente.getValue(true);
        const funcionarioId = choicesFuncionario.getValue(true);
        const dataMarcada = dropdownData.value;
        const tipoAtendimento = dropdownTipo.value;

        if (!clienteId || !funcionarioId || !dataMarcada) {
            alert("Por favor, preencha todos os campos obrigatórios.");
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
    try {
        const id = modalIDAgendamento.value;
        if (id) {
            await window.GymAPI.deletarAgendamento(id);
            await carregarAgendamentos();
            limparDadosModal();
        }
    } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
    }
}

async function filtrarAgendamentos() {
    try {
        const filtro = dropdownFiltro.value;
        if (filtro == 0) {
            await carregarAgendamentos();
            return;
        }
        const filtroTipo = await window.GymAPI.filtrarAgendamentos(filtro);
        tabelaAgendamentos.innerHTML = '';
        if (!filtroTipo || filtroTipo.length === 0) {
            tabelaAgendamentos.innerHTML = '<tr><td colspan="5">Nenhum agendamento encontrado para este tipo.</td></tr>';
        } else {
            filtroTipo.forEach(criarLinhaAgendamento);
        }
        lucide.createIcons();
    } catch (error) {
        console.error("Erro ao filtrar agendamentos:", error);
    }
}

async function limparFiltro() {
    dropdownFiltro.value = 0;
    await carregarAgendamentos();
}