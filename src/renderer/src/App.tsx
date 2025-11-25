import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LayoutGrid, ShoppingCart, Settings, BarChart } from 'lucide-react'
import { ProductList } from './components/ProductList'
import { SalesInterface } from './components/SalesInterface'
import { SettingsPage } from './components/SettingsPage'
import { ReportsPage } from './components/ReportsPage'
import { useTranslation } from './hooks/useTranslation'
import { useSettingsStore } from './store/useSettingsStore'
import { useToastStore } from './store/useToastStore'
import { ToastContainer } from './components/ToastContainer'

function NavLink({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${isActive
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
        }`}
    >
      <Icon size={20} />
      {label}
    </Link>
  )
}

function Layout() {
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
    window.api.system.onUpdateStatus((data) => {
      if (data.status === 'available') {
        addToast(t('update_available'), 'info')
      } else if (data.status === 'downloaded') {
        addToast(t('update_downloaded'), 'success')
      }
    })

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addToast, t]) // Dependencies for useEffect

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <ToastContainer />
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">SmartPOS</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Lite Edition</p>
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

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App
