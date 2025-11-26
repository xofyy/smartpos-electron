import { useState, useMemo } from 'react'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { useTranslation } from '../hooks/useTranslation'
import { useSettingsStore } from '../store/useSettingsStore'
import { Product } from '../types'
import { PackageSearch, Loader2 } from 'lucide-react'
import { EmptyState } from './EmptyState'

export function ProductGrid() {
    const { addToCart } = useCart()
    const { products, loading } = useProducts()
    const { settings } = useSettingsStore()
    const { t } = useTranslation()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)
            const matchesCategory = selectedCategory ? p.category === selectedCategory : true
            return matchesSearch && matchesCategory
        })
    }, [products, searchTerm, selectedCategory])

    const categories = useMemo(() => {
        return Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    }, [products])

    return (
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col transition-colors duration-200">
            <div className="p-4 border-b dark:border-gray-700 flex gap-4">
                <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${!selectedCategory ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        {t('all')}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === cat ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-3">
                        <Loader2 className="animate-spin" size={48} />
                        <p>{t('loading') || 'Loading products...'}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <EmptyState
                            icon={PackageSearch}
                            title={t('no_products_found') || 'No products found'}
                            description={t('try_adjusting_search') || 'Try adjusting your search or category filter'}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => product.id && addToCart(product as Product & { id: number })}
                                className="flex flex-col items-start p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 hover:shadow-md transition bg-white dark:bg-gray-700 text-left group"
                            >
                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 h-12 mb-2">
                                    {product.name}
                                </div>
                                <div className="mt-auto w-full flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{settings.currency}{product.price.toFixed(2)}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock <= settings.low_stock_threshold ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                        {product.stock}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
