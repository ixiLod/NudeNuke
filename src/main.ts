import { app, session, BrowserWindow, globalShortcut, Screen } from 'electron';
import * as path from 'path';
import { startDetection } from './nsfwDetector';

export let mainWindow: BrowserWindow;

export let screenWidth: number;
export let screenHeight: number;

export let windowX: number;
export let windowY: number;
export let windowWidth: number;
export let windowHeight: number;

export let viewX: number;
export let viewY: number;
export let viewWidth: number;
export let viewHeight: number;

const createWindow = (): void => {
  const { screen } = require('electron');

  mainWindow = new BrowserWindow({
    alwaysOnTop: false,
    width: 900,
    height: 700,
    transparent: true,
    frame: false,
    icon: path.join(__dirname, '../static/icons/icon.icns'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.on('resize', () => {
    calcDimensions(screen);
  });

  mainWindow.on('move', () => {
    calcDimensions(screen);
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
  calcDimensions(screen);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const calcDimensions = (screen: Screen) => {

  let screenBounds = screen.getPrimaryDisplay().bounds;
  screenWidth = screenBounds.width;
  screenHeight = screenBounds.height;

  let winPos = mainWindow.getPosition();
  windowX = winPos[0] + 25;
  windowY = winPos[1] + 25;

  let winSize = mainWindow.getSize();
  windowWidth = winSize[0] - 25;
  windowHeight = winSize[1] - 25;
  mainWindow.webContents.send('animation-tutorial');

  // Window dimensions in screen bounds
  viewX = Math.max(0, windowX);
  viewY = Math.max(0, windowY);
  viewWidth = Math.min( windowX + windowWidth, screenWidth ) - viewX;
  viewHeight = Math.min( windowY + windowHeight, screenHeight ) - viewY;
}

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
