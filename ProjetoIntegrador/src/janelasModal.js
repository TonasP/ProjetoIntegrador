const { BrowserWindow } = require('electron')
const path = require('path');
const { getJanelaPrincipal } = require('./janelaPrincipal');

function criarJanelaModal(telaPai,arquivohtml) {
    const janela = new BrowserWindow({
        width: 800,
        height: 600,

        modal:true,
        parent: telaPai,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    janela.loadFile(arquivohtml);

    return janela;
};

function modalAbrirAgendamentos(){
    let mainWindow= getJanelaPrincipal();
    if (mainWindow){
        criarJanelaModal(mainWindow, './src/agendamento/agendamento.html')
    }
    else{
        console.warn("Não foi possivel abrir a modal : Janela Principal")
    }
}
function modalAbrirClientes(){
    let mainWindow= getJanelaPrincipal();
    if (mainWindow){
        criarJanelaModal(mainWindow, './src/cliente/cliente.html')
    }
    else{
        console.warn("Não foi possivel abrir a modal : Janela Principal")
    }
}
function modalAbrirFuncionarios(){
    let mainWindow= getJanelaPrincipal();
    if (mainWindow){
        criarJanelaModal(mainWindow, './src/funcionario/funcionario.html')
    }
    else{
        console.warn("Não foi possivel abrir a modal : Janela Principal")
    }
}
function modalAbrirPlanos(){
    let mainWindow= getJanelaPrincipal();
    if (mainWindow){
        criarJanelaModal(mainWindow, './src/plano/plano.html')
    }
    else{
        console.warn("Não foi possivel abrir a modal : Janela Principal")
    }
}
function modalAbrirServicos(){
    let mainWindow= getJanelaPrincipal();
    if (mainWindow){
        criarJanelaModal(mainWindow, './src/servico/servico.html')
    }
    else{
        console.warn("Não foi possivel abrir a modal : Janela Principal")
    }
}
function modalAbrirPagamentos(){
    let mainWindow= getJanelaPrincipal();
    if (mainWindow){
        criarJanelaModal(mainWindow, './src/pagamentos/pagamentos.html')
    }
    else{
        console.warn("Não foi possivel abrir a modal : Janela Principal")
    }
}
module.exports= {
    criarJanelaModal,
    modalAbrirAgendamentos,
    modalAbrirClientes,
    modalAbrirFuncionarios,
    modalAbrirPlanos,
    modalAbrirServicos,
    modalAbrirPagamentos,
}