const db = require('../db');
const { ipcMain } = require('electron')

async function buscarServicos() {

    const resultado = await db.query(`select 
        servicos.id as id, 
        clientes.nome as cliente,
        servicos.id_cliente as cliente_id,
        funcionarios.nome as funcionario,
        servicos.id_funcionario as funcionario_id,
        servicos.tipo_servico as servico,
        TO_CHAR (servicos.data_servico, 'YYYY-MM-DD') as data_servico,
        TO_CHAR(servicos.data_servico, 'DD/MM/YYYY') as data
        from "GymControl".servicos
        join "GymControl".funcionarios on funcionarios.id = servicos.id_funcionario
        join "GymControl".clientes on clientes.id = servicos.id_cliente
`)

    return resultado.rows;
}

async function deletarServico(event, ServicoId) {
    event = ''
    const resultado = await db.query('DELETE FROM"GymControl".Servicos WHERE ID = $1', [ServicoId]);
    return resultado.rows;

}
async function alterarServico(event, Servicoid, id_funcionario, id_cliente, tipo_servico, data_servico) {
    event = ''
    const resultado2 = await db.query(`UPDATE "GymControl".Servicos set 
    id_funcionario = $1, id_cliente =$2, tipo_servico =$3, data_servico=$4
    WHERE id = $5;`, [id_funcionario, id_cliente, tipo_servico, data_servico, Servicoid]);
    return resultado2.rows;

}
async function salvarServico(event, id_funcionario, id_cliente, tipo_servico, data_servico) {
    event = ''
    const resultado = await db.query('INSERT INTO"GymControl".Servicos(id_funcionario, id_cliente, tipo_servico, data_servico)VALUES ($1, $2, $3, $4);', [id_funcionario, id_cliente, tipo_servico, data_servico]);
    return resultado.rows;
}

module.exports = {
    buscarServicos,
    deletarServico,
    alterarServico,
    salvarServico,
}