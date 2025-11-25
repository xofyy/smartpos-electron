import { app, shell, BrowserWindow, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDatabase } from './database'
import { setupIpcHandlers } from './ipcHandlers'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

import { autoUpdater } from 'electron-updater'

// ...

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.smartpos')

  initDatabase()
  setupIpcHandlers()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // Auto-Update Logic
  if (!is.dev) {
    autoUpdater.checkForUpdates()
    
    autoUpdater.on('update-available', () => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send('update-status', 'available')
    })

    autoUpdater.on('update-downloaded', () => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send('update-status', 'downloaded')
      
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'A new version has been downloaded. Restart the application to apply the updates.',
        buttons: ['Restart', 'Later']
      }).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
      })
    })
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
