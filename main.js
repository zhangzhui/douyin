const { app, BrowserWindow } = require("electron");
const electronLocalshortcut = require("electron-localshortcut");
let wins = new Array();
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 750,
    webPreferences: {
      webSecurity: false
    }
  });
  wins.push(win);
  win.loadFile("index.html");
}

function listerDown() {
  createWindow();
  electronLocalshortcut.register(win, "Down", () => {
    listerDown();
    if (wins.length > 1){
      wins.shift().close();
    }
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
