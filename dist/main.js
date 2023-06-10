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
exports.currentY = exports.currentX = exports.currentHeight = exports.currentWidth = exports.mainWindow = void 0;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const nsfwDetector_1 = require("./nsfwDetector");
const createWindow = () => {
    exports.mainWindow = new electron_1.BrowserWindow({
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
    exports.currentWidth = exports.mainWindow.getSize()[0];
    exports.currentHeight = exports.mainWindow.getSize()[1];
    exports.currentX = exports.mainWindow.getPosition()[0];
    exports.currentY = exports.mainWindow.getPosition()[1];
    exports.mainWindow.on('resize', () => {
        let size = exports.mainWindow.getSize();
        exports.currentWidth = size[0];
        exports.currentHeight = size[1];
        exports.mainWindow.webContents.send('animation-tutorial');
    });
    exports.mainWindow.on('move', () => {
        let position = exports.mainWindow.getPosition();
        exports.currentX = position[0];
        exports.currentY = position[1];
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
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
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
    electron_1.session.defaultSession.clearCache().then(() => {
        return electron_1.session.defaultSession.clearStorageData();
    }).catch((err) => console.log(err));
});
//# sourceMappingURL=main.js.map