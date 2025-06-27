const db = require('../db');
const { ipcMain } = require('electron')

async function buscarPagamentos() {

    const resultado = await db.query(`
      SELECT 
    pagamentos.id as id,
    clientes.nome as cliente_nome,
    servicos.tipo_servico as servico,
    pagamentos.id_servico as id_servico,
    pagamentos.valor_total as valor,
    pagamentos.forma_pagamento as forma_pagamento
FROM "GymControl".pagamentos
JOIN "GymControl".servicos ON servicos.id = pagamentos.id_servico
JOIN "GymControl".clientes ON clientes.id = servicos.id_cliente;`)

    return resultado.rows;
}

async function deletarPagamento(event,PagamentoId){    
    event =''
    const resultado = await db.query('DELETE FROM"GymControl".Pagamentos WHERE ID = $1',[PagamentoId]);
    return resultado.rows;

}
async function alterarPagamento(event, Pagamentoid, id_servico, valor_total, forma_pagamento) {
    event =''
    const resultado2 = await db.query(`UPDATE "GymControl".Pagamentos set
    id_servico = $1, valor_total =$2, forma_pagamento
    WHERE id = $4;`, [id_servico, valor_total, forma_pagamento, Pagamentoid]);
    return resultado2.rows;

}
async function salvarPagamento(event, id_servico, valor_total, forma_pagamento){
    event = ''
    const resultado = await db.query('INSERT INTO"GymControl".Pagamentos(id_servico, valor_total, forma_pagamento)VALUES ($1, $2, $3);', [id_servico, valor_total, forma_pagamento]);
    return resultado.rows;
}

module.exports = {
   buscarPagamentos,
   deletarPagamento,
   alterarPagamento,
   salvarPagamento,
}