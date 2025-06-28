// pagamentos.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAD_MFATrOhmxTTr3COBk0gEbIKPq6tw_I",
  authDomain: "gym-controllapp.firebaseapp.com",
  projectId: "gym-controllapp",
  storageBucket: "gym-controllapp.firebasestorage.app",
  messagingSenderId: "587927478068",
  appId: "1:587927478068:web:153b3e7be32fff460f4f61"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


// --- Mapeamento de Valores Fixos para Serviços ---
const VALORES_SERVICOS = {
    'Aula de Musculação': 50.00, 'Consulta Nutricional': 120.00,
    'Treino Personalizado': 90.00, 'Avaliação Fisica': 70.00,
    'Assinatura de Plano': 150.00, 'Aula de Zumba': 60.00
};

// --- Variáveis Globais ---
const tabelaPagamento = document.getElementById('pagamentoTableDados');
const modalIdPagamento = document.getElementById('pagamento-id');
const modalServicoSelect = document.getElementById('pagamento-servico');
const modalValorPagamento = document.getElementById('pagamento-valor');
const modalFormaPagamento = document.getElementById('pagamento-forma');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoExcluir = document.getElementById('btn-excluir');
const botaoLimpar = document.getElementById('btn-limpar');
// Elementos do Modal QR Code
const qrCodeOverlay = document.getElementById('modal-qrcode-overlay');
const qrCodeContainer = document.getElementById('qrcode-container');
const btnCancelarPix = document.getElementById('btn-cancelar-pix');
let confirmationListener = null; 

// --- Event Listeners ---
botaoSalvar.addEventListener('click', funcaoSalvar);
botaoExcluir.addEventListener('click', excluirPagamento);
botaoLimpar.addEventListener('click', limparDados);
modalServicoSelect.addEventListener('change', atualizarValorServico);
btnCancelarPix.addEventListener('click', cancelarFluxoPix);


// --- Lógica de Permissão ---
const validacaoPerfil = localStorage.getItem('perfil');
if (validacaoPerfil === 'user') { botaoExcluir.disabled = true; }

// --- Funções ---

async function funcaoSalvar() {
    const formaPagamento = modalFormaPagamento.value;
    const servicoId = modalServicoSelect.value;
    const valor = parseFloat(modalValorPagamento.value);

    if (servicoId === '' || isNaN(valor) || valor <= 0) {
        alert("Selecione um serviço e certifique-se de que o valor é válido.");
        return;
    }

    if (formaPagamento === 'PIX') {
        iniciarFluxoPix();
    } else {
        await salvarPagamentoNoBanco();
    }
}

