const db = require('../db');

async function validarLogin(event, login, senha){
   const resultado = await  db.query(`
SELECT
    u.login,
    u.perfil,
    u.cpf,
    c.id AS cliente_id,
    c.nome AS nome_cliente,
    c.data_nascimento AS data_nascimento_cliente,
    c.plano_id,
    f.id AS funcionario_id,
    f.funcao, --
    f.data_nascimento AS data_nascimento_funcionario 
FROM
    "GymControl".usuarios u --

LEFT JOIN "GymControl".clientes c ON c.cpf = u.cpf

LEFT JOIN "GymControl".funcionarios f ON f.cpf = u.cpf
WHERE
    	login = $1 and senha = $2`, [login, senha])
  
   if (resultado.rows.length >0){
    
    return true

   }else{
   return false
   }
   
}
async function validarPerfil(event, login, senha){
   const resultado = await  db.query(`
SELECT
    u.login,
    u.perfil,
    u.cpf,
    c.id AS cliente_id,
    c.nome AS nome_cliente,
    c.data_nascimento AS data_nascimento_cliente,
    c.plano_id,
    f.id AS funcionario_id,
    f.funcao, --
    f.data_nascimento AS data_nascimento_funcionario 
FROM
    "GymControl".usuarios u --

LEFT JOIN "GymControl".clientes c ON c.cpf = u.cpf

LEFT JOIN "GymControl".funcionarios f ON f.cpf = u.cpf
WHERE
    	login = $1 and senha = $2`, [login, senha])
    return resultado.rows
}
module.exports = {
    validarPerfil,
    validarLogin,
}
