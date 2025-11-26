import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { IPC_CHANNELS } from '../shared/constants'

import { Product, Sale } from '../shared/types'

// Custom APIs for renderer
const api = {
  products: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.PRODUCTS.GET_ALL),
    add: (product: Product) => ipcRenderer.invoke(IPC_CHANNELS.PRODUCTS.ADD, product),
    update: (product: Product) => ipcRenderer.invoke(IPC_CHANNELS.PRODUCTS.UPDATE, product),
    delete: (id: number) => ipcRenderer.invoke(IPC_CHANNELS.PRODUCTS.DELETE, id),
    getByBarcode: (barcode: string) => ipcRenderer.invoke(IPC_CHANNELS.PRODUCTS.GET_BY_BARCODE, barcode)
  },
  sales: {
    process: (sale: Sale) => ipcRenderer.invoke(IPC_CHANNELS.SALES.PROCESS, sale)
  },
  reports: {
    getDailySales: (startDate: string, endDate: string) => ipcRenderer.invoke(IPC_CHANNELS.REPORTS.GET_DAILY_SALES, startDate, endDate),
    getTopProducts: (limit: number) => ipcRenderer.invoke(IPC_CHANNELS.REPORTS.GET_TOP_PRODUCTS, limit),
    getSummaryStats: (date: string) => ipcRenderer.invoke(IPC_CHANNELS.REPORTS.GET_SUMMARY_STATS, date),
    export: (startDate: string, endDate: string) => ipcRenderer.invoke(IPC_CHANNELS.REPORTS.EXPORT, startDate, endDate)
  },
  settings: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET_ALL),
    set: (key: string, value: string) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.SET, { key, value })
  },
  system: {
    checkForUpdates: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.CHECK_FOR_UPDATES),
    startDownload: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.START_DOWNLOAD),
    installUpdate: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.INSTALL_UPDATE),
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_VERSION),
    factoryReset: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.FACTORY_RESET),
    backup: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.BACKUP),
    confirm: (message: string, title?: string) => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.CONFIRM, { message, title }),
    onUpdateStatus: (callback: (status: any) => void) => {
      const subscription = (_event: any, value: any) => callback(value)
      ipcRenderer.on(IPC_CHANNELS.SYSTEM.ON_UPDATE_STATUS, subscription)
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.SYSTEM.ON_UPDATE_STATUS, subscription)
      }
    },
    onUpdateProgress: (callback: (progress: any) => void) => {
      const subscription = (_event: any, value: any) => callback(value)
      ipcRenderer.on(IPC_CHANNELS.SYSTEM.ON_UPDATE_PROGRESS, subscription)
      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.SYSTEM.ON_UPDATE_PROGRESS, subscription)
      }
    }
  },
  hardware: {
    listPorts: () => ipcRenderer.invoke(IPC_CHANNELS.HARDWARE.LIST_PORTS)
  },
  windowControl: {
    minimize: () => ipcRenderer.send(IPC_CHANNELS.WINDOW.MINIMIZE),
    maximize: () => ipcRenderer.send(IPC_CHANNELS.WINDOW.MAXIMIZE),
    close: () => ipcRenderer.send(IPC_CHANNELS.WINDOW.CLOSE)
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
