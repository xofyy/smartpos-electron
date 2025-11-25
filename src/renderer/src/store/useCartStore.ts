import { create } from 'zustand'
import { CartItem, Product } from '../types'

interface CartState {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalAmount: () => number
}

import { useSettingsStore } from './useSettingsStore'
import { useToastStore } from './useToastStore'
import { translations } from '../i18n/translations'

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  addToCart: (product) => {
    const { cart } = get()
    const settings = useSettingsStore.getState().settings
    
    if (!settings.allow_negative_stock) {
        const existingItem = cart.find(item => item.id === product.id)
        const currentQty = existingItem ? existingItem.quantity : 0
        
        if (currentQty + 1 > product.stock) {
            const language = settings.language === 'en' ? 'en' : 'tr'
            useToastStore.getState().addToast(translations[language].insufficient_stock, 'error')
            return
        }
    }

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
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }

    const { cart } = get()
    const settings = useSettingsStore.getState().settings
    const item = cart.find(i => i.id === productId)

    if (item && !settings.allow_negative_stock && quantity > item.stock) {
        const language = settings.language === 'en' ? 'en' : 'tr'
        useToastStore.getState().addToast(translations[language].insufficient_stock, 'error')
        return
    }

    set({
      cart: cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    })
  },
  clearCart: () => set({ cart: [] }),
  totalAmount: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}))
