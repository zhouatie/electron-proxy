import store from '@/store';
const electron = require('electron');
const { ipcRenderer } = require('electron');

export const setupElectron = {
  install: (Vue) => {
    Object.defineProperties(Vue.prototype, {
      $electron: {
        get() {
          return electron;
        }
      }
    });
  }
};

class IpcRenderer {
  constructor() {
    this.init();
  }

  init() {
    ipcRenderer.on('update-request-list', (event, data) => {
      store.commit('addRequest', data);
      console.log(data, 'ipcRender');
    });
  }

  send(method) {
    console.log(method, 'method');
    ipcRenderer.send(method, 'lallal');
  }
}

export const setupIpcRenderer = {
  install: (Vue) => {
    Object.defineProperties(Vue.prototype, {
      $ipcRenderer: {
        get() {
          return new IpcRenderer();
        }
      }
    });
  }
};
