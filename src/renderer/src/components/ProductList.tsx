import { useState } from 'react'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { ProductModal } from './ProductModal'
import { useProducts } from '../hooks/useProducts'
import { Product } from '../types'
import { useTranslation } from '../hooks/useTranslation'
import { useSettingsStore } from '../store/useSettingsStore'

export function ProductList() {
    const { products, deleteProduct, fetchProducts } = useProducts()
    const { t } = useTranslation()
    const { settings } = useSettingsStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showLowStock, setShowLowStock] = useState(false)

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm(t('delete_confirm'))) {
            await deleteProduct(id)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingProduct(null)
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)
        const matchesLowStock = showLowStock ? p.stock <= settings.low_stock_threshold : true
        return matchesSearch && matchesLowStock
    })

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col transition-colors duration-200">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowLowStock(!showLowStock)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border ${showLowStock ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'}`}
                >
                    <Filter size={20} />
                    {t('low_stock_filter')}
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    {t('add_product')}
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                        <tr>
                            <th className="p-3 rounded-tl-lg">{t('barcode')}</th>
                            <th className="p-3">{t('name')}</th>
                            <th className="p-3">{t('category')}</th>
                            <th className="p-3">{t('price')}</th>
                            <th className="p-3">{t('stock')}</th>
                            <th className="p-3 rounded-tr-lg text-right">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <td className="p-3 text-gray-600 dark:text-gray-400">{product.barcode}</td>
                                <td className="p-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                <td className="p-3 text-gray-500 dark:text-gray-400">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                        {product.category || t('uncategorized')}
                                    </span>
                                </td>
                                <td className="p-3 text-green-600 dark:text-green-400 font-medium">{settings.currency}{product.price.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${product.stock > settings.low_stock_threshold ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {product.stock} {t('in_stock')}
                                    </span>
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id!)}
                                            className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    {t('no_products')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={fetchProducts}
                product={editingProduct}
            />
        </div>
    )
}
