const db = require('../db');

async function validarLogin(event, login, senha){
   const resultado = await  db.query('select login, senha, perfil from "GymControl".usuarios where login = $1 or cpf =$1 and senha = $2', [login, senha])
  
   if (resultado.rows.length >0){
    
    return true

   }else{
   return false
   }
   
}
async function validarPerfil(event, login, senha){
   const resultado = await  db.query('select login, senha, perfil from "GymControl".usuarios where login = $1 or cpf =$1 and senha = $2', [login, senha])
    return resultado.rows
}
module.exports = {
    validarPerfil,
    validarLogin,
}
