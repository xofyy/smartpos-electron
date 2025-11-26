import { create } from 'zustand'
import { CartItem, Product } from '../types'

interface CartState {
  cart: CartItem[]
  addToCart: (product: Product & { id: number }) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalAmount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  addToCart: (product) => {
    const { cart } = get()
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      })
    } else {
      set({
        cart: [...cart, { ...product, quantity: 1 }]
      })
    }
  },
  removeFromCart: (productId) => {
    set({
      cart: get().cart.filter(item => item.id !== productId)
    })
  },
  updateQuantity: (productId, quantity) => {
    set({
      cart: get().cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    })
  },
  clearCart: () => set({ cart: [] }),
  totalAmount: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}))
