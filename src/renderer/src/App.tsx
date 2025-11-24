import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ProductList } from './components/ProductList'
import { SalesInterface } from './components/SalesInterface'
import { LayoutGrid, ShoppingCart, Settings } from 'lucide-react'

function NavLink({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <Icon size={20} />
      {label}
    </Link>
  )
}

function Layout() {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SmartPOS</h1>
            <p className="text-xs text-gray-500">Lite Edition</p>
          </div>
          <nav className="flex gap-2">
            <NavLink to="/" icon={ShoppingCart} label="POS Terminal" />
            <NavLink to="/products" icon={LayoutGrid} label="Products" />
            <NavLink to="/settings" icon={Settings} label="Settings" />
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<SalesInterface />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Settings coming soon...</div>} />
        </Routes>
      </main>
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App
