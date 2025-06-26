const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  pathLoader: {
    invoke: (channel, ...args) => {
      const validChannels = ['calc-napi'];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
      return Promise.reject(new Error('Invalid channel'));
    }
  },
  // Calc API methods
  calcNapi: {
    createInstance: (license) => ipcRenderer.invoke('calc-create-instance', license),
    add: (a, b) => ipcRenderer.invoke('calc-add', a, b),
    sub: (a, b) => ipcRenderer.invoke('calc-sub', a, b),
    mul: (a, b) => ipcRenderer.invoke('calc-mul', a, b),
    divx: (a, b) => ipcRenderer.invoke('calc-divx', a, b),
    sqr: (a) => ipcRenderer.invoke('calc-sqr', a),
    getVersion: () => ipcRenderer.invoke('calc-get-version'),
    getUsage: () => ipcRenderer.invoke('calc-get-usage')
  },
  openOAuthWindow: (authUrl) => ipcRenderer.invoke('open-oauth-window', authUrl),
  onOAuthAccessCode: (callback) => ipcRenderer.on('oauth-access-code', callback),
  removeOAuthAccessCode: (callback) => ipcRenderer.removeListener('oauth-access-code', callback),
  getLatestAccessCode: () => ipcRenderer.invoke('get-latest-access-code'),
  getClientAppConfig: () => ipcRenderer.invoke('get-client-app-config'),
  // Development helpers
  reloadWindow: () => ipcRenderer.invoke('reload-window')
});
