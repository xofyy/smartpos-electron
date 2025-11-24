import { useCartStore } from '../store/useCartStore'
import { useScanDetection } from '../hooks/useScanDetection'
import { useProducts } from '../hooks/useProducts'
import { CartPanel } from './CartPanel'
import { ProductGrid } from './ProductGrid'

export function SalesInterface() {
    const { addToCart } = useCartStore()
    const { getProductByBarcode } = useProducts()

    // Barcode Listener
    useScanDetection({
        onComplete: async (code) => {
            const product = await getProductByBarcode(code)
            if (product) {
                addToCart(product)
            } else {
                alert('Product not found!')
            }
        }
    })

    return (
        <div className="flex h-full gap-4">
            <CartPanel />
            <ProductGrid />
        </div>
    )
}
