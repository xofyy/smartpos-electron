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
      settings: {
        getAll: () => Promise<Record<string, string>>
        set: (key: string, value: string) => Promise<void>
      }
      system: {
        factoryReset: () => Promise<boolean>
        backup: () => Promise<{ success: boolean; path: string }>
      }
      hardware: {
        listPorts: () => Promise<string[]>
        printReceipt: (data: any) => Promise<boolean>
      }
    }
  }
}

