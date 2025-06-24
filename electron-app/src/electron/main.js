import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { net } from 'electron';
import * as nnet from 'net';
import http from 'http';
// load .env file
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';

let PORT = 3005; // Port for instance management
const WEB_PORT = 5000; // Port for web server


// // Register custom protocol
// function registerProtocol() {
//   if (!app.isDefaultProtocolClient('ai-electron')) {
//     app.setAsDefaultProtocolClient('ai-electron');
//   }
// }

let clientApp = {
  clientId: dotenv.config().parsed.CLIENT_ID || 'default-client-id',
  clientSecret: dotenv.config().parsed.CLIENT_SECRET || 'default-client-secret',
  redirectUri: dotenv.config().parsed.REDIRECT_URI || `http://localhost:${WEB_PORT}/redirectUrl`,
}

console.log('Client App Config:', clientApp);

// Create simple web server to handle redirects
let latestAccessCode = null; // Store latest code for renderer pickup
let authWindow = null;
// const server = http.createServer((req, res) => {
//   if (req.url.startsWith('/redirectUrl')) {
//     // Parse query parameters (e.g., ?code=...&state=...)
//     const urlObj = new URL(req.url, `http://localhost:${WEB_PORT}`);
//     const accessCode = urlObj.searchParams.get('code');
//     const state = urlObj.searchParams.get('state');

//     // Store the code for renderer process
//     latestAccessCode = accessCode;

//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Access code received...</title>
//       </head>
//       <body>
//         <h3>Redirecting to application for exchanging token...</h3>
//       </body>
//       </html>
//     `);
//     // Notify renderer process if window exists
//     if (mainWindow && mainWindow.webContents) {
//       mainWindow.webContents.send('oauth-access-code', accessCode);
//       setTimeout(() => {
//         authWindow.close();
//       }, 500);
//     }
//     return;
//   }

//   // Default handler
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.end(`
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Redirecting...</title>
//     </head>
//     <body>
//       <h3>Redirecting to application...</h3>
//     </body>
//     </html>
//   `);
// });

// Instance management server

// const instanceServer = nnet.createServer();
// instanceServer.on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     // Another instance is running, connect to it
//     const client = new nnet.Socket();
    
//     client.connect(PORT, 'localhost', () => {
//       client.write('FOCUS');
//       // Don't quit immediately to allow protocol handling
//       setTimeout(() => app.quit(), 1000);
//     });
//   }
// });

// instanceServer.listen(PORT, () => {
//   console.log(`Instance management server listening on port ${PORT}`);
// });

// instanceServer.on('connection', (socket) => {
//   socket.on('data', (data) => {
//     if (data.toString() === 'FOCUS') {
//       if (mainWindow) {
//         if (mainWindow.isMinimized()) {
//           mainWindow.restore();
//         }
//         mainWindow.focus();
//       }
//     }
//   });
// });

// Start web server
// server.listen(WEB_PORT, () => {
//   console.log(`Web server running on http://localhost:${WEB_PORT}`);
// });

if (isDev) {
  import('electron-reload').then(module => {
    const electronReload = module.default;
    electronReload(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit'
    });
  });
}

function waitForDevServer(url, retries = 30) {
  return new Promise((resolve, reject) => {
    const tryConnection = (currentRetry) => {
      const request = net.request(url);
      
      request.on('response', (response) => {
        resolve();
      });

      request.on('error', (error) => {
        if (currentRetry === 0) {
          reject(new Error('Dev server not ready'));
          return;
        }
        setTimeout(() => tryConnection(currentRetry - 1), 1000);
      });

      request.end();
    };

    tryConnection(retries);
  });
}

let mainWindow = null;

async function createWindow() {
  if (isDev) {
    try {
     // await waitForDevServer('http://localhost:3000');
    } catch (error) {
      console.error('Development server not available:', error);
      app.quit();
      return;
    }
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  try {
    if (isDev) {
      //await mainWindow.loadURL('http://localhost:3000');
      await mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
      mainWindow.webContents.openDevTools();
      console.log('Development mode: Loading from localhost:3000');
    } else {
      await mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
      console.log('Production mode: Loading from local file');
    }
  } catch (error) {
    console.error('Failed to load application:', error);
  }
}

const getLibraryPath = () => {
  if (app.isPackaged) {
    // In production, use the resources path
    return path.join(process.resourcesPath, 'resources', 'libb64.so');
  } else {
    // In development
    return path.join(__dirname, '..', '..', 'resources', 'libb64.so');
  }
};


// Handle custom protocol
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
    registerProtocol();
  });
}


// Make it available to renderer process through IPC
ipcMain.handle('libb64', () => {
  return getLibraryPath();
});

// Add IPC handler for renderer to get latest access code
ipcMain.handle('get-latest-access-code', () => {
  return latestAccessCode;
});

ipcMain.handle('get-client-app-config', () => {
  return clientApp;
});


ipcMain.handle('open-oauth-window', (event, authUrl) => {
  authWindow = new BrowserWindow({
    width: 600,
    height: 800,
    parent: mainWindow,
    modal: true,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  authWindow.openDevTools();
  authWindow.loadURL(authUrl);

  authWindow.webContents.on('will-redirect', (event, newUrl) => {
    console.log('Redirecting to:', newUrl);
    if (newUrl.includes('redirectUrl')) {
      // Parse query parameters (e.g., ?code=...&state=...)
      // const urlObj = new URL(req.url, `http://localhost:${WEB_PORT}`);
      const newUrlObj = new URL(newUrl);
      const accessCode = newUrlObj.searchParams.get('code');
      const state = newUrlObj.searchParams.get('state');
      console.log('Access code received:', accessCode);
      debugger;
      // Store the code for renderer process
      latestAccessCode = accessCode;
      // Notify renderer process if window exists
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('oauth-access-code', accessCode);
        setTimeout(() => {
          authWindow.close();
        }, 500);
      }
    }
  });
  // Optional: handle window close, etc.
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
