import { get, all, run } from '../database'

export interface ISettingsRepository {
  get(key: string): Promise<string | null>
  getAll(): Promise<Record<string, string>>
  set(key: string, value: string): Promise<void>
}

export class SettingsRepository implements ISettingsRepository {
  async get(key: string): Promise<string | null> {
    const row = await get('SELECT value FROM settings WHERE key = ?', [key])
    return row ? row.value : null
  }

  async getAll(): Promise<Record<string, string>> {
    const rows = await all('SELECT key, value FROM settings')
    const settings: Record<string, string> = {}
    rows.forEach((row: any) => {
      settings[row.key] = row.value
    })
    return settings
  }

  async set(key: string, value: string): Promise<void> {
    await run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value])
  }
}
