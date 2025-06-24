const { app, BrowserWindow } = require('electron');
const path = require('path');
const {createLoginWindow} = require('./src/janelaPrincipal');

const {createMainWindow} = require('./src/janelaPrincipal');
const{registrarListeners} = require('./src/APPListeners');



app.whenReady().then(function () {
 
  //createMainWindow();
  createLoginWindow();
  registrarListeners();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

}
);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});