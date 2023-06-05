import { app, session, BrowserWindow, globalShortcut } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    alwaysOnTop: false,
    width: 900,
    height: 700,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../static/index.html'));
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const registerEscapeShortcut = () => {
  globalShortcut.register('Escape', () => {
    app.quit();
  });
};

const registerLockWindowShortcut = () => {
  globalShortcut.register('x', () => {
    if (mainWindow) {
      const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
      mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    }
  });
};

app.on('ready', () => {
  registerEscapeShortcut();
  registerLockWindowShortcut();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  session.defaultSession.clearCache().catch((err) => console.log(err));
});
