const db = require('../db');
const { ipcMain } = require('electron')

async function buscarPlanos() {

    const resultado = await db.query('SELECT * FROM"GymControl".Planos order by id')

    return resultado.rows;
}

async function deletarPlano(event,PlanoId){    
    event =''
    const resultado = await db.query('DELETE FROM"GymControl".Planos WHERE ID = $1',[PlanoId]);
    return resultado.rows;

}
async function alterarPlano(event, Planoid, nome, valor) {
    event =''
    const resultado2 = await db.query(`UPDATE "GymControl".Planos
        set nome = $1, valor= $2 where id = $3
        `, [ nome, valor,Planoid]);
    return resultado2.rows; 

}
async function salvarPlano(event, nome, valor){
    event = ''
    const resultado = await db.query('INSERT INTO"GymControl".Planos(nome, valor)VALUES ($1, $2);', [nome, valor]);
    return resultado.rows;
}

module.exports = {
   buscarPlanos,
   deletarPlano,
   alterarPlano,
   salvarPlano,
}