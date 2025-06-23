const { contextBridge, ipcRenderer } = require('electron');


// const LIBRARY_API = {
//   invoke: (channel, ...args) => {
//     const validChannels = ['libb64'];
//     if (validChannels.includes(channel)) {
//       return ipcRenderer.invoke(channel, ...args);
//     }
//     return Promise.reject(new Error('Invalid channel'));
//   }
// }

// contextBridge.exposeInMainWorld('napi', )

// const ffiNapi = {
//     Library: (libPath, funcs) => {
//         // Mock implementation for demonstration purposes
//         return {
//             libPath,
//             funcs,
//             call: (funcName, ...args) => {
//                 if (funcs[funcName]) {
//                     return funcs[funcName](...args);
//                 }
//                 throw new Error(`Function ${funcName} not found in library ${libPath}`);
//             }
//         };
//     }
// }

contextBridge.exposeInMainWorld('electron', {
  // ipcRenderer: {
  //   invoke: (channel, ...args) => {
  //     const validChannels = ['libb64'];
  //     if (validChannels.includes(channel)) {
  //       return ipcRenderer.invoke(channel, ...args);
  //     }
  //     return Promise.reject(new Error('Invalid channel'));
  //   }
  // },
  openOAuthWindow: (authUrl) => ipcRenderer.invoke('open-oauth-window', authUrl),
  onOAuthAccessCode: (callback) => ipcRenderer.on('oauth-access-code', callback),
  removeOAuthAccessCode: (callback) => ipcRenderer.removeListener('oauth-access-code', callback),
  getLatestAccessCode: () => ipcRenderer.invoke('get-latest-access-code')
});

// contextBridge.exposeInMainWorld('ffi', {
//     Library: (libPath, funcs) => {
//         return ffiNapi.Library(libPath, funcs);
//     }
// });
