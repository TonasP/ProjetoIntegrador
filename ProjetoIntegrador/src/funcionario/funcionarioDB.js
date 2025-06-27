const db = require('../db');
const { ipcMain } = require('electron')

async function buscarFuncionarios() {

    const resultado = await db.query('SELECT * FROM "GymControl".Funcionarios order by id')

    return resultado.rows;
}

async function deletarFuncionario(event,FuncionarioId){    
    event =''
    const resultado = await db.query('DELETE FROM "GymControl".Funcionarios WHERE ID = $1',[FuncionarioId]);
    return resultado.rows;

}
async function alterarFuncionario(event, Funcionarioid, FuncionarioNome, FuncionarioCpf, data_nascimento, funcao, numero_celular, email) {
    event =''
    const resultado2 = await db.query(`UPDATE "GymControl".Funcionarios set
    nome=$1, cpf=$2, data_nascimento=$3, funcao=$4, numero_celular=$5, email=$6
    WHERE id = $7;`, [FuncionarioNome, FuncionarioCpf, data_nascimento, funcao, numero_celular, email, Funcionarioid]);
    return resultado2.rows;

}
async function salvarFuncionario(event,FuncionarioNome, FuncionarioCpf, data_nascimento, funcao, numero_celular, email){
    event = ''
    const resultado = await db.query('INSERT INTO"GymControl".Funcionarios(nome, cpf, data_nascimento, funcao, numero_celular, email)VALUES ($1, $2, $3, $4, $5, $6);', [FuncionarioNome, FuncionarioCpf, data_nascimento, funcao, numero_celular, email]);
    return resultado.rows;
}

module.exports = {
   buscarFuncionarios,
   deletarFuncionario,
   alterarFuncionario,
   salvarFuncionario,
}