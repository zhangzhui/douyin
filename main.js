const {
  app,
  BrowserWindow
} = require("electron");
const ipc = require('electron').ipcMain
const electronLocalshortcut = require("electron-localshortcut");
const axios = require('axios');
var userData = app.getPath('userData');
let Datastore = require('nedb'),
  db = new Datastore({
    filename: userData + '/love.db',
    autoload: true
  });
let win, pageUrl;


function getPageUrl() {
  axios.get('https://dy.lujianqiang.com', {
      timeout: 4000
    })
    .then(function (response) {
      if (response.data.code === 0) {
        win.webContents.send('refresh', {
          url: response.data.url,
          comments: response.data.comments
        });
        isLoved(response.data.url);
      } else {
        win.webContents.send('error', response.data.message);
      }
    })
    .catch(function (error) {
      win.webContents.send('error', '请求失败，请检查网络环境以及与服务器连接是否正常');
    });
}

function checkUpdate() {
  axios.get('https://dy.lujianqiang.com/version', {
      timeout: 4000
    })
    .then(function (response) {
      var package = require("./package.json");
      if (package.version < response.data.currentVersion) {
        if (package.version < response.data.supportedVersion) {
          win.loadFile("update.html");
        } else {
          win.webContents.send('version', null);
        }
      }
    });
}

function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 750,
    webPreferences: {
      webSecurity: false
    }
  });
  electronLocalshortcut.register(win, "Down", () => {
    getPageUrl();
  });
  win.on("closed", () => {
    win = null;
  });
}


function isLoved(url) {
  db.find({
    url
  }, function (err, docs) {
    if (docs.length > 0) {
      win.webContents.send('isLoved', true);
    } else {
      win.webContents.send('isLoved', false);
    }
  });
}


app.on("ready", () => {
  createWindow();
  win.loadFile("recommend.html");
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
    win.loadFile("recommend.html");
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipc.on('checkUpdate', function (event, message) {
  checkUpdate();
});

ipc.on('refresh', function (event, message) {
  if (pageUrl == null) {
    getPageUrl();
  } else {
    win.webContents.send('refresh', {
      url: pageUrl,
      comments: []
    });
    isLoved(pageUrl);
    pageUrl = null;
  }
});

ipc.on('changeTab', function (event, message) {
  win.loadFile(message);
});

ipc.on('play', function (event, url) {
  if (url !== '') {
    pageUrl = url;
  }
  win.loadFile("recommend.html");
});

ipc.on('love', function (event, message) {
  var doc = {
    "url": message.url,
    "description": message.description,
    "cover": message.cover,
    "time": Date.now()
  };
  db.insert(doc, function (err, newDoc) {
    isLoved(message.url);
  });
});

ipc.on('unlove', function (event, url) {
  db.remove({
    url
  }, {}, function (err, numRemoved) {
    isLoved(url);
  });
});

ipc.on('listLove', function (event, message) {
  db.find({}, function (err, docs) {
    win.webContents.send('listLove', docs);
  })
});