import { ipcMain } from 'electron'
import { ProductRepository } from './repositories/ProductRepository'
import { SalesRepository } from './repositories/SalesRepository'
import { SettingsRepository } from './repositories/SettingsRepository'
import { ProductController } from './controllers/ProductController'
import { SalesController } from './controllers/SalesController'
import { SettingsController } from './controllers/SettingsController'
import { listPorts, sendToPos } from './posService'

export function setupIpcHandlers() {
  const productRepository = new ProductRepository()
  const salesRepository = new SalesRepository()
  const settingsRepository = new SettingsRepository()
  
  const productController = new ProductController(productRepository)
  const salesController = new SalesController(salesRepository)
  const settingsController = new SettingsController(settingsRepository)

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

  // Hardware Handlers
  ipcMain.handle('hardware:listPorts', async () => {
    return await listPorts()
  })

  ipcMain.handle('hardware:sendToPos', async (_, data) => {
    return await sendToPos(data)
  })
}
