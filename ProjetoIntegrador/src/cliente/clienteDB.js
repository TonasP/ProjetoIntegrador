const db = require('../db');
const { ipcMain } = require('electron')

async function buscarClientes() {

    const resultado = await db.query(`
       SELECT 
        planos.nome as plano, clientes.data_nascimento as data_nascimento, clientes.id as id, clientes.nome as nome, clientes.cpf as cpf, clientes.numero_celular as numero, clientes.email as email, clientes.plano_id as plano_id FROM "GymControl".clientes
  join "GymControl".planos 
  on planos.id = clientes.plano_id
  
        `)

    return resultado.rows;
}

async function deletarCliente(event,clienteId){    
    event =''
    const resultado = await db.query('DELETE FROM"GymControl".clientes WHERE ID = $1',[clienteId]);
    return resultado.rows;

}
async function alterarCliente(event,  clienteNome, clienteCpf, data_nascimento, plano_id, numero_celular, email, clienteid) {
    event =''
    const resultado = await db.query(`UPDATE "GymControl".clientes
	set nome=$1, cpf=$2, data_nascimento=$3, plano_id=$4, numero_celular=$5, email=$6
	WHERE id = $7;`, [clienteNome, clienteCpf, data_nascimento, plano_id, numero_celular, email, clienteid]);
    return resultado.rows;

}
async function salvarCliente(event, clienteNome, clienteCpf, data_nascimento, plano_id, numero_celular, email){
    event = ''
    const resultado = await db.query('INSERT INTO"GymControl".clientes(nome, cpf, data_nascimento, plano_id, numero_celular, email)VALUES ($1, $2, $3, $4, $5, $6);', [clienteNome, clienteCpf, data_nascimento, plano_id, numero_celular, email]);
    return resultado.rows;
}

module.exports = {
   buscarClientes,
   deletarCliente,
   alterarCliente,
   salvarCliente,
}