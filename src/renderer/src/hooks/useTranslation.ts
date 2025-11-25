import { useSettingsStore } from '../store/useSettingsStore'
import { translations, TranslationKey } from '../i18n/translations'

export function useTranslation() {
    const { settings } = useSettingsStore()
    const language = (settings.language === 'en' ? 'en' : 'tr')

    const t = (key: TranslationKey) => {
        return translations[language][key] || key
    }

    return { t, language }
}
