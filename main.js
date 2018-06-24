const { app, BrowserWindow } = require("electron");
const electronLocalshortcut = require("electron-localshortcut");
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 750,
    webPreferences: {
      webSecurity: false
    }
  });
  electronLocalshortcut.register(win, "Down", () => {
    win.loadFile("index.html");
  });
  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", () => {
  createWindow();
  win.loadFile("index.html");
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
  win.loadFile("index.html");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
