import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LayoutGrid, ShoppingCart, Settings, BarChart } from 'lucide-react'
import { TitleBar } from './TitleBar'
import { ToastContainer } from './ToastContainer'
import { NavLink } from './NavLink'
import { SalesInterface } from './SalesInterface'
import { ProductList } from './ProductList'
import { ReportsPage } from './ReportsPage'
import { SettingsPage } from './SettingsPage'
import { useTranslation } from '../hooks/useTranslation'
import { useSettingsStore } from '../store/useSettingsStore'
import { useToastStore } from '../store/useToastStore'

export function Layout() {
    const { t } = useTranslation()
    const { loadSettings } = useSettingsStore()
    const { addToast } = useToastStore()

    useEffect(() => {
        loadSettings()
    }, [])

    // Added useEffect to listen for update status and F11 key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F11') {
                e.preventDefault()
                // Toggle fullscreen logic if needed
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        // Update listeners
        const cleanupStatus = window.api.system.onUpdateStatus((data) => {
            if (data.status === 'available') {
                addToast(t('update_available'), 'info')
            } else if (data.status === 'downloaded') {
                addToast(t('update_downloaded'), 'success')
            }
        })

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            cleanupStatus()
        }
    }, [addToast, t])

    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200 overflow-hidden border border-gray-700/50">
            <TitleBar />
            <ToastContainer />
            <header className="bg-brand-navy dark:bg-brand-dark shadow-md z-10 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* Logo/Title removed as it is in TitleBar */}
                    </div>
                    <nav className="flex gap-2">
                        <NavLink to="/" icon={ShoppingCart} label={t('nav_pos')} />
                        <NavLink to="/products" icon={LayoutGrid} label={t('nav_products')} />
                        <NavLink to="/reports" icon={BarChart} label={t('nav_reports')} />
                        <NavLink to="/settings" icon={Settings} label={t('nav_settings')} />
                    </nav>
                </div>
            </header>

            <main className="flex-1 overflow-hidden p-4 max-w-7xl mx-auto w-full">
                <Routes>
                    <Route path="/" element={<SalesInterface />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </main>
        </div>
    )
}
