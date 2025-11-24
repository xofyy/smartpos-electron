export interface Product {
  id: number
  barcode: string
  name: string
  price: number
  stock: number
  category: string
}

export interface CartItem extends Product {
  quantity: number
}

export type PaymentMethod = 'cash' | 'card'

export interface Sale {
  uuid: string
  date: string
  total_amount: number
  payment_method: PaymentMethod
  items: CartItem[]
}
