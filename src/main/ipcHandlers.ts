import { ipcMain } from 'electron'
import { sendToPos, listPorts } from './posService'
import { ProductRepository } from './repositories/ProductRepository'
import { SalesRepository } from './repositories/SalesRepository'
import { ProductController } from './controllers/ProductController'
import { SalesController } from './controllers/SalesController'

export function setupIpcHandlers() {
  // Dependency Injection
  const productRepository = new ProductRepository()
  const salesRepository = new SalesRepository()
  
  const productController = new ProductController(productRepository)
  const salesController = new SalesController(salesRepository)

  // Products
  ipcMain.handle('products:getAll', async () => {
    return await productController.getAll()
  })

  ipcMain.handle('products:add', async (_, product) => {
    return await productController.add(product)
  })

  ipcMain.handle('products:update', async (_, product) => {
    await productController.update(product)
  })

  ipcMain.handle('products:delete', async (_, id) => {
    await productController.delete(id)
  })

  ipcMain.handle('products:getByBarcode', async (_, barcode) => {
    return await productController.getByBarcode(barcode)
  })

  // Sales
  ipcMain.handle('sales:process', async (_, sale) => {
    try {
      return await salesController.processSale(sale)
    } catch (error) {
      console.error('Sale processing failed:', error)
      return false
    }
  })

  // Hardware
  ipcMain.handle('hardware:sendToPos', (_, data) => {
    return sendToPos(data)
  })

  ipcMain.handle('hardware:listPorts', () => {
    return listPorts()
  })
}