async function iniciarFluxoPix() {
    const valor = modalValorPagamento.value;
    const paymentId = `pix-${Date.now()}`;

    try {
        await setDoc(doc(db, "pending_payments", paymentId), {
            status: "PENDING",
            valor: parseFloat(valor),
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Erro ao criar pedido de pagamento no Firestore:", error);
        alert("Não foi possível iniciar o pagamento PIX. Verifique a consola.");
        return;
    }

    const baseUrl = "https://tonasp.github.io/gym-payment/";
    const confirmationUrl = `${baseUrl}?id=${paymentId}&valor=${valor}`;
    
    qrCodeContainer.innerHTML = '';
    const qr = qrcode(0, 'L');
    qr.addData(confirmationUrl);
    qr.make();
    qrCodeContainer.innerHTML = qr.createImgTag(6, 15);
    
    qrCodeOverlay.classList.remove('hidden');
    ouvirConfirmacao(paymentId);
}

// Ouve por atualizações no Firestore
function ouvirConfirmacao(paymentId) {
    cancelarFluxoPix(); // Limpa qualquer ouvinte anterior

    const paymentDocRef = doc(db, "pending_payments", paymentId);
    
    confirmationListener = onSnapshot(paymentDocRef, async (docSnap) => {
        if (docSnap.exists() && docSnap.data().status === 'CONFIRMED') {
            console.log('Pagamento confirmado via Firestore!');
            cancelarFluxoPix();
            
            await salvarPagamentoNoBanco();
            qrCodeOverlay.classList.add('hidden');
            
            await deleteDoc(paymentDocRef);
        }
    });
}

// Cancela o fluxo PIX e para de ouvir o Firestore
function cancelarFluxoPix() {
    if (confirmationListener) {
        confirmationListener(); // Chama a função de unsubscribe
        confirmationListener = null;
    }
    qrCodeOverlay.classList.add('hidden');
}


// >>> ALTERAÇÃO IMPORTANTE <<<
// Função para salvar os dados no banco
async function salvarPagamentoNoBanco() {
    const id = modalIdPagamento.value;
    const servicoId = modalServicoSelect.value;
    const valor = parseFloat(modalValorPagamento.value);
    const formaPagamento = modalFormaPagamento.value;
    
    // Os dados agora são enviados como argumentos separados
    const promessa = id 
        ? window.GymAPI.alterarPagamento(id, servicoId, valor, formaPagamento) 
        : window.GymAPI.salvarPagamento(servicoId, valor, formaPagamento);
    
    try {
        await promessa;
        await carregarPagamentos();
        limparDados();
    } catch(error) {
        console.error("Erro ao salvar pagamento:", error);
        alert("Ocorreu um erro ao salvar o pagamento. Verifique o console para mais detalhes.");
    }
}


// (O resto do seu código JS permanece igual)
function mostrarDetalhes(id, id_servico, valor, forma_pagamento) {
    modalIdPagamento.value = id;
    modalServicoSelect.value = id_servico;
    const valorNumerico = parseFloat(String(valor).replace(/[^0-9,.-]+/g, "").replace(",", "."));
    modalValorPagamento.value = valorNumerico.toFixed(2);
    modalFormaPagamento.value = forma_pagamento;
}

function limparDados() {
    mostrarDetalhes('', '', '', 'Cartão de Crédito');
}

function atualizarValorServico() {
    const servicoSelecionado = modalServicoSelect.options[modalServicoSelect.selectedIndex];
    if (!servicoSelecionado.value) {
        modalValorPagamento.value = '';
        return;
    }
    const tipoServico = servicoSelecionado.dataset.tipo;
    const valorFixo = VALORES_SERVICOS[tipoServico];
    modalValorPagamento.value = valorFixo ? valorFixo.toFixed(2) : '0.00';
}

async function excluirPagamento() {
    const id = modalIdPagamento.value;
    if (!id) { alert("Selecione um pagamento para excluir."); return; }
    if (confirm(`Tem certeza que deseja excluir este pagamento?`)) {
        await window.GymAPI.deletarPagamento(id);
        carregarPagamentos();
        limparDados();
    }
}

async function carregarPagamentos() {
    const listaPagamentos = await window.GymAPI.buscarPagamentos();
    tabelaPagamento.innerHTML = "";
    if (!listaPagamentos || listaPagamentos.length === 0) {
        tabelaPagamento.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum pagamento registrado.</td></tr>';
        return;
    }
    listaPagamentos.forEach(criarLinhaPagamento);
    lucide.createIcons();
}

function criarLinhaPagamento(pagamento) {
    const linha = document.createElement("tr");
    const valorFormatado = parseFloat(String(pagamento.valor).replace(/[^0-9,.-]+/g, "").replace(",", ".")).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    linha.innerHTML = `
        <td>${pagamento.cliente_nome}</td>
        <td>${pagamento.servico}</td>
        <td>${valorFormatado}</td>
        <td>${pagamento.forma_pagamento}</td>
        <td><button class="btn-edit"><i data-lucide="edit"></i></button></td>
    `;
    linha.querySelector('.btn-edit').addEventListener('click', () => {
        mostrarDetalhes(pagamento.id, pagamento.id_servico, pagamento.valor, pagamento.forma_pagamento);
    });
    tabelaPagamento.appendChild(linha);
}

async function dropdownServicos() {
    const servicos = await window.GymAPI.buscarServicos();
    modalServicoSelect.innerHTML = "<option value=''>Selecione um serviço a pagar</option>";
    servicos.forEach(servico => {
        const option = document.createElement("option");
        option.value = servico.id;
        option.dataset.tipo = servico.servico;
        let dataFormatada = 'Data não definida';
        if (servico.data) {
            const dataObj = new Date(servico.data);
            if (!isNaN(dataObj.getTime())) { dataFormatada = dataObj.toLocaleDateString('pt-BR'); }
        }
        option.textContent = `${servico.servico} - ${servico.cliente} (${dataFormatada})`;
        modalServicoSelect.appendChild(option);
    });
}

function verificarPermissoes() {
    const validacaoPerfil = localStorage.getItem('perfil');
    if (validacaoPerfil === 'user') {
        botaoExcluir.disabled = true;
    }
}

async function init() {
    await carregarPagamentos();
    await dropdownServicos();
    verificarPermissoes();
    lucide.createIcons();
}

init();
