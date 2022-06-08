const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    isValidFile: (path) => ipcRenderer.invoke("is-valid-file", path),
    openFile: (callback) => ipcRenderer.on("open-file", (callback))
})