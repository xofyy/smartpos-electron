import { useCartStore } from '../store/useCartStore'
import { useSettingsStore } from '../store/useSettingsStore'
import { useToastStore } from '../store/useToastStore'
import { useTranslation } from './useTranslation'
import { Product } from '../types'

export function useCart() {
  const store = useCartStore()
  const { settings } = useSettingsStore()
  const { addToast } = useToastStore()
  const { t } = useTranslation()

  const addToCart = (product: Product & { id: number }) => {
    if (!settings.allow_negative_stock) {
      const existingItem = store.cart.find((item) => item.id === product.id)
      const currentQty = existingItem ? existingItem.quantity : 0

      if (currentQty + 1 > product.stock) {
        addToast(t('insufficient_stock'), 'error')
        return
      }
    }
    store.addToCart(product)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      store.removeFromCart(productId)
      return
    }

    const item = store.cart.find((i) => i.id === productId)
    if (!item) return

    if (!settings.allow_negative_stock && quantity > item.stock) {
      addToast(t('insufficient_stock'), 'error')
      return
    }

    store.updateQuantity(productId, quantity)
  }

  return {
    cart: store.cart,
    addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity,
    clearCart: store.clearCart,
    totalAmount: store.totalAmount
  }
}
