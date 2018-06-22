const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const Config = require('electron-store')
const config = new Config()

let win

function createWindow () {
    let options = {
        width: 630,
        height: 550,
        minWidth: 365,
        minHeight: 90,
        frame: false,
        icon: './assets/Nevis Logo.png',
        show: false,
    }
    Object.assign(options, config.get('winBounds'))
    win = new BrowserWindow(options)
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/views/index.html'),
        protocol: 'file:',
        slashes: true,
    }))
    win.on('ready-to-show', () => {
        win.show()
        win.webContents.send('resize', win.getSize())
        win.focus()
    })
    win.on('close', () => {
        config.set('winBounds', win.getBounds())
    })
    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

// Context Menu
const contextMenu = [{
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy',
},
{
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut',
},
{
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste',
}]
const ContextMenu = Menu.buildFromTemplate(contextMenu)
app.on('browser-window-created', function (event, win) {
    win.webContents.on('context-menu', function (e, params) {
        ContextMenu.popup(win, params.x, params.y)
    })
})

// Menu Titlebar Icon
let maximized = false
ipcMain.on('window', function (event, arg) {
    if (arg === 'maximize') {
        if (maximized === false) {
            win.maximize()
            maximized = true
            event.sender.send('window', 'maximized')
        }
        else {
            win.unmaximize()
            maximized = false
            event.sender.send('window', 'minimized')
        }
    }
    else if (arg === 'minimize') {
        win.minimize()
    }
})

// Toggle Dev Tools
ipcMain.on('toggle-dev-tools', function (event, arg) {
    win.webContents.toggleDevTools()
})
