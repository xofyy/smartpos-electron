import { useState, useEffect } from 'react'
import { Monitor, Trash2, HardDrive, CreditCard, RefreshCw } from 'lucide-react'
import { useSettingsStore } from '../store/useSettingsStore'
import { useTranslation } from '../hooks/useTranslation'
import { useToastStore } from '../store/useToastStore'

export function SettingsPage() {
    const { settings, updateSetting, loading, loadSettings } = useSettingsStore()
    const { t } = useTranslation()
    const { addToast } = useToastStore()

    const [ports, setPorts] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState<'general' | 'hardware' | 'data'>('general')
    const [appVersion, setAppVersion] = useState<string>('1.0.0')

    // Update State
    const [updateStatus, setUpdateStatus] = useState<string>('idle') // idle, checking, available, not-available, downloading, downloaded, error
    const [updateInfo, setUpdateInfo] = useState<any>(null)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [updateError, setUpdateError] = useState<string | null>(null)

    useEffect(() => {
        loadSettings()
        const loadPorts = async () => {
            try {
                const portList = await window.api.hardware.listPorts()
                setPorts(portList)
            } catch (error) {
                console.error('Failed to list ports:', error)
            }
        }

        const loadVersion = async () => {
            try {
                const version = await window.api.system.getVersion()
                setAppVersion(version)
            } catch (error) {
                console.error('Failed to get version:', error)
            }
        }

        loadPorts()
        loadVersion()

        // Update Listeners
        const cleanupStatus = window.api.system.onUpdateStatus((data) => {
            console.log('Update Status:', data)
            setUpdateStatus(data.status)
            if (data.info) setUpdateInfo(data.info)
            if (data.error) setUpdateError(data.error)

            if (data.status === 'checking') {
                addToast(t('checking_for_updates'), 'info')
            } else if (data.status === 'not-available') {
                addToast(t('update_not_found'), 'info')
            } else if (data.status === 'available') {
                addToast(t('version_available') + ' ' + data.info.version, 'success')
            } else if (data.status === 'downloaded') {
                addToast(t('update_downloaded'), 'success')
            } else if (data.status === 'error') {
                addToast(`${t('update_error')}: ${data.error}`, 'error')
            }
        })

        const cleanupProgress = window.api.system.onUpdateProgress((data) => {
            setDownloadProgress(data.percent)
        })

        return () => {
            cleanupStatus()
            cleanupProgress()
        }
    }, [])

    const factoryReset = async () => {
        if (confirm(t('reset_confirm'))) {
            try {
                const success = await window.api.system.factoryReset()
                if (success) {
                    window.location.reload()
                } else {
                    addToast(t('reset_fail'), 'error')
                }
            } catch (error) {
                console.error('Factory reset failed:', error)
                addToast(t('reset_fail'), 'error')
            }
        }
    }

    const backupData = async () => {
        try {
            const result = await window.api.system.backup()
            if (result.success) {
                addToast(`${t('backup_success')} ${result.path}`, 'success')
            } else {
                addToast(t('backup_fail'), 'error')
            }
        } catch (error) {
            console.error('Backup failed:', error)
            addToast(t('backup_fail'), 'error')
        }
    }

    const checkForUpdates = async () => {
        setUpdateStatus('checking')
        setUpdateError(null)
        try {
            await window.api.system.checkForUpdates()
        } catch (error: any) {
            console.error('Update check failed:', error)
            setUpdateStatus('error')
            setUpdateError(error.message)
        }
    }

    const startDownload = async () => {
        setUpdateStatus('downloading')
        try {
            await window.api.system.startDownload()
        } catch (error: any) {
            setUpdateStatus('error')
            setUpdateError(error.message)
        }
    }

    const installUpdate = async () => {
        try {
            await window.api.system.installUpdate()
        } catch (error: any) {
            setUpdateStatus('error')
            setUpdateError(error.message)
        }
    }

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col transition-colors duration-200">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('settings_title')}</h2>
            </div>

            <div className="flex border-b dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 font-medium transition ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    {t('general')}
                </button>
                <button
                    onClick={() => setActiveTab('hardware')}
                    className={`px-6 py-3 font-medium transition ${activeTab === 'hardware' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    {t('hardware')}
                </button>
                <button
                    onClick={() => setActiveTab('data')}
                    className={`px-6 py-3 font-medium transition ${activeTab === 'data' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                    {t('data')}
                </button>
            </div>

            <div className="p-6 flex-1 overflow-auto">
                {activeTab === 'general' && (
                    <div className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('currency_symbol')}</label>
                            <input
                                type="text"
                                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={settings.currency}
                                onChange={(e) => updateSetting('currency', e.target.value)}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('currency_example')}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('language')}</label>
                            <select
                                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={settings.language}
                                onChange={(e) => updateSetting('language', e.target.value)}
                            >
                                <option value="tr">{t('lang_tr')}</option>
                                <option value="en">{t('lang_en')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('theme')}</label>
                            <select
                                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={settings.theme}
                                onChange={(e) => updateSetting('theme', e.target.value)}
                            >
                                <option value="light">{t('theme_light')}</option>
                                <option value="dark">{t('theme_dark')}</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="allow_negative_stock"
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                checked={settings.allow_negative_stock}
                                onChange={(e) => updateSetting('allow_negative_stock', e.target.checked)}
                            />
                            <div>
                                <label htmlFor="allow_negative_stock" className="font-medium text-gray-700 dark:text-gray-300">
                                    {t('allow_negative_stock')}
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('negative_stock_hint')}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('low_stock_threshold')}</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={settings.low_stock_threshold}
                                onChange={(e) => updateSetting('low_stock_threshold', parseInt(e.target.value))}
                            />
                        </div>

                        <div className="pt-6 border-t dark:border-gray-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900 dark:text-white">{t('software_update')}</h3>
                                <span className="text-sm text-gray-500">v{appVersion}</span>
                            </div>

                            {updateStatus === 'idle' || updateStatus === 'not-available' || updateStatus === 'error' ? (
                                <button
                                    onClick={checkForUpdates}
                                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={20} />
                                    <span>{t('check_updates')}</span>
                                </button>
                            ) : null}

                            {updateStatus === 'checking' && (
                                <div className="text-center text-gray-600 dark:text-gray-400 py-2">
                                    <RefreshCw size={20} className="animate-spin inline-block mr-2" />
                                    {t('checking_for_updates')}
                                </div>
                            )}

                            {updateStatus === 'available' && (
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                                    <p className="text-green-800 dark:text-green-300 font-medium mb-2">
                                        {t('version_available')} {updateInfo?.version}
                                    </p>
                                    <button
                                        onClick={startDownload}
                                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        {t('download_update')}
                                    </button>
                                </div>
                            )}

                            {updateStatus === 'downloading' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>{t('downloading')}</span>
                                        <span>{Math.round(downloadProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${downloadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {updateStatus === 'downloaded' && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <p className="text-blue-800 dark:text-blue-300 font-medium mb-2">
                                        {t('update_ready_desc')}
                                    </p>
                                    <button
                                        onClick={installUpdate}
                                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        {t('restart_to_install')}
                                    </button>
                                </div>
                            )}

                            {updateStatus === 'error' && updateError && (
                                <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
                                    {updateError}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'hardware' && (
                    <div className="space-y-6 max-w-lg">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="p-1 bg-white dark:bg-gray-600 rounded border dark:border-gray-500"><Monitor size={16} /></span>
                                {t('scanner_settings')}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('connection_type')}</label>
                                    <select
                                        className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={settings.scanner_type || 'hid'}
                                        onChange={(e) => updateSetting('scanner_type', e.target.value)}
                                    >
                                        <option value="hid">{t('usb_keyboard')}</option>
                                        <option value="serial">{t('serial_port')}</option>
                                    </select>
                                </div>

                                {settings.scanner_type === 'serial' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('port_selection')}</label>
                                        <select
                                            className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={settings.scanner_port || ''}
                                            onChange={(e) => updateSetting('scanner_port', e.target.value)}
                                        >
                                            <option value="">{t('port_selection')}...</option>
                                            {ports.map(port => (
                                                <option key={port} value={port}>{port}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="p-1 bg-white dark:bg-gray-600 rounded border dark:border-gray-500"><CreditCard size={16} /></span>
                                {t('pos_device')}
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('connection_port')}</label>
                                <select
                                    className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={settings.pos_port || ''}
                                    onChange={(e) => updateSetting('pos_port', e.target.value)}
                                >
                                    <option value="">{t('port_selection')}...</option>
                                    {ports.map(port => (
                                        <option key={port} value={port}>{port}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {t('pos_hint')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="space-y-6 max-w-lg">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <HardDrive size={20} />
                                {t('backup_db')}
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                                {t('backup_desc')}
                            </p>
                            <button
                                onClick={backupData}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {t('backup_btn')}
                            </button>
                        </div>

                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                            <h3 className="font-medium text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                                <Trash2 size={20} />
                                {t('factory_reset')}
                            </h3>
                            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                                {t('reset_desc')}
                            </p>
                            <button
                                onClick={factoryReset}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                {t('reset_btn')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
