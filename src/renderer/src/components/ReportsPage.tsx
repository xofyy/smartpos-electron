import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Download } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { useSettingsStore } from '../store/useSettingsStore'
import { useToastStore } from '../store/useToastStore'

export function ReportsPage() {
    const { t } = useTranslation()
    const { settings } = useSettingsStore()
    const { addToast } = useToastStore()
    const [summary, setSummary] = useState({ total_revenue: 0, total_sales: 0 })
    const [dailySales, setDailySales] = useState<any[]>([])
    const [topProducts, setTopProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const today = new Date().toISOString().split('T')[0]
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

            const summaryData = await window.api.reports.getSummaryStats(today)
            const salesData = await window.api.reports.getDailySales(sevenDaysAgo, today)
            const topProductsData = await window.api.reports.getTopProducts(5)

            setSummary(summaryData)
            setDailySales(salesData)
            setTopProducts(topProductsData)
        } catch (error) {
            console.error('Failed to load reports:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = async () => {
        const today = new Date().toISOString().split('T')[0]
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        try {
            const result = await window.api.reports.export(sevenDaysAgo, today)
            if (result.success) {
                addToast(`${t('export_success')} ${result.path}`, 'success')
            } else {
                if (result.message !== 'Cancelled') {
                    addToast(t('export_fail'), 'error')
                }
            }
        } catch (error) {
            console.error('Export failed:', error)
            addToast(t('export_fail'), 'error')
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('loading')}</div>

    return (
        <div className="p-6 space-y-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t('reports')}</h1>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    <Download size={20} />
                    {t('export_csv')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('todays_revenue')}</h3>
                    <p className="text-3xl font-bold mt-2">{settings.currency}{summary.total_revenue.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('todays_sales')}</h3>
                    <p className="text-3xl font-bold mt-2">{summary.total_sales}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">{t('weekly_sales_chart')}</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailySales}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={(value) => value.slice(5)} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#f3f4f6' }}
                                    itemStyle={{ color: '#f3f4f6' }}
                                />
                                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">{t('top_products')}</h3>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
                                <th className="pb-2">{t('product_name')}</th>
                                <th className="pb-2 text-right">{t('quantity_sold')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                        {t('no_data')}
                                    </td>
                                </tr>
                            ) : (
                                topProducts.map((product: any, index) => (
                                    <tr key={index} className="border-t dark:border-gray-700">
                                        <td className="py-3 text-sm">{product.product_name}</td>
                                        <td className="py-3 text-right font-medium text-sm">{product.total_quantity}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
