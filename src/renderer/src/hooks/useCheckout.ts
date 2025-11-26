import { useState } from 'react'
import { useCart } from './useCart'
import { PaymentMethod } from '../types'

export function useCheckout() {
  const { cart, totalAmount, clearCart } = useCart()
  const [processing, setProcessing] = useState(false)

  const processSale = async (paymentMethod: PaymentMethod = 'cash') => {
    if (cart.length === 0) return false

    setProcessing(true)
    try {
      const saleData = {
        uuid: crypto.randomUUID(),
        date: new Date().toISOString(),
        total_amount: totalAmount(),
        payment_method: paymentMethod,
        items: cart
      }

      const success = await window.api.sales.process(saleData)
      
      if (success) {
        clearCart()
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Checkout failed:', error)
      return false
    } finally {
      setProcessing(false)
    }
  }

  return {
    processSale,
    processing
  }
}
