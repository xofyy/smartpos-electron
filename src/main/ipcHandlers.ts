// @ts-ignore
import { ipcMain, dialog, app, BrowserWindow } from 'electron'
import { ProductRepository } from './repositories/ProductRepository'
import { ProductController } from './controllers/ProductController'
import { SalesRepository } from './repositories/SalesRepository'
import { SalesController } from './controllers/SalesController'
import { SettingsRepository } from './repositories/SettingsRepository'
import { SettingsController } from './controllers/SettingsController'
import { ReportsRepository } from './repositories/ReportsRepository'
import { ReportsController } from './controllers/ReportsController'
// @ts-ignore
import { listPorts, sendToPos } from './posService'
import fs from 'fs'
import { IPC_CHANNELS } from '../shared/constants'
import { registerHandler } from './utils/ipcHelper'

export function setupIpcHandlers() {
  const productRepository = new ProductRepository()
  const salesRepository = new SalesRepository()
  const settingsRepository = new SettingsRepository()
  const reportsRepository = new ReportsRepository()
  
  const productController = new ProductController(productRepository)
  const salesController = new SalesController(salesRepository)
  const settingsController = new SettingsController(settingsRepository)
  const reportsController = new ReportsController(reportsRepository)

  // Product Handlers
  registerHandler(IPC_CHANNELS.PRODUCTS.GET_ALL, async () => {
    return await productController.getAll()
  })

  registerHandler(IPC_CHANNELS.PRODUCTS.ADD, async (_, product) => {
    return await productController.add(product)
  })

  registerHandler(IPC_CHANNELS.PRODUCTS.UPDATE, async (_, product) => {
    return await productController.update(product)
  })

  registerHandler(IPC_CHANNELS.PRODUCTS.DELETE, async (_, id) => {
    return await productController.delete(id)
  })

  registerHandler(IPC_CHANNELS.PRODUCTS.GET_BY_BARCODE, async (_, barcode) => {
    return await productController.getByBarcode(barcode)
  })

  // Sales Handlers
  registerHandler(IPC_CHANNELS.SALES.PROCESS, async (_, sale) => {
    return await salesController.processSale(sale)
  })

  // Reports Handlers
  registerHandler(IPC_CHANNELS.REPORTS.GET_DAILY_SALES, async (_, startDate, endDate) => {
    return await reportsController.getDailySales(startDate, endDate)
  })

  registerHandler(IPC_CHANNELS.REPORTS.GET_TOP_PRODUCTS, async (_, limit) => {
    return await reportsController.getTopProducts(limit)
  })

  registerHandler(IPC_CHANNELS.REPORTS.GET_SUMMARY_STATS, async (_, date) => {
    return await reportsController.getSummaryStats(date)
  })

  registerHandler(IPC_CHANNELS.REPORTS.EXPORT, async (_, startDate, endDate) => {
    const csvData = await reportsController.exportReport(startDate, endDate)
    if (!csvData) return { success: false, message: 'No data to export' }

    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Sales Report',
      defaultPath: `sales_report_${startDate}_${endDate}.csv`,
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    })

    if (filePath) {
      fs.writeFileSync(filePath, csvData, 'utf-8')
      return { success: true, path: filePath }
    }
    return { success: false, message: 'Cancelled' }
  })

  // System Handlers
  registerHandler(IPC_CHANNELS.SYSTEM.CHECK_FOR_UPDATES, async () => {
    const module = await import('electron-updater')
    const autoUpdater = module.autoUpdater || (module.default as any)?.autoUpdater
    
    if (!autoUpdater) {
      throw new Error('Failed to load autoUpdater')
    }

    // Configure autoUpdater
    autoUpdater.logger = console
    autoUpdater.autoDownload = false // We want to control when to download

    // Remove previous listeners to avoid duplicates
    autoUpdater.removeAllListeners()

    // Set up event listeners

    autoUpdater.on('update-available', (info) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send(IPC_CHANNELS.SYSTEM.ON_UPDATE_STATUS, { status: 'available', info })
    })

    autoUpdater.on('update-not-available', (info) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send(IPC_CHANNELS.SYSTEM.ON_UPDATE_STATUS, { status: 'not-available', info })
    })

    autoUpdater.on('error', (err) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send(IPC_CHANNELS.SYSTEM.ON_UPDATE_STATUS, { status: 'error', error: err.message })
    })

    autoUpdater.on('download-progress', (progressObj) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send(IPC_CHANNELS.SYSTEM.ON_UPDATE_PROGRESS, { percent: progressObj.percent })
    })

    autoUpdater.on('update-downloaded', (info) => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send(IPC_CHANNELS.SYSTEM.ON_UPDATE_STATUS, { status: 'downloaded', info })
    })

    const result = await autoUpdater.checkForUpdates()
    return { success: true, updateInfo: result?.updateInfo }
  })

  registerHandler(IPC_CHANNELS.SYSTEM.START_DOWNLOAD, async () => {
    const module = await import('electron-updater')
    const autoUpdater = module.autoUpdater || (module.default as any)?.autoUpdater
    if (autoUpdater) {
      await autoUpdater.downloadUpdate()
      return { success: true }
    }
    return { success: false, error: 'AutoUpdater not initialized' }
  })

  registerHandler(IPC_CHANNELS.SYSTEM.INSTALL_UPDATE, async () => {
    const module = await import('electron-updater')
    const autoUpdater = module.autoUpdater || (module.default as any)?.autoUpdater
    if (autoUpdater) {
      autoUpdater.quitAndInstall()
      return { success: true }
    }
    return { success: false, error: 'AutoUpdater not initialized' }
  })

  registerHandler(IPC_CHANNELS.SYSTEM.GET_VERSION, async () => {
    return app.getVersion()
  })

  // Settings Handlers
  registerHandler(IPC_CHANNELS.SETTINGS.GET_ALL, async () => {
    return await settingsController.getAll()
  })

  // System Handlers
  registerHandler(IPC_CHANNELS.SYSTEM.FACTORY_RESET, async () => {
    return await settingsController.factoryReset()
  })

  registerHandler(IPC_CHANNELS.SYSTEM.BACKUP, async () => {
    return await settingsController.backupData()
  })

  registerHandler(IPC_CHANNELS.SYSTEM.CONFIRM, async (_, { message, title }) => {
    const { response } = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 1,
      title: title || 'Confirm',
      message: message
    })
    return response === 0
  })

  // Hardware Handlers
  registerHandler(IPC_CHANNELS.HARDWARE.LIST_PORTS, async () => {
    return await listPorts()
  })

  // Initialize Serial Port from Settings
  const initHardware = async () => {
    try {
      const portPath = await settingsController.get('scanner_port')
      const scannerType = await settingsController.get('scanner_type')
      
      if (scannerType === 'serial' && portPath) {
        // @ts-ignore
        const { initSerialPort } = await import('./posService')
        initSerialPort(portPath)
      }
    } catch (error) {
      console.error('Failed to init hardware:', error)
    }
  }

  // Initialize on startup
  initHardware()

  // Re-init on settings change
  registerHandler(IPC_CHANNELS.SETTINGS.SET, async (_, { key, value }) => {
    await settingsController.set(key, value)
    if (key === 'scanner_port' || key === 'scanner_type') {
      initHardware()
    }
  })

  // Window Controls
  ipcMain.on(IPC_CHANNELS.WINDOW.MINIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })

  ipcMain.on(IPC_CHANNELS.WINDOW.MAXIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on(IPC_CHANNELS.WINDOW.CLOSE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })
}
