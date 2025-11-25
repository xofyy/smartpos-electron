import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      products: {
        getAll: () => Promise<Product[]>
        add: (product: Omit<Product, 'id'>) => Promise<number>
        update: (product: Product) => Promise<void>
        delete: (id: number) => Promise<void>
        getByBarcode: (barcode: string) => Promise<Product | null>
      }
      sales: {
        process: (sale: any) => Promise<boolean>
      }
      reports: {
        getDailySales: (startDate: string, endDate: string) => Promise<any[]>
        getTopProducts: (limit: number) => Promise<any[]>
        getSummaryStats: (date: string) => Promise<any>
        export: (startDate: string, endDate: string) => Promise<{ success: boolean, path?: string, message?: string }>
      }
      settings: {
        getAll: () => Promise<Record<string, string>>
        set: (key: string, value: string) => Promise<void>
      }
      system: {
        factoryReset: () => Promise<{ success: boolean, message?: string }>
        backup: () => Promise<{ success: boolean, path?: string, message?: string }>
        checkForUpdates: () => Promise<{ success: boolean, updateInfo?: any, error?: string }>
        getVersion: () => Promise<string>
        onUpdateStatus: (callback: (status: string) => void) => void
      }
      hardware: {
        listPorts: () => Promise<string[]>
        printReceipt: (data: any) => Promise<boolean>
      }
    }
  }
}

