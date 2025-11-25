import { Minus, Square, X } from 'lucide-react'
import icon from '../assets/icon.png'

export function TitleBar() {
    const handleMinimize = () => {
        window.api.windowControl.minimize()
    }

    const handleMaximize = () => {
        window.api.windowControl.maximize()
    }

    const handleClose = () => {
        window.api.windowControl.close()
    }

    return (
        <div className="h-9 bg-brand-navy dark:bg-brand-dark flex justify-between items-center select-none z-50 relative drag transition-colors duration-200">
            <div className="flex-1 flex items-center gap-2 px-3 h-full">
                <img src={icon} alt="Logo" className="w-5 h-5" />
                <span className="text-sm text-gray-200 font-medium tracking-wide">SmartPOS</span>
                <span className="text-xs text-gray-500 font-medium px-1.5 py-0.5 bg-white/5 rounded">Lite</span>
            </div>
            <div className="flex h-full no-drag">
                <button
                    onClick={handleMinimize}
                    className="px-4 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                >
                    <Minus size={16} />
                </button>
                <button
                    onClick={handleMaximize}
                    className="px-4 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                >
                    <Square size={14} />
                </button>
                <button
                    onClick={handleClose}
                    className="px-4 hover:bg-red-600 text-gray-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}
