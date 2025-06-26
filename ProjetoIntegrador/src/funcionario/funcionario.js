const tabelaFuncionario = document.getElementById('FuncionarioTableDados');

// ALTERAÇÃO: Adicionada referência para o novo campo de data
const modalNascimentoFuncionario = document.getElementById('Funcionario-nascimento');
const modalNomeFuncionario = document.getElementById('Funcionario-nome');
const modalCpfFuncionario = document.getElementById('Funcionario-cpf');
const modalIDFuncionario = document.getElementById('Funcionario-id');
const modalPlanoFuncionario = document.getElementById('Funcionario-funcao');
const modalNumeroFuncionario = document.getElementById("Funcionario-numero");
const modalEmailFuncionario = document.getElementById('Funcionario-email')

const botaoExcluir = document.getElementById('btn-excluir');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoLimpar = document.getElementById('btn-limpar'); 
botaoLimpar.addEventListener('click', limparDados);
botaoSalvar.addEventListener('click', funcaoSalvar)
botaoExcluir.addEventListener('click', excluirFuncionario)
const validacaoPerfil = localStorage.get('perfil')

if (validacaoPerfil === 'user'){
    botaoExcluir.disable
}
// ALTERAÇÃO: Adicionado 'dataNascimento' à função e à lógica
function mostrarDetalhes(id, nome, cpf, plano_id, numero, email, dataNascimento) {
    modalIDFuncionario.value = id
    modalNomeFuncionario.value = nome
    modalCpfFuncionario.value = cpf
    modalPlanoFuncionario.value = plano_id
    modalNumeroFuncionario.value = numero
    modalEmailFuncionario.value = email

    // O input type="date" espera o formato 'AAAA-MM-DD'
    if (dataNascimento) {
        modalNascimentoFuncionario.value = new Date(dataNascimento).toISOString().split('T')[0];
    } else {
        modalNascimentoFuncionario.value = '';
    }
}

function limparDados() {
    mostrarDetalhes('', '', '', '', '', '', '')
}

async function funcaoSalvar() {
    const FuncionarioNome = modalNomeFuncionario.value
    const FuncionarioCpf = modalCpfFuncionario.value
    const FuncionarioPlano = modalPlanoFuncionario.value
    const FuncionarioNumero = modalNumeroFuncionario.value
    const FuncionarioEmail = modalEmailFuncionario.value
    const FuncionarioNascimento = modalNascimentoFuncionario.value

    if (modalIDFuncionario.value === '') {
        if (FuncionarioNome === '' || FuncionarioCpf === '' || FuncionarioPlano === '' || FuncionarioNascimento === '') {
            alert("Preencha todos os dados")
            return
        }
        await window.GymAPI.salvarFuncionario(FuncionarioNome, FuncionarioCpf, FuncionarioNascimento, FuncionarioPlano, FuncionarioNumero, FuncionarioEmail)
        carregarFuncionarios();
        limparDados()
        return
    } else {
        await alterarFuncionario()
        carregarFuncionarios();
        limparDados()
        return
    }
}

async function alterarFuncionario() {
    const FuncionarioId = modalIDFuncionario.value
    const FuncionarioNome = modalNomeFuncionario.value
    const FuncionarioCpf = modalCpfFuncionario.value
    const FuncionarioPlano = modalPlanoFuncionario.value
    const FuncionarioNumero = modalNumeroFuncionario.value
    const FuncionarioEmail = modalEmailFuncionario.value
    const FuncionarioNascimento = modalNascimentoFuncionario.value

   
    const retorno = await window.GymAPI.alterarFuncionario(FuncionarioNome, FuncionarioCpf, FuncionarioNascimento, FuncionarioPlano, FuncionarioNumero, FuncionarioEmail, FuncionarioId);

    carregarFuncionarios();
    limparDados()
}

async function excluirFuncionario() {
    const pID = modalIDFuncionario.value;
    const retorno = await window.GymAPI.deletarFuncionario(pID);
    carregarFuncionarios();
    limparDados()
}


async function carregarFuncionarios() {
    const listaFuncionarios = await window.GymAPI.buscarFuncionarios();
    tabelaFuncionario.innerHTML = "";
    listaFuncionarios.forEach(criarLinhaFuncionario)
    if (!listaFuncionarios.length > 0) {
        tabelaFuncionario.textContent = "sem dados"
    }
    lucide.createIcons();
}

function criarLinhaFuncionario(Funcionario) {
    const linha = document.createElement("tr");

    const celulanome = document.createElement("td");
    celulanome.textContent = Funcionario.nome;
    linha.appendChild(celulanome);

    const celulaCpf = document.createElement("td");
    celulaCpf.textContent = Funcionario.cpf;
    linha.appendChild(celulaCpf);

    const celulaPlano = document.createElement("td")
    // Assumindo que a API precisa fazer um JOIN para buscar o nome do funcao
    celulaPlano.textContent = Funcionario.funcao// Use a propriedade correta (ex: 'plano_nome')
    linha.appendChild(celulaPlano)

    const celulaNumero = document.createElement("td")
    celulaNumero.textContent = Funcionario.numero
    linha.appendChild(celulaNumero)

    const celulaEmail = document.createElement("td")
    celulaEmail.textContent = Funcionario.email
    linha.appendChild(celulaEmail)

    // ALTERAÇÃO: Cria e formata a célula da data de nascimento
    const celulaNascimento = document.createElement("td");
    // Formata a data para o padrão brasileiro (DD/MM/AAAA)
    celulaNascimento.textContent = new Date(Funcionario.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    linha.appendChild(celulaNascimento);

    const celulaBotao = document.createElement("td");
    const botao = document.createElement("button");
    botao.addEventListener("click",
        // ALTERAÇÃO: Passa o Funcionario.data_nascimento para a função
        function () {
            mostrarDetalhes(Funcionario.id, Funcionario.nome, Funcionario.cpf, Funcionario.plano_id, Funcionario.numero, Funcionario.email, Funcionario.data_nascimento)
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

    tabelaFuncionario.appendChild(linha);
}



function init() {
    carregarFuncionarios()
}

init()