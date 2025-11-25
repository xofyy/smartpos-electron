import { X } from 'lucide-react'
import { useToastStore } from '../store/useToastStore'

export function ToastContainer() {
    const { toasts, removeToast } = useToastStore()

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`min-w-[300px] p-4 rounded-lg shadow-lg flex justify-between items-start animate-slide-in ${toast.type === 'success' ? 'bg-green-500 text-white' :
                            toast.type === 'error' ? 'bg-red-500 text-white' :
                                'bg-blue-500 text-white'
                        }`}
                >
                    <p className="font-medium text-sm">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-4 hover:opacity-80"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    )
}
