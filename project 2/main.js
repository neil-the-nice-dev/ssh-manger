const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Client } = require('ssh2');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL(
    process.env.VITE_DEV_SERVER_URL ||
      `file://${path.join(__dirname, 'dist/index.html')}`
  );
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('ssh-command', async (event, command, server) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err.message);
        }
        let data = '';
        let error = '';
        stream.on('close', (code, signal) => {
          conn.end();
          if (error) return resolve({ error });
          resolve({ output: data });
        }).on('data', (chunk) => {
          data += chunk;
        }).stderr.on('data', (chunk) => {
          error += chunk;
        });
      });
    }).on('error', (err) => {
      reject(err.message);
    }).connect({
      host: server.host,
      port: server.port || 22,
      username: server.username,
      password: server.password,
      privateKey: server.privateKey
    });
  });
}); 