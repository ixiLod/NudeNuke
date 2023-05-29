import { app, session, BrowserWindow, globalShortcut } from 'electron';
import * as path from 'path';

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    width: 800,
    height: 600,
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

app.on('ready', () => {
  registerEscapeShortcut();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  session.defaultSession.clearCache().catch((err) => console.log(err));
});
