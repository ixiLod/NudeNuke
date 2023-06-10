import { app, session, BrowserWindow, globalShortcut } from 'electron';
import * as path from 'path';
import { startDetection } from './nsfwDetector';

export let mainWindow: BrowserWindow;
export let currentWidth: number;
export let currentHeight: number;
export let currentX: number;
export let currentY: number;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    alwaysOnTop: false,
    width: 900,
    height: 700,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  currentWidth = mainWindow.getSize()[0];
  currentHeight = mainWindow.getSize()[1];
  currentX = mainWindow.getPosition()[0];
  currentY = mainWindow.getPosition()[1];

  mainWindow.on('resize', () => {
    let size = mainWindow.getSize();
    currentWidth = size[0];
    currentHeight = size[1];
    mainWindow.webContents.send('animation-tutorial');
  });

  mainWindow.on('move', () => {
    let position = mainWindow.getPosition();
    currentX = position[0];
    currentY = position[1];
  });

  mainWindow.on('blur', () => {
    globalShortcut.unregisterAll();
  });

  mainWindow.on('focus', () => {
    registerEscapeShortcut();
    registerLockWindowShortcut();
  });

  startDetection(mainWindow);
  mainWindow.loadFile(path.join(__dirname, '../static/index.html'));
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const registerLockWindowShortcut = () => {
  globalShortcut.register('x', () => {
    if (mainWindow) {
      const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
      mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    }
  });
};

const registerEscapeShortcut = () => {
  globalShortcut.register('Escape', () => {
    app.quit();
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  globalShortcut.unregisterAll();
  session.defaultSession.clearCache().then(() => {
    return session.defaultSession.clearStorageData();
  }).catch((err) => console.log(err));
});
