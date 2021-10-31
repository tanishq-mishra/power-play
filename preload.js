// const { ipcRenderer, contextBridge } = require('electron');

// contextBridge.exposeInMainWorld('electron', {
//     notificationApi: {
//         sendNotification(message) {
//             ipcRenderer.send('notify', message);
//         }
//     },
//     filesApi: {
//         getSelectedFile() {
//             return ipcRenderer.on('ping', (event, message) => {

//             })
//         }
//     }
// })