import setupProxy from './proxy';
const { ipcMain } = require('electron');

let server = null;

class Api {
  constructor(win) {
    this.win = win;

    this.init();
  }

  init() {
    ipcMain.on('startProxy', () => {
      this.startProxy();
    });
    ipcMain.on('stopProxy', () => {
      this.stopProxy();
    });
  }

  startProxy() {
    console.log(this.win, 'this is startProxy');
    server = setupProxy((req, res) => {
      console.log('tart send');
      this.win.webContents.send('update-request-list', { req, res });
    });
  }

  stopProxy() {
    console.log('this is stopProxy');
    if (server) {
      this.close();
    }
  }

  close() {
    server.close();
  }
}

export default Api;
