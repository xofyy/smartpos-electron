import { useState, useEffect, useCallback } from 'react'
import { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await window.api.products.getAll()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

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
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    getProductByBarcode
  }
}
