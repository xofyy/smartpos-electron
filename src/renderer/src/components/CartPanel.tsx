import { Trash2, Plus, Minus, CreditCard, Banknote } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useProducts } from '../hooks/useProducts'
import { useCheckout } from '../hooks/useCheckout'
import { useSettingsStore } from '../store/useSettingsStore'
import { useTranslation } from '../hooks/useTranslation'
import { useToastStore } from '../store/useToastStore'

export function CartPanel() {
    const { cart, removeFromCart, updateQuantity, totalAmount } = useCartStore()
    const { processSale, processing } = useCheckout()
    const { settings } = useSettingsStore()
    const { t } = useTranslation()
    const { fetchProducts } = useProducts()
    const { addToast } = useToastStore()

    const handleCheckout = async (method: 'cash' | 'card') => {
        const success = await processSale(method)
        if (success) {
            addToast(t('sale_completed'), 'success')
            await fetchProducts()
        } else {
            addToast(t('sale_failed'), 'error')
        }
    }

    return (
        <div className="w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col transition-colors duration-200">
            <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('current_sale')}</h2>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        {t('cart_empty')}
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{settings.currency}{item.price.toFixed(2)} x {item.quantity}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-white dark:bg-gray-600 rounded border dark:border-gray-500">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-200"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-6 text-center text-sm font-medium dark:text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-200"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div className="font-bold text-gray-800 dark:text-white w-16 text-right">
                                    {settings.currency}{(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 dark:text-gray-400">{t('total')}</span>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{settings.currency}{totalAmount().toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleCheckout('cash')}
                        disabled={cart.length === 0 || processing}
                        className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <Banknote size={20} />
                        {processing ? t('processing') : t('cash')}
                    </button>
                    <button
                        onClick={() => handleCheckout('card')}
                        disabled={cart.length === 0 || processing}
                        className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <CreditCard size={20} />
                        {processing ? t('processing') : t('card')}
                    </button>
                </div>
            </div>
        </div>
    )
}
