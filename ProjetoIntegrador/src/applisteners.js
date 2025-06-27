const { ipcMain } = require('electron');

// Importe os módulos de banco de dados
const agendamentoDB = require('./agendamento/agendamentoDB');
const clienteDB = require('./cliente/clienteDB');
const funcionarioDB = require('./funcionario/funcionarioDB');
const pagamentosDB = require('./pagamentos/pagamentosDB');
const planoDB = require('./plano/planoDB');
const servicoDB = require('./servico/servicoDB');
const janelas = require('./janelasModal')
const {validarLogin} = require('./login/loginDB')
const {createMainWindow} = require ('./janelaPrincipal')
const janelaPrincipal = require ('./janelaPrincipal')
const login = require ('./login/loginDB')
// --- Handlers por Entidade ---

function registrarAgendamentoHandler() {
    ipcMain.handle('buscar-agendamentos', agendamentoDB.buscarAgendamentos);
    ipcMain.handle('deletar-agendamento', agendamentoDB.deletarAgendamento);
    ipcMain.handle('alterar-agendamento', agendamentoDB.alterarAgendamento);
    ipcMain.handle('salvar-agendamento', agendamentoDB.salvarAgendamento);
    ipcMain.handle('filtrar-agendamentos',agendamentoDB.filtrarAgendamentos);
}

function registrarClienteHandler() {
    ipcMain.handle('buscar-clientes', clienteDB.buscarClientes);
    ipcMain.handle('deletar-cliente', clienteDB.deletarCliente);
    ipcMain.handle('alterar-cliente', clienteDB.alterarCliente);
    ipcMain.handle('salvar-cliente', clienteDB.salvarCliente);
}

function registrarFuncionarioHandler() {
    ipcMain.handle('buscar-funcionarios', funcionarioDB.buscarFuncionarios);
    ipcMain.handle('deletar-funcionario', funcionarioDB.deletarFuncionario);
    ipcMain.handle('alterar-funcionario', funcionarioDB.alterarFuncionario);
    ipcMain.handle('salvar-funcionario', funcionarioDB.salvarFuncionario);
}

function registrarPagamentoHandler() {
    ipcMain.handle('buscar-pagamentos', pagamentosDB.buscarPagamentos);
    ipcMain.handle('deletar-pagamento', pagamentosDB.deletarPagamento);
    ipcMain.handle('alterar-pagamento', pagamentosDB.alterarPagamento);
    ipcMain.handle('salvar-pagamento', pagamentosDB.salvarPagamento);
}

function registrarPlanoHandler() {
    ipcMain.handle('buscar-planos', planoDB.buscarPlanos);
    ipcMain.handle('deletar-plano', planoDB.deletarPlano);
    ipcMain.handle('alterar-plano', planoDB.alterarPlano);
    ipcMain.handle('salvar-plano', planoDB.salvarPlano);
}

function registrarServicoHandler() {
    ipcMain.handle('buscar-servicos', servicoDB.buscarServicos);
    ipcMain.handle('deletar-servico', servicoDB.deletarServico);
    ipcMain.handle('alterar-servico', servicoDB.alterarServico);
    ipcMain.handle('salvar-servico', servicoDB.salvarServico);
}

function registrarJanelas() {
    ipcMain.on('abrir-agendamento', janelas.modalAbrirAgendamentos)
    ipcMain.on('abrir-cliente', janelas.modalAbrirClientes)
    ipcMain.on('abrir-funcionario', janelas.modalAbrirFuncionarios)
    ipcMain.on('abrir-plano', janelas.modalAbrirPlanos)
    ipcMain.on('abrir-servico', janelas.modalAbrirServicos)
    ipcMain.on('abrir-pagamentos', janelas.modalAbrirPagamentos)
    ipcMain.on('abrir-menu-principal', createMainWindow)
    ipcMain.on('abrir-janela-user', janelaPrincipal.createMainWindowUser)
    ipcMain.on('voltar-janela-login',janelaPrincipal.getJanelaLogin)    
    
}
function fecharJanelas(){
    ipcMain.on('fechar-login', janelaPrincipal.closeLoginWindow)
}
function registrarLoginHandler(){
    ipcMain.handle ('validar-perfil', login.validarPerfil)
    ipcMain.handle('validar-login', validarLogin)
}

// --- Função Principal para Registrar Todos os Listeners ---

function registrarListeners() {
    fecharJanelas()
    registrarAgendamentoHandler();
    registrarClienteHandler();
    registrarFuncionarioHandler();
    registrarPagamentoHandler();
    registrarPlanoHandler();
    registrarServicoHandler();
    registrarJanelas();
    registrarLoginHandler();
}

module.exports = {
    registrarListeners
};