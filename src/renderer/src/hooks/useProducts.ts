import { useEffect } from 'react'
import { Product } from '../types'
import { useProductStore } from '../store/useProductStore'

export function useProducts() {
  const { products, loading, error, fetchProducts } = useProductStore()

  const deleteProduct = async (id: number) => {
    try {
      await window.api.products.delete(id)
      await fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
      throw err
    }
  }

  const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    try {
      return await window.api.products.getByBarcode(barcode)
    } catch (err) {
      console.error('Failed to get product by barcode:', err)
      return null
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    getProductByBarcode
  }
}
