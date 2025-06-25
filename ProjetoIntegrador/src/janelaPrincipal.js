// Assumindo que este código está no seu arquivo principal (ex: main.js ou index.js)
// onde o app Electron é iniciado.

const { BrowserWindow, ipcMain } = require('electron'); // ALTERADO: Adicionado ipcMain
const path = require('path');

let janelaPrincipal;
let janelaLogin;
function createMainWindow() {
  janelaPrincipal = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // O preload já está configurado corretamente, ótimo!
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // O loadFile já está correto, ótimo!
  janelaPrincipal.loadFile(path.join(__dirname,  'index.html'));

  janelaPrincipal.on('closed', () => {
    janelaPrincipal = null;
  });

  return janelaPrincipal;
}
function createMainWindowUser() {
  janelaPrincipal = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // O preload já está configurado corretamente, ótimo!
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // O loadFile já está correto, ótimo!
  janelaPrincipal.loadFile(path.join(__dirname,  'indexUser.html'));

  janelaPrincipal.on('closed', () => {
    janelaPrincipal = null;
  });

  return janelaPrincipal;
}

function closeLoginWindow() {
    if (janelaLogin) {
        janelaLogin.close();
        janelaLogin = null;
    }
}


function getJanelaPrincipal() {
  return janelaPrincipal;
}

function createLoginWindow() {
   janelaLogin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
    },
  });

  
  const caminhoDoArquivo = path.join(__dirname, 'login', 'login.html');

 

  janelaLogin.loadFile(caminhoDoArquivo);
 
}
function getJanelaLogin(){
  return janelaLogin
}

module.exports = {
  closeLoginWindow,
  getJanelaPrincipal,
  getJanelaLogin,
  createMainWindow,
  createLoginWindow,
  createMainWindowUser,
};