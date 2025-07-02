// servico.js

// --- Seleção dos Elementos do DOM ---
const tabelaServico = document.getElementById('servicoTableDados');
const modalIdServico = document.getElementById('servico-id');
// Os IDs dos <select> que serão transformados em dropdowns com busca
const dropdownClienteEl = document.getElementById('servico-cliente');
const dropdownFuncionarioEl = document.getElementById('servico-funcionario');
const modalTipoServicoSelect = document.getElementById('servico-tipo');
const modalDataServico = document.getElementById('servico-data');

const botaoSalvar = document.getElementById('btn-salvar');
const botaoExcluir = document.getElementById('btn-excluir');
const botaoLimpar = document.getElementById('btn-limpar');

// --- Variáveis para os Dropdowns ---
// Estas variáveis vão guardar as instâncias do Choices.js
let choicesCliente = null;
let choicesFuncionario = null;

// --- Event Listeners ---
botaoSalvar.addEventListener('click', funcaoSalvar);
botaoExcluir.addEventListener('click', excluirServico);
botaoLimpar.addEventListener('click', limparDados);

// --- Lógica de Permissão ---
const validacaoPerfil = localStorage.getItem('perfil');
if (validacaoPerfil === 'user') {
    botaoExcluir.disabled = true;
    botaoExcluir.style.opacity = '0.4';
    botaoExcluir.style.cursor = 'not-allowed';
    botaoExcluir.title = "Você não tem permissão para excluir.";
    botaoSalvar.disabled = true;
    botaoSalvar.style.opacity = '0.4';
    botaoSalvar.style.cursor = 'not-allowed';
    botaoSalvar.title = "Você não tem permissão para alterar.";
}

// --- Funções do Modal ---
function mostrarDetalhes(servico) {
    modalIdServico.value = servico.id;
    modalTipoServicoSelect.value = servico.servico;
    modalDataServico.value = servico.data_servico;

    // Define os valores nos dropdowns Choices.js
    if (choicesCliente) {
        choicesCliente.setChoiceByValue(String(servico.cliente_id));
    }
    if (choicesFuncionario) {
        choicesFuncionario.setChoiceByValue(String(servico.funcionario_id));
    }
}

function limparDados() {
    modalIdServico.value = '';
    modalTipoServicoSelect.value = 'Aula de Musculação';
    modalDataServico.value = '';

    // Limpa os dropdowns Choices.js
    if (choicesCliente) {
        choicesCliente.removeActiveItems();
        choicesCliente.setChoiceByValue('');
    }
    if (choicesFuncionario) {
        choicesFuncionario.removeActiveItems();
        choicesFuncionario.setChoiceByValue('');
    }
}


// --- Funções CRUD (Lógica Central) ---
async function funcaoSalvar() {
    const id = modalIdServico.value;
    const clienteId = choicesCliente.getValue(true); // Pega o valor do dropdown
    const funcionarioId = choicesFuncionario.getValue(true); // Pega o valor do dropdown
    const tipoServico = modalTipoServicoSelect.value;
    const dataServico = modalDataServico.value;

    if (!clienteId || !funcionarioId || !tipoServico || !dataServico) {
        alert("Preencha todos os dados do serviço.");
        return;
    }



    if (id) {
        await window.GymAPI.alterarServico( id, clienteId, funcionarioId, tipoServico, dataServico);
    } else {
        await window.GymAPI.salvarServico(funcionarioId ,clienteId, tipoServico, dataServico );
    }

    await carregarServicos();
    limparDados();
}

async function excluirServico() {
    const id = modalIdServico.value;
    if (!id) {
        alert("Selecione um serviço para excluir.");
        return;
    }

    const confirmar = confirm(`Tem certeza que deseja excluir este serviço?`);
    if (confirmar) {
        await window.GymAPI.deletarServico(id);
        await carregarServicos();
        limparDados();
    }
}


// --- Funções de Carregamento de Dados ---
async function carregarServicos() {
    const listaServicos = await window.GymAPI.buscarServicos();
    tabelaServico.innerHTML = "";
    if (!listaServicos || listaServicos.length === 0) {
        tabelaServico.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum serviço agendado.</td></tr>';
    } else {
        listaServicos.forEach(criarLinhaServico);
    }
    lucide.createIcons();
}

function criarLinhaServico(servico) {
    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>${servico.cliente}</td>
        <td>${servico.funcionario}</td>
        <td>${servico.servico}</td>
        <td>${servico.data}</td>
        <td>
            <button class="edit-btn"><i data-lucide="edit"></i></button>
        </td>
    `;
    linha.querySelector('.edit-btn').addEventListener('click', () => mostrarDetalhes(servico));
    tabelaServico.appendChild(linha);
}

// >>> FUNÇÕES NECESSÁRIAS PARA O CHOICES.JS <<<
async function preencherDropdownClientes() {
    try {
        const clientes = await window.GymAPI.buscarClientes();
        const clienteChoices = clientes.map(c => ({ value: String(c.id), label: c.nome }));
        // Adiciona um placeholder antes de preencher com os dados reais
        choicesCliente.setChoices([{ value: '', label: 'Selecione um cliente' }], 'value', 'label', true);
        choicesCliente.setChoices(clienteChoices, 'value', 'label', false);
    } catch (error) {
        console.error("FALHA AO BUSCAR CLIENTES:", error);
    }
}

async function preencherDropdownFuncionarios() {
    try {
        const funcionarios = await window.GymAPI.buscarFuncionarios();
        const funcionarioChoices = funcionarios.map(f => ({ value: String(f.id), label: f.nome }));
        // Adiciona um placeholder antes de preencher com os dados reais
        choicesFuncionario.setChoices([{ value: '', label: 'Selecione um funcionário' }], 'value', 'label', true);
        choicesFuncionario.setChoices(funcionarioChoices, 'value', 'label', false);
    } catch (error) {
        console.error("FALHA AO BUSCAR FUNCIONÁRIOS:", error);
    }
}
// >>> FIM DAS FUNÇÕES DO CHOICES.JS <<<


// --- Inicialização do Script ---
async function init() {
    // Instancia os dropdowns com a biblioteca Choices.js
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

    // Carrega os dados para os dropdowns
    await preencherDropdownClientes();
    await preencherDropdownFuncionarios();
    
    // Carrega a tabela de serviços
    await carregarServicos();

    // Ativa os ícones estáticos
    lucide.createIcons();
}

// Chama a função de inicialização
init();
