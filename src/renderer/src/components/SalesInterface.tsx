import { useCartStore } from '../store/useCartStore'
import { useScanDetection } from '../hooks/useScanDetection'
import { useProducts } from '../hooks/useProducts'
import { CartPanel } from './CartPanel'
import { ProductGrid } from './ProductGrid'
import { useTranslation } from '../hooks/useTranslation'
import { useToastStore } from '../store/useToastStore'

export function SalesInterface() {
    const { addToCart } = useCartStore()
    const { getProductByBarcode } = useProducts()
    const { t } = useTranslation()
    const { addToast } = useToastStore()

    // Barcode Listener
    useScanDetection({
        onComplete: async (code) => {
            const product = await getProductByBarcode(code)
            if (product) {
                addToCart(product)
            } else {
                addToast(t('product_not_found') || 'Product not found!', 'error')
            }
        }
    })

    return (
        <div className="flex h-full gap-4 relative">
            <CartPanel />
            <ProductGrid />
        </div>
    )
}
