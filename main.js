const { BrowserWindow, app, ipcMain, Notification, dialog, Menu, webContents } = require('electron');
const path = require('path');
const { lstatSync } = require("fs");

const isMac = process.platform === 'darwin'
const isDev = !app.isPackaged;
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "black",
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname + "/preload.js"),
            nodeIntegration: false,
            worldSafeExecuteJavaScript: false,
            contextIsolation: true,
        }
    })

    let menu = Menu.buildFromTemplate([
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' },
                {
                    label: "Open",
                    accelerator: "CmdOrCtrl+O",
                    click() {
                        dialog.showOpenDialog({
                            properties: ['openFile'],
                            filters: [{ name: 'Movies', extensions: ['mkv', 'mp4', 'webm', 'mov'] }]
                        }).then(file => {
                            if (!file) return
                            else {
                                win.webContents.send('open-file', file)
                            }
                        })

                    }
                },
                {
                    label: "Toggle Full Screen",
                    click: () => {
                        if (win.isFullScreen()) {
                            win.setFullScreen(false)
                            // win.setAutoHideMenuBar(false)

                        } else {
                            // win.setAutoHideMenuBar(true)
                            win.setFullScreen(true)
                        }
                    }
                }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)
    win.loadFile('index.html');

}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
}

ipcMain.on('notify', (_, message) => {
    new Notification({ title: 'Notifiation', body: message }).show();
})

app.whenReady().then(createWindow)


ipcMain.handle("is-valid-file", async (_, path) => {
    return lstatSync(path).isFile();
})