const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendCommand: (command, server) => ipcRenderer.invoke('ssh-command', command, server)
}); 