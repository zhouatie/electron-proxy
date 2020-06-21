import setupProxy from './proxy/setup.js';
const Recorder = require('./proxy/recorder.js');
const { ipcMain } = require('electron');

let server = null;

class Api {
  constructor(win) {
    this.win = win;
    this.recorder = new Recorder((info) => {
      this.win.webContents.send('update-request-list', info);
    });
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
    server = server || setupProxy(this.recorder);
  }

  stopProxy() {
    console.log('this is stopProxy');
    if (server) {
      this.close();
    }
  }

  close() {
    server.close();
    server = null;
  }
}

export default Api;
