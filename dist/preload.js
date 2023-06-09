"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        on: (channel, func) => electron_1.ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
        send: (channel, data) => electron_1.ipcRenderer.send(channel, data),
    },
});
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };
    const dependencies = {
        chrome: process.versions.chrome,
        node: process.versions.node,
        electron: process.versions.electron,
    };
    for (const dependency in dependencies) {
        if (Object.prototype.hasOwnProperty.call(dependencies, dependency)) {
            const version = dependencies[dependency];
            replaceText(`${dependency}-version`, version);
        }
    }
});
//# sourceMappingURL=preload.js.map