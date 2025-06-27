const { contextBridge, ipcRenderer } = require('electron');

// --- Funções de Agendamentos ---
function buscarAgendamentos() {
    return ipcRenderer.invoke('buscar-agendamentos');
}
function deletarAgendamento(id) {
    return ipcRenderer.invoke('deletar-agendamento', id);
}
function alterarAgendamento(id, id_cliente, id_funcionario, data_marcada, tipo) {
    return ipcRenderer.invoke('alterar-agendamento', id, id_cliente, id_funcionario, data_marcada, tipo);
}
function salvarAgendamento(id_cliente, id_funcionario, data_marcada, tipo) {
    return ipcRenderer.invoke('salvar-agendamento', id_cliente, id_funcionario, data_marcada, tipo);
}
function filtrarAgendamentos(tipoFiltro){
    return ipcRenderer.invoke('filtrar-agendamentos', tipoFiltro);
}

// --- Funções de Clientes ---
function buscarClientes() {
    return ipcRenderer.invoke('buscar-clientes');
}
function deletarCliente(id) {
    return ipcRenderer.invoke('deletar-cliente', id);
}
function alterarCliente( nome, cpf, data_nascimento, plano_id, numero_celular, email, id) {
    return ipcRenderer.invoke('alterar-cliente', nome, cpf, data_nascimento, plano_id, numero_celular, email,id);
}
function salvarCliente(nome, cpf, data_nascimento, plano_id, numero_celular, email) {
    return ipcRenderer.invoke('salvar-cliente', nome, cpf, data_nascimento, plano_id, numero_celular, email);
}

// --- Funções de Funcionários ---
function buscarFuncionarios() {
    return ipcRenderer.invoke('buscar-funcionarios');
}
function deletarFuncionario(id) {
    return ipcRenderer.invoke('deletar-funcionario', id);
}
function alterarFuncionario(id, nome, cpf, data_nascimento, funcao, numero_celular, email) {
    return ipcRenderer.invoke('alterar-funcionario', id, nome, cpf, data_nascimento, funcao, numero_celular, email);
}
function salvarFuncionario(nome, cpf, data_nascimento, funcao, numero_celular, email) {
    return ipcRenderer.invoke('salvar-funcionario', nome, cpf, data_nascimento, funcao, numero_celular, email);
}

// --- Funções de Pagamentos ---
function buscarPagamentos() {
    return ipcRenderer.invoke('buscar-pagamentos');
}
function deletarPagamento(id) {
    return ipcRenderer.invoke('deletar-pagamento', id);
}
function alterarPagamento(id, id_servico, valor_total, forma_pagamento) {
    return ipcRenderer.invoke('alterar-pagamento', id, id_servico, valor_total, forma_pagamento);
}
function salvarPagamento(id_servico, valor_total, forma_pagamento) {
    return ipcRenderer.invoke('salvar-pagamento', id_servico, valor_total, forma_pagamento);
}

// --- Funções de Planos ---
function buscarPlanos() {
    return ipcRenderer.invoke('buscar-planos');
}
function deletarPlano(id) {
    return ipcRenderer.invoke('deletar-plano', id);
}
function alterarPlano(id, nome, valor) {
    return ipcRenderer.invoke('alterar-plano', id, nome, valor);
}
function salvarPlano(nome, valor) {
    return ipcRenderer.invoke('salvar-plano', nome, valor);
}

// --- Funções de Serviços ---
function buscarServicos() {
    return ipcRenderer.invoke('buscar-servicos');
}
function deletarServico(id) {
    return ipcRenderer.invoke('deletar-servico', id);
}
function alterarServico(id, id_funcionario, id_cliente, tipo_servico, data_servico) {
    return ipcRenderer.invoke('alterar-servico', id, id_funcionario, id_cliente, tipo_servico, data_servico);
}
function salvarServico(id_funcionario, id_cliente, tipo_servico, data_servico) {
    return ipcRenderer.invoke('salvar-servico', id_funcionario, id_cliente, tipo_servico, data_servico);
}

function validarLogin(login, senha){
    return ipcRenderer.invoke('validar-login', login , senha)
}
function validarPerfil(login,senha){
    return ipcRenderer.invoke('validar-perfil', login, senha)
}

// --- Exposição da API para o Frontend ---
contextBridge.exposeInMainWorld('GymAPI', {
    buscarAgendamentos: buscarAgendamentos,
    deletarAgendamento: deletarAgendamento,
    alterarAgendamento: alterarAgendamento,
    salvarAgendamento: salvarAgendamento,
    filtrarAgendamentos: filtrarAgendamentos,
//----------------------------------------------//
    buscarClientes: buscarClientes,
    deletarCliente: deletarCliente,
    alterarCliente: alterarCliente,
    salvarCliente: salvarCliente,
//----------------------------------------------//
    buscarFuncionarios: buscarFuncionarios,
    deletarFuncionario: deletarFuncionario,
    alterarFuncionario: alterarFuncionario,
    salvarFuncionario: salvarFuncionario,
//----------------------------------------------//    
    buscarPagamentos: buscarPagamentos,
    deletarPagamento: deletarPagamento,
    alterarPagamento: alterarPagamento,
    salvarPagamento: salvarPagamento,
//----------------------------------------------//    
    buscarPlanos: buscarPlanos,
    deletarPlano: deletarPlano,
    alterarPlano: alterarPlano,
    salvarPlano: salvarPlano,
//----------------------------------------------//    
    buscarServicos: buscarServicos,
    deletarServico: deletarServico,
    alterarServico: alterarServico,
    salvarServico: salvarServico,
//----------------------------------------------//   
    validarLogin,
    validarPerfil,

});

function abrirAgendamento(){
    ipcRenderer.send('abrir-agendamento')
}
function abrirCliente(){
    ipcRenderer.send('abrir-cliente')
}
function abrirFuncionario(){
    ipcRenderer.send('abrir-funcionario')
}
function abrirPlano(){
    ipcRenderer.send('abrir-plano')
}
function abrirServico(){
    ipcRenderer.send('abrir-servico')
}
function abrirPagamento(){
    ipcRenderer.send('abrir-pagamentos')
}
function abrirMenuPrincipal(){
    ipcRenderer.send('abrir-menu-principal')
}
function abrirMenuUser(){
    ipcRenderer.send('abrir-janela-user')
}
function fecharLogin(){
    ipcRenderer.send('fechar-login')
}
function voltarJanelaLogin(){
    ipcRenderer.send('voltar-janela-login')
}
contextBridge.exposeInMainWorld('janelaGymAPI',
    {
        
        abrirAgendamento,
        abrirCliente,
        abrirFuncionario,
        abrirPlano,
        abrirServico,
        abrirPagamento,
        abrirMenuPrincipal,
        abrirMenuUser,
    //-----------------------------------------------------
        fecharLogin,
        voltarJanelaLogin,
        
    })