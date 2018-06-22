const { app, BrowserWindow } = require("electron");
const electronLocalshortcut = require("electron-localshortcut");
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 820,
    webPreferences: {
      webSecurity: false
    }
  });
  win.loadFile("index.html");
}

function listerDown() {
  createWindow();
  electronLocalshortcut.register(win, "Down", () => {
    if (win) {
      win.close();
    }
    listerDown();
  });
}

app.on("ready", () => {
  listerDown();
});

app.on("activate", () => {
  listerDown();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
