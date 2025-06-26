const tabelaCliente = document.getElementById('clienteTableDados');

// ALTERAÇÃO: Adicionada referência para o novo campo de data
const modalNascimentoCliente = document.getElementById('cliente-nascimento');
const modalNomeCliente = document.getElementById('cliente-nome');
const modalCpfCliente = document.getElementById('cliente-cpf');
const modalIDCliente = document.getElementById('cliente-id');
const modalPlanoCliente = document.getElementById('cliente-plano');
const modalNumeroCliente = document.getElementById("cliente-numero");
const modalEmailCliente = document.getElementById('cliente-email')

const botaoExcluir = document.getElementById('btn-excluir');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoLimpar = document.getElementById('btn-limpar'); 
botaoLimpar.addEventListener('click', limparDados);
botaoSalvar.addEventListener('click', funcaoSalvar)
botaoExcluir.addEventListener('click', excluirCliente)
const validacaoPerfil = localStorage.get('perfil')

if (validacaoPerfil === 'user'){
    botaoExcluir.disable
}
// ALTERAÇÃO: Adicionado 'dataNascimento' à função e à lógica
function mostrarDetalhes(id, nome, cpf, plano_id, numero, email, dataNascimento) {
    modalIDCliente.value = id
    modalNomeCliente.value = nome
    modalCpfCliente.value = cpf
    modalPlanoCliente.value = plano_id
    modalNumeroCliente.value = numero
    modalEmailCliente.value = email

    // O input type="date" espera o formato 'AAAA-MM-DD'
    if (dataNascimento) {
        modalNascimentoCliente.value = new Date(dataNascimento).toISOString().split('T')[0];
    } else {
        modalNascimentoCliente.value = '';
    }
}

function limparDados() {
    mostrarDetalhes('', '', '', '', '', '', '')
}

async function funcaoSalvar() {
    const ClienteNome = modalNomeCliente.value
    const ClienteCpf = modalCpfCliente.value
    const ClientePlano = modalPlanoCliente.value
    const ClienteNumero = modalNumeroCliente.value
    const ClienteEmail = modalEmailCliente.value
    const ClienteNascimento = modalNascimentoCliente.value

    if (modalIDCliente.value === '') {
        if (ClienteNome === '' || ClienteCpf === '' || ClientePlano === '' || ClienteNascimento === '') {
            alert("Preencha todos os dados")
            return
        }
        await window.GymAPI.salvarCliente(ClienteNome, ClienteCpf, ClienteNascimento, ClientePlano, ClienteNumero, ClienteEmail)
        carregarClientes();
        limparDados()
        return
    } else {
        await alterarCliente()
        carregarClientes();
        limparDados()
        return
    }
}

async function alterarCliente() {
    const ClienteId = modalIDCliente.value
    const ClienteNome = modalNomeCliente.value
    const ClienteCpf = modalCpfCliente.value
    const ClientePlano = modalPlanoCliente.value
    const ClienteNumero = modalNumeroCliente.value
    const ClienteEmail = modalEmailCliente.value
    const ClienteNascimento = modalNascimentoCliente.value

   
    const retorno = await window.GymAPI.alterarCliente(ClienteNome, ClienteCpf, ClienteNascimento, ClientePlano, ClienteNumero, ClienteEmail, ClienteId);

    carregarClientes();
    limparDados()
}

async function excluirCliente() {
    const pID = modalIDCliente.value;
    const retorno = await window.GymAPI.deletarCliente(pID);
    carregarClientes();
    limparDados()
}


async function carregarClientes() {
    const listaClientes = await window.GymAPI.buscarClientes();
    tabelaCliente.innerHTML = "";
    listaClientes.forEach(criarLinhaCliente)
    if (!listaClientes.length > 0) {
        tabelaCliente.textContent = "sem dados"
    }
    lucide.createIcons();
}

function criarLinhaCliente(Cliente) {
    const linha = document.createElement("tr");

    const celulanome = document.createElement("td");
    celulanome.textContent = Cliente.nome;
    linha.appendChild(celulanome);

    const celulaCpf = document.createElement("td");
    celulaCpf.textContent = Cliente.cpf;
    linha.appendChild(celulaCpf);

    const celulaPlano = document.createElement("td")
    // Assumindo que a API precisa fazer um JOIN para buscar o nome do plano
    celulaPlano.textContent = Cliente.plano// Use a propriedade correta (ex: 'plano_nome')
    linha.appendChild(celulaPlano)

    const celulaNumero = document.createElement("td")
    celulaNumero.textContent = Cliente.numero
    linha.appendChild(celulaNumero)

    const celulaEmail = document.createElement("td")
    celulaEmail.textContent = Cliente.email
    linha.appendChild(celulaEmail)

    // ALTERAÇÃO: Cria e formata a célula da data de nascimento
    const celulaNascimento = document.createElement("td");
    // Formata a data para o padrão brasileiro (DD/MM/AAAA)
    celulaNascimento.textContent = new Date(Cliente.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    linha.appendChild(celulaNascimento);

    const celulaBotao = document.createElement("td");
    const botao = document.createElement("button");
    botao.addEventListener("click",
        // ALTERAÇÃO: Passa o Cliente.data_nascimento para a função
        function () {
            mostrarDetalhes(Cliente.id, Cliente.nome, Cliente.cpf, Cliente.plano_id, Cliente.numero, Cliente.email, Cliente.data_nascimento)
        }
    );

    const icone = document.createElement("i")
    icone.setAttribute("data-lucide", "edit");
    botao.appendChild(icone);

    const iconeLimpar = document.getElementById('iLimpar');
    iconeLimpar.setAttribute('data-lucide', 'eraser');
    const iconeSalvar = document.getElementById('iSalvar')
    iconeSalvar.setAttribute('data-lucide', 'save-all')
    const iconeExcluir = document.getElementById('iExcluir')
    iconeExcluir.setAttribute('data-lucide', 'trash2')

    celulaBotao.appendChild(botao);
    linha.appendChild(celulaBotao);

    tabelaCliente.appendChild(linha);
}

async function dropdownPlanos() {
    const plano = await window.GymAPI.buscarPlanos();
    modalPlanoCliente.innerHTML = "";

    // Adiciona uma opção inicial "Selecione"
    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Selecione um plano";
    modalPlanoCliente.appendChild(optionDefault);

    plano.forEach(plano => {
        const option = document.createElement("option");
        option.value = plano.id;
        option.textContent = plano.nome;
        modalPlanoCliente.appendChild(option);
    });
}

function init() {
    carregarClientes(),
    dropdownPlanos()
}

init()