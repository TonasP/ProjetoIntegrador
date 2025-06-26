
const loginInput = document.getElementById('login');
const senhaInput = document.getElementById('senha');
const btnAcessar = document.getElementById('acessar');
const msg = document.getElementById('msg');
const loginContainer = document.querySelector('.login-container');


btnAcessar.addEventListener("click", validarLogin);
senhaInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        validarLogin()

    }
})

async function validarLogin() {
    msg.textContent = '';
    msg.className = 'status-message';
    loginContainer.classList.remove('shake-error');

    try {

        const retorno = await window.GymAPI.validarLogin(loginInput.value, senhaInput.value);

        if (retorno) {

            msg.textContent = "Acesso concedido!";
            msg.classList.add('success');
         
            await validarUsuario()
           
            window.janelaGymAPI.fecharLogin()


        } else {
            msg.textContent = "Usuário ou senha inválidos.";
            msg.classList.add('error');
            loginContainer.classList.add('shake-error');
            btnAcessar.disabled = false;
            btnAcessar.textContent = 'Acessar Plataforma';
        }
    } catch (error) {

        console.error("Erro ao tentar validar login:", error);
        msg.textContent = "Erro de comunicação. Tente novamente.";
        msg.classList.add('error');
        loginContainer.classList.add('shake-error');

        btnAcessar.disabled = false;
        btnAcessar.textContent = 'Acessar Plataforma';
    }
}
async function validarUsuario() {
    const validar = await window.GymAPI.validarPerfil(loginInput.value, senhaInput.value)
    console.log(validar[0].perfil)
    if (validar[0].perfil == 'adm') {
        localStorage.setItem('perfil', validar[0].perfil)
        localStorage.setItem('nome', validar[0].nome_cliente)
        window.janelaGymAPI.abrirMenuPrincipal();
        return
    } else {
        localStorage.setItem('perfil', validar[0].perfil)
        window.janelaGymAPI.abrirMenuUser()
        return

    }
}