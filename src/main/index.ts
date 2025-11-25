import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDatabase } from './database'
import { setupIpcHandlers } from './ipcHandlers'

function createWindow(): void {
  // Create splash window
  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: icon
  })

  // Load splash screen
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // In dev, we can just load the file directly from resources
    splash.loadFile(join(__dirname, '../../resources/splash.html'))
  } else {
    // In prod, it's in the resources folder
    splash.loadFile(join(process.resourcesPath, 'splash.html'))
  }
  splash.center()

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false, // Custom title bar
    icon: icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    // Add a small delay to ensure splash is seen (optional)
    setTimeout(() => {
      splash.destroy()
      mainWindow.show()
    }, 2000)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

  // Auto-Update Logic moved to ipcHandlers.ts

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.smartpos')

  initDatabase()
  setupIpcHandlers()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
