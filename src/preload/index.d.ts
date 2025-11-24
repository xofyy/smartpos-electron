import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      products: {
        getAll: () => Promise<any[]>
        add: (product: any) => Promise<number | bigint>
        update: (product: any) => Promise<void>
        delete: (id: number) => Promise<void>
        getByBarcode: (barcode: string) => Promise<any>
      }
      sales: {
        processSale: (sale: any) => Promise<boolean>
      }
      hardware: {
        sendToPos: (data: string) => Promise<void>
      }
    }
  }
}
