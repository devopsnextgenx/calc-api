import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { net } from 'electron';
import * as nnet from 'net';
import http from 'http';
// import express from 'express';
// load .env file
import dotenv from 'dotenv';
dotenv.config();
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';

let PORT = 3000; // Port for instance management
const WEB_PORT = 5000; // Port for web server


// Register custom protocol
function registerProtocol() {
  if (!app.isDefaultProtocolClient('ai-electron')) {
    app.setAsDefaultProtocolClient('ai-electron');
  }
}

let clientApp = {
  clientId: dotenv.config().parsed.CLIENT_ID || 'default-client-id',
  clientSecret: dotenv.config().parsed.CLIENT_SECRET || 'default-client-secret',
  redirectUri: dotenv.config().parsed.REDIRECT_URI || `http://localhost:${WEB_PORT}/redirectUrl`,
}

console.log('Client App Config:', clientApp);

// Create simple web server to handle redirects
let latestAccessCode = null; // Store latest code for renderer pickup
let authWindow = null;

if (isDev) {
  import('electron-reload').then(module => {
    const electronReload = module.default;
    electronReload(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit'
    });
  });

  // Add IPC handler for renderer reload
  ipcMain.handle('reload-window', () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });
}

function waitForDevServer(url, retries = 30) {
  return new Promise((resolve, reject) => {
    const tryConnection = (currentRetry) => {
      if (currentRetry === 0) {
        reject(new Error('Dev server not ready after maximum retries'));
        return;
      }

      const request = net.request(url);
      
      request.on('response', () => {
        console.log('Dev server is ready!');
        resolve();
      });

      request.on('error', () => {
        console.log(`Waiting for dev server... (${currentRetry} retries left)`);
        setTimeout(() => tryConnection(currentRetry - 1), 1000);
      });

      request.end();
    };

    tryConnection(retries);
  });
}

let mainWindow = null;
const require = createRequire(import.meta.url);
const addon = require(path.join(__dirname, '..','..', 'resources', 'calc-napi.node'));
const CalcNapi = addon.CalcNapi;
const test = async () => {
    const calc = new CalcNapi('trzxs9');
    console.log("CalcNapi version: ", calc.getVersion());
    console.log("CalcNapi.add(4, 2): ", calc.add(4, 2));
    console.log("CalcNapi.substract(5, 3): ", calc.sub(5, 3));
    console.log("CalcNapi.multiply(4, 6): ", calc.mul(4, 6));
    console.log("CalcNapi.multiply(2, 9): ", calc.mul(2, 9));
    console.log("CalcNapi.multiply(3, 4): ", calc.mul(3, 4));
    console.log("CalcNapi.divide(8, 2): ", calc.divx(8, 2));
    console.log("CalcNapi.square(3): ", calc.sqr(3));
    console.log("CalcNapi.square(5): ", calc.sqr(5));
    console.log("CalcNapi usage: ", calc.getUsage());
}

test();

async function createWindow() {
  if (isDev) {
    try {
     await waitForDevServer(`http://localhost:${PORT}`);
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
      await mainWindow.loadURL(`http://localhost:${PORT}`);
      mainWindow.webContents.openDevTools();
      console.log('Development mode: Loading from localhost:3000');
      
      // Set up auto-reload on renderer process crash/unresponsive
      mainWindow.webContents.on('unresponsive', () => {
        console.log('Renderer became unresponsive, reloading...');
        mainWindow.reload();
      });
      
      mainWindow.webContents.on('crashed', () => {
        console.log('Renderer crashed, reloading...');
        mainWindow.reload();
      });
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
    return path.join(process.resourcesPath, 'resources', 'calc-napi.node');
  } else {
    // In development
    return path.join(__dirname, '..', '..', 'resources', 'calc-napi.node');
  }
};

// Global calc instance to maintain state
let globalCalcInstance = null;

// Make it available to renderer process through IPC
ipcMain.handle('calc-napi', () => {
  return getLibraryPath();
});

// Calc-napi IPC handlers
ipcMain.handle('calc-create-instance', (event, license) => {
  try {
    globalCalcInstance = new CalcNapi(license || 'trzxs9');
    return { success: true, version: globalCalcInstance.getVersion() };
  } catch (error) {
    console.error('Failed to create calc instance:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('calc-add', (event, a, b) => {
  try {
    if (!globalCalcInstance) {
      globalCalcInstance = new CalcNapi('trzxs9');
    }
    return globalCalcInstance.add(a, b);
  } catch (error) {
    console.error('Calc add error:', error);
    throw error;
  }
});

ipcMain.handle('calc-sub', (event, a, b) => {
  try {
    if (!globalCalcInstance) {
      globalCalcInstance = new CalcNapi('trzxs9');
    }
    return globalCalcInstance.sub(a, b);
  } catch (error) {
    console.error('Calc sub error:', error);
    throw error;
  }
});

ipcMain.handle('calc-mul', (event, a, b) => {
  try {
    if (!globalCalcInstance) {
      globalCalcInstance = new CalcNapi('trzxs9');
    }
    return globalCalcInstance.mul(a, b);
  } catch (error) {
    console.error('Calc mul error:', error);
    throw error;
  }
});

ipcMain.handle('calc-divx', (event, a, b) => {
  try {
    if (!globalCalcInstance) {
      globalCalcInstance = new CalcNapi('trzxs9');
    }
    return globalCalcInstance.divx(a, b);
  } catch (error) {
    console.error('Calc divx error:', error);
    throw error;
  }
});

ipcMain.handle('calc-sqr', (event, a) => {
  try {
    if (!globalCalcInstance) {
      globalCalcInstance = new CalcNapi('trzxs9');
    }
    return globalCalcInstance.sqr(a);
  } catch (error) {
    console.error('Calc sqr error:', error);
    throw error;
  }
});

ipcMain.handle('calc-get-version', () => {
  try {
    if (!globalCalcInstance) {
      globalCalcInstance = new CalcNapi('trzxs9');
    }
    return globalCalcInstance.getVersion();
  } catch (error) {
    console.error('Calc getVersion error:', error);
    throw error;
  }
});

ipcMain.handle('calc-get-usage', () => {
  try {
    if (!globalCalcInstance) {
      globalCalcInstance = new CalcNapi('trzxs9');
    }
    return globalCalcInstance.getUsage();
  } catch (error) {
    console.error('Calc getUsage error:', error);
    throw error;
  }
});


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

  app.whenReady().then(async () => {
    createWindow();
    registerProtocol();
  });
}

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

let serverStarted = false;

async function startExpressServer() {
  if (serverStarted) return;
  const appServer = express();
  const staticPath = path.join(__dirname, '..', '..', 'dist');
  appServer.use(express.static(staticPath));
  appServer.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
  appServer.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
    serverStarted = true;
  });
}
