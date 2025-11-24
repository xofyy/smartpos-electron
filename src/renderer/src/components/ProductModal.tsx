import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Product } from '../types'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    product?: Product | null
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
    const [formData, setFormData] = useState({
        barcode: '',
        name: '',
        price: '',
        stock: '',
        category: ''
    })

    useEffect(() => {
        if (product) {
            setFormData({
                barcode: product.barcode,
                name: product.name,
                price: product.price.toString(),
                stock: product.stock.toString(),
                category: product.category || ''
            })
        } else {
            setFormData({
                barcode: '',
                name: '',
                price: '',
                stock: '',
                category: ''
            })
        }
    }, [product, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        }

        try {
            if (product) {
                await window.api.products.update({ ...data, id: product.id! })
            } else {
                await window.api.products.add(data as any) // Type assertion for new product without ID
            }
            onSave()
            onClose()
        } catch (error) {
            console.error('Failed to save product:', error)
            alert('Error saving product')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.barcode}
                            onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
