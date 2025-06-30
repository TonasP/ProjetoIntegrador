const db = require('../db');

async function buscarAgendamentos(event, perfil, cpf) {
    if (perfil === 'user') {
        const result2 = await db.query(`
        SELECT 
            agendamentos.id,
            clientes.nome AS cliente, 
            funcionarios.nome AS funcionario, 
            clientes.id AS cliente_id, 
            funcionarios.id AS funcionario_id,
            TO_CHAR(data_marcada, 'YYYY-MM-DD') as data,
            TO_CHAR(data_marcada, 'DD/MM/YYYY') as data_formatada,
            agendamentos.tipo AS tipo
        FROM "GymControl".agendamentos 
        JOIN "GymControl".clientes ON clientes.id = agendamentos.id_cliente
        JOIN "GymControl".funcionarios ON funcionarios.id = agendamentos.id_funcionario
        ORDER BY agendamentos.data_marcada DESC where clientes.cpf = $1
    `, [cpf])
        return result2.rows
    } else {
        const result1 = await db.query(`
        SELECT 
            agendamentos.id,
            clientes.nome AS cliente, 
            funcionarios.nome AS funcionario, 
            clientes.id AS cliente_id, 
            funcionarios.id AS funcionario_id,
            TO_CHAR(data_marcada, 'YYYY-MM-DD') as data,
            TO_CHAR(data_marcada, 'DD/MM/YYYY') as data_formatada,
            agendamentos.tipo AS tipo
        FROM "GymControl".agendamentos 
        JOIN "GymControl".clientes ON clientes.id = agendamentos.id_cliente
        JOIN "GymControl".funcionarios ON funcionarios.id = agendamentos.id_funcionario
        ORDER BY agendamentos.data_marcada DESC
    `   );
        return result1.rows;
    }


}

async function filtrarAgendamentos(event, tipoFiltro) {
    const result = await db.query(`
        SELECT 
            agendamentos.id,
            clientes.nome AS cliente, 
            funcionarios.nome AS funcionario, 
            clientes.id AS cliente_id, 
            funcionarios.id AS funcionario_id,
            TO_CHAR(data_marcada, 'YYYY-MM-DD') as data,
            TO_CHAR(data_marcada, 'DD/MM/YYYY') as data_formatada,
            agendamentos.tipo AS tipo
        FROM "GymControl".agendamentos 
        JOIN "GymControl".clientes ON clientes.id = agendamentos.id_cliente
        JOIN "GymControl".funcionarios ON funcionarios.id = agendamentos.id_funcionario
        WHERE agendamentos.tipo = $1
        ORDER BY agendamentos.data_marcada DESC`, [tipoFiltro]
    );
    return result.rows;
}

async function deletarAgendamento(event, agendamentoId) {
    const resultado = await db.query('DELETE FROM "GymControl".agendamentos WHERE id = $1', [agendamentoId]);
    return resultado.rowCount;
}

async function alterarAgendamento(event, id, id_cliente, id_funcionario, data_marcada, tipo) {
    const resultado2 = await db.query(
        'UPDATE "GymControl".agendamentos SET id_cliente=$2, id_funcionario=$3, data_marcada=$4, tipo=$5 WHERE id = $1',
        [id, id_cliente, id_funcionario, data_marcada, tipo]
    );
    return resultado2.rows;
}

async function salvarAgendamento(event, id_cliente, id_funcionario, data_marcada, tipo) {
    const resultado = await db.query(
        'INSERT INTO "GymControl".agendamentos(id_cliente, id_funcionario, data_marcada, tipo) VALUES ($1, $2, $3, $4) RETURNING *;',
        [id_cliente, id_funcionario, data_marcada, tipo]
    );
    return resultado.rows;
}

module.exports = {
    buscarAgendamentos,
    deletarAgendamento,
    alterarAgendamento,
    salvarAgendamento,
    filtrarAgendamentos,
};