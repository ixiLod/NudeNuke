"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewHeight = exports.viewWidth = exports.viewY = exports.viewX = exports.windowHeight = exports.windowWidth = exports.windowY = exports.windowX = exports.screenHeight = exports.screenWidth = exports.mainWindow = void 0;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const nsfwDetector_1 = require("./nsfwDetector");
const createWindow = () => {
    const { screen } = require('electron');
    exports.mainWindow = new electron_1.BrowserWindow({
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
    exports.mainWindow.on('resize', () => {
        calcDimensions(screen);
        exports.mainWindow.webContents.send('animation-tutorial');
    });
    exports.mainWindow.on('move', () => {
        calcDimensions(screen);
        isOutScreen();
    });
    exports.mainWindow.on('blur', () => {
        electron_1.globalShortcut.unregisterAll();
    });
    exports.mainWindow.on('focus', () => {
        registerEscapeShortcut();
        registerLockWindowShortcut();
    });
    (0, nsfwDetector_1.startDetection)(exports.mainWindow);
    exports.mainWindow.loadFile(path.join(__dirname, '../static/index.html'));
    calcDimensions(screen);
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
const calcDimensions = (screen) => {
    let screenBounds = screen.getPrimaryDisplay().bounds;
    exports.screenWidth = screenBounds.width;
    exports.screenHeight = screenBounds.height;
    let winPos = exports.mainWindow.getPosition();
    exports.windowX = winPos[0] + 25;
    exports.windowY = winPos[1] + 25;
    let winSize = exports.mainWindow.getSize();
    exports.windowWidth = winSize[0] - 25;
    exports.windowHeight = winSize[1] - 25;
    // Window dimensions in screen bounds
    exports.viewX = Math.max(0, exports.windowX);
    exports.viewY = Math.max(0, exports.windowY);
    exports.viewWidth = Math.min(exports.windowX + exports.windowWidth, exports.screenWidth) - exports.viewX;
    exports.viewHeight = Math.min(exports.windowY + exports.windowHeight, exports.screenHeight) - exports.viewY;
};
const isOutScreen = () => {
    const outScreen = exports.windowX <= 0 || exports.windowX >= exports.screenWidth || exports.windowY <= 0 || exports.windowY >= exports.screenHeight;
    if (outScreen) {
        exports.mainWindow.webContents.send('out-screen');
    }
    else {
        exports.mainWindow.webContents.send('in-screen');
    }
};
const registerLockWindowShortcut = () => {
    electron_1.globalShortcut.register('x', () => {
        if (exports.mainWindow) {
            const isAlwaysOnTop = exports.mainWindow.isAlwaysOnTop();
            exports.mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
        }
    });
};
const registerEscapeShortcut = () => {
    electron_1.globalShortcut.register('Escape', () => {
        electron_1.app.quit();
    });
};
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('before-quit', () => {
    electron_1.globalShortcut.unregisterAll();
    electron_1.session.defaultSession
        .clearCache()
        .then(() => {
        return electron_1.session.defaultSession.clearStorageData();
    })
        .catch((err) => console.log(err));
});
//# sourceMappingURL=main.js.map