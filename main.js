const {
    app,
    BrowserWindow
} = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
let win

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 800,
        frame: false,
        webPreferences: {
            webSecurity: false
        },
    })
    win.loadFile('index.html');
    win.on('closed', () => {
        win = null;
        listerDown();
    })
}

function listerDown() {
    if (!win) {
        createWindow();
    }
    electronLocalshortcut.register(win, 'Down', () => {
        if (win) {
            win.close();
        }
    });
}

app.on('ready', () => {
    listerDown();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})