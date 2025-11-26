export interface Product {
  id?: number
  barcode: string
  name: string
  price: number
  stock: number
  category: string
  is_deleted?: boolean
}

export interface CartItem extends Product {
  id: number
  quantity: number
}

export interface Sale {
  id?: number
  uuid?: string
  date?: string
  total_amount: number
  payment_method: 'cash' | 'card'
  items: CartItem[]
}

export interface Settings {
  currency: string
  language: 'tr' | 'en'
  theme: 'light' | 'dark'
  scanner_type?: 'hid' | 'serial'
  scanner_port?: string
  pos_port?: string
  allow_negative_stock: boolean
  low_stock_threshold: number
}
