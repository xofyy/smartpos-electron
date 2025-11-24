import { useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { useProducts } from '../hooks/useProducts'

export function ProductGrid() {
    const { addToCart } = useCartStore()
    const { products } = useProducts()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)
        const matchesCategory = selectedCategory ? p.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

    return (
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
            <div className="p-4 border-b flex gap-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${!selectedCategory ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === cat ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="flex flex-col items-start p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition bg-white text-left group"
                        >
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 h-12 mb-2">
                                {product.name}
                            </div>
                            <div className="mt-auto w-full flex justify-between items-end">
                                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.stock}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
