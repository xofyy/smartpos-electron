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
    processSale: (sale) => ipcRenderer.invoke('sales:process', sale)
  },
  hardware: {
    sendToPos: (data) => ipcRenderer.invoke('hardware:sendToPos', data)
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
