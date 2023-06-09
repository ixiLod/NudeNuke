import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel: string, func: (event: IpcRendererEvent, ...args: any[]) => void) =>
      ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) => func(event, ...args)),
    send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  },
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  const dependencies: Record<string, string> = {
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
