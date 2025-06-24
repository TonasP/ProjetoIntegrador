const db = require('../db');
const { ipcMain } = require('electron')

async function buscarServicos() {

    const resultado = await db.query('SELECT * FROM"GymControl".Servicos order by id')

    return resultado.rows;
}

async function deletarServico(event,ServicoId){    
    event =''
    const resultado = await db.query('DELETE FROM"GymControl".Servicos WHERE ID = $1',[ServicoId]);
    return resultado.rows;

}
async function alterarServico(event, Servicoid, id_funcionario, id_cliente, tipo_servico, data_servico) {
    event =''
    const resultado2 = await db.query(`UPDATE "GymControl".Servicos
    id_funcionario = $1, id_cliente =$2, tipo_servico =$3, data_servico=$4
    WHERE id = $5;`, [id_funcionario, id_cliente, tipo_servico, data_servico, Servicoid]);
    return resultado2.rows;

}
async function salvarServico(event, id_funcionario, id_cliente, tipo_servico, data_servico){
    event = ''
    const resultado = await db.query('INSERT INTO"GymControl".Servicos(id_funcionario, id_cliente, tipo_servico, data_servico)VALUES ($1, $2, $3, $4, $5, $6);', [id_funcionario, id_cliente, tipo_servico, data_servico]);
    return resultado.rows;
}

module.exports = {
   buscarServicos,
   deletarServico,
   alterarServico,
   salvarServico,
}