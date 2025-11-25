import { ipcMain, dialog, app, BrowserWindow } from 'electron'
import { ProductRepository } from './repositories/ProductRepository'
import { ProductController } from './controllers/ProductController'
import { SalesRepository } from './repositories/SalesRepository'
import { SalesController } from './controllers/SalesController'
import { SettingsRepository } from './repositories/SettingsRepository'
import { SettingsController } from './controllers/SettingsController'
import { ReportsRepository } from './repositories/ReportsRepository'
import { ReportsController } from './controllers/ReportsController'
import { listPorts, sendToPos } from './posService'
import fs from 'fs'

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
  ipcMain.handle('products:getAll', async () => {
    return await productController.getAll()
  })

  ipcMain.handle('products:add', async (_, product) => {
    return await productController.add(product)
  })

  ipcMain.handle('products:update', async (_, product) => {
    return await productController.update(product)
  })

  ipcMain.handle('products:delete', async (_, id) => {
    return await productController.delete(id)
  })

  ipcMain.handle('products:getByBarcode', async (_, barcode) => {
    return await productController.getByBarcode(barcode)
  })

  // Sales Handlers
  ipcMain.handle('sales:process', async (_, sale) => {
    return await salesController.processSale(sale)
  })

  // Reports Handlers
  ipcMain.handle('reports:getDailySales', async (_, startDate, endDate) => {
    return await reportsController.getDailySales(startDate, endDate)
  })

  ipcMain.handle('reports:getTopProducts', async (_, limit) => {
    return await reportsController.getTopProducts(limit)
  })

  ipcMain.handle('reports:getSummaryStats', async (_, date) => {
    return await reportsController.getSummaryStats(date)
  })

  ipcMain.handle('reports:export', async (_, startDate, endDate) => {
    try {
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
    } catch (error) {
      console.error('Export failed:', error)
      return { success: false, message: 'Export failed' }
    }
  })

  // System Handlers
  // System Handlers
  ipcMain.handle('system:checkForUpdates', async () => {
    try {
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
      autoUpdater.on('checking-for-update', () => {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) win.webContents.send('update-status', { status: 'checking' })
      })

      autoUpdater.on('update-available', (info) => {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) win.webContents.send('update-status', { status: 'available', info })
      })

      autoUpdater.on('update-not-available', (info) => {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) win.webContents.send('update-status', { status: 'not-available', info })
      })

      autoUpdater.on('error', (err) => {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) win.webContents.send('update-status', { status: 'error', error: err.message })
      })

      autoUpdater.on('download-progress', (progressObj) => {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) win.webContents.send('update-progress', progressObj)
      })

      autoUpdater.on('update-downloaded', (info) => {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) win.webContents.send('update-status', { status: 'downloaded', info })
      })

      const result = await autoUpdater.checkForUpdates()
      return { success: true, updateInfo: result?.updateInfo }
    } catch (error: any) {
      console.error('Update check failed:', error)
      return { success: false, error: error.message || 'Unknown error' }
    }
  })

  ipcMain.handle('system:startDownload', async () => {
    try {
      const module = await import('electron-updater')
      const autoUpdater = module.autoUpdater || (module.default as any)?.autoUpdater
      if (autoUpdater) {
        await autoUpdater.downloadUpdate()
        return { success: true }
      }
      return { success: false, error: 'AutoUpdater not initialized' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('system:installUpdate', async () => {
    try {
      const module = await import('electron-updater')
      const autoUpdater = module.autoUpdater || (module.default as any)?.autoUpdater
      if (autoUpdater) {
        autoUpdater.quitAndInstall()
        return { success: true }
      }
      return { success: false, error: 'AutoUpdater not initialized' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // Settings Handlers
  ipcMain.handle('settings:getAll', async () => {
    return await settingsController.getAll()
  })

  ipcMain.handle('settings:set', async (_, { key, value }) => {
    return await settingsController.set(key, value)
  })

  // System Handlers
  ipcMain.handle('system:factoryReset', async () => {
    return await settingsController.factoryReset()
  })

  ipcMain.handle('system:backup', async () => {
    return await settingsController.backupData()
  })

  ipcMain.handle('system:getVersion', () => {
    return app.getVersion()
  })

  // Hardware Handlers
  ipcMain.handle('hardware:listPorts', async () => {
    return await listPorts()
  })

  ipcMain.handle('hardware:sendToPos', async (_, data) => {
    return await sendToPos(data)
  })
}
