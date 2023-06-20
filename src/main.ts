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
    icon: path.join(__dirname, '../static/icons/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.on('resize', () => {
    calcDimensions(screen);
    mainWindow.webContents.send('animation-tutorial');
  });

  mainWindow.on('move', () => {
    calcDimensions(screen);
    isOutScreen();
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
  const winBounds = mainWindow.getBounds();
  const currentScreen = screen.getDisplayNearestPoint({ x: winBounds.x, y: winBounds.y });

  const scaleFactor = currentScreen.scaleFactor;

  screenWidth = currentScreen.bounds.width * scaleFactor;
  screenHeight = currentScreen.bounds.height * scaleFactor;

  windowX = winBounds.x * scaleFactor;
  windowY = winBounds.y * scaleFactor;
  windowWidth = winBounds.width * scaleFactor;
  windowHeight = winBounds.height * scaleFactor;

  // Window dimensions in screen bounds
  viewX = Math.max(0, windowX + 25);
  viewY = Math.max(0, windowY + 25);
  viewWidth = Math.max(0, Math.min(windowX + windowWidth - 25, screenWidth) - viewX);
  viewHeight = Math.max(0, Math.min(windowY + windowHeight - 25, screenHeight) - viewY);
};

const isOutScreen = () => {
  const outScreen =
    windowX < 0 ||
    windowX + windowWidth > screenWidth ||
    windowY < 0 ||
    windowY + windowHeight > screenHeight;
  if (outScreen) {
    mainWindow.webContents.send('out-screen');
  } else {
    mainWindow.webContents.send('in-screen');
  }
};

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
  session.defaultSession
    .clearCache()
    .then(() => {
      return session.defaultSession.clearStorageData();
    })
    .catch((err) => console.log(err));
});
