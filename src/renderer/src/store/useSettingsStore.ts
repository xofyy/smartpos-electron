import { create } from 'zustand'

export interface Settings {
    currency: string
    language: string
    theme: string
    scanner_type: 'hid' | 'serial'
    scanner_port: string
    pos_port: string
}

interface SettingsStore {
    settings: Settings
    loading: boolean
    setSettings: (settings: Partial<Settings>) => void
    loadSettings: () => Promise<void>
    updateSetting: (key: keyof Settings, value: string) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: {
        currency: '₺',
        language: 'tr',
        theme: 'light',
        scanner_type: 'hid',
        scanner_port: '',
        pos_port: ''
    },
    loading: true,

    setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),

    loadSettings: async () => {
        try {
            set({ loading: true })
            const data = await window.api.settings.getAll()
            set((state) => ({
                settings: { ...state.settings, ...data },
                loading: false
            }))
            
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

            await window.api.settings.set(key, value)
        } catch (error) {
            console.error(`Failed to update setting ${key}:`, error)
            // Revert on failure could be implemented here
        }
    }
}))
