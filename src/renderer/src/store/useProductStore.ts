import { create } from 'zustand'
import { Product } from '../types'

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  setProducts: (products: Product[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  fetchProducts: async () => {
    set({ loading: true })
    try {
      const data = await window.api.products.getAll()
      set({ products: data, error: null })
    } catch (err) {
      set({ error: 'Failed to fetch products' })
      console.error(err)
    } finally {
      set({ loading: false })
    }
  }
}))
