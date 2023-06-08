const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
        send: (channel, data) => ipcRenderer.send(channel, data),
    },
});
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element)
            element.innerText = text;
    };
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});
//# sourceMappingURL=preload.js.map