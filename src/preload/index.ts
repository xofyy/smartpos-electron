import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  products: {
    getAll: () => ipcRenderer.invoke('products:getAll'),
    add: (product) => ipcRenderer.invoke('products:add', product),
    update: (product) => ipcRenderer.invoke('products:update', product),
    delete: (id) => ipcRenderer.invoke('products:delete', id),
    getByBarcode: (barcode) => ipcRenderer.invoke('products:getByBarcode', barcode)
  },
  sales: {
    process: (sale) => ipcRenderer.invoke('sales:process', sale)
  },
  reports: {
    getDailySales: (startDate, endDate) => ipcRenderer.invoke('reports:getDailySales', startDate, endDate),
    getTopProducts: (limit) => ipcRenderer.invoke('reports:getTopProducts', limit),
    getSummaryStats: (date) => ipcRenderer.invoke('reports:getSummaryStats', date),
    export: (startDate, endDate) => ipcRenderer.invoke('reports:export', startDate, endDate)
  },
  settings: {
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    set: (key, value) => ipcRenderer.invoke('settings:set', { key, value })
  },
  system: {
    factoryReset: () => ipcRenderer.invoke('system:factoryReset'),
    backup: () => ipcRenderer.invoke('system:backup'),
    checkForUpdates: () => ipcRenderer.invoke('system:checkForUpdates'),
    getVersion: () => ipcRenderer.invoke('system:getVersion'),
    onUpdateStatus: (callback) => ipcRenderer.on('update-status', (_, status) => callback(status))
  },
  hardware: {
    listPorts: () => ipcRenderer.invoke('hardware:listPorts'),
    printReceipt: (data) => ipcRenderer.invoke('hardware:printReceipt', data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
