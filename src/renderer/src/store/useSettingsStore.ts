import { create } from 'zustand'

export interface Settings {
    currency: string
    language: string
    theme: string
    scanner_type: 'hid' | 'serial'
    scanner_port: string
    pos_port: string
    allow_negative_stock: boolean
    low_stock_threshold: number
}

interface SettingsStore {
    settings: Settings
    loading: boolean
    setSettings: (settings: Partial<Settings>) => void
    loadSettings: () => Promise<void>
    updateSetting: (key: keyof Settings, value: any) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: {
        currency: '₺',
        language: 'tr',
        theme: 'light',
        scanner_type: 'hid',
        scanner_port: '',
        pos_port: '',
        allow_negative_stock: true,
        low_stock_threshold: 5
    },
    loading: true,

    setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),

    loadSettings: async () => {
        try {
            set({ loading: true })
            const data = await window.api.settings.getAll()
            set((state) => {
                const loadedSettings = { ...state.settings, ...data }
                // Convert string 'true'/'false' to boolean for allow_negative_stock
                if (data.allow_negative_stock !== undefined) {
                    loadedSettings.allow_negative_stock = String(data.allow_negative_stock) === 'true'
                }
                // Convert string to number for low_stock_threshold
                if (data.low_stock_threshold !== undefined) {
                    loadedSettings.low_stock_threshold = parseInt(String(data.low_stock_threshold), 10) || 5
                }
                return {
                    settings: loadedSettings,
                    loading: false
                }
            })
            
            // Apply theme immediately after loading
            if (data.theme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        } catch (error) {
            console.error('Failed to load settings:', error)
            set({ loading: false })
        }
    },

    updateSetting: async (key, value) => {
        try {
            // Optimistic update
            set((state) => {
                const newSettings = { ...state.settings, [key]: value }
                
                // Handle side effects
                if (key === 'theme') {
                    if (value === 'dark') {
                        document.documentElement.classList.add('dark')
                    } else {
                        document.documentElement.classList.remove('dark')
                    }
                }
                
                return { settings: newSettings }
            })

            // Convert values for storage
            let valueToStore = value
            if (typeof value === 'boolean') {
                valueToStore = String(value)
            } else if (typeof value === 'number') {
                valueToStore = String(value)
            }
            
            await window.api.settings.set(key, valueToStore)
        } catch (error) {
            console.error(`Failed to update setting ${key}:`, error)
            // Revert on failure could be implemented here
        }
    }
}))
