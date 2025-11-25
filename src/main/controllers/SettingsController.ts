import { ISettingsRepository } from '../repositories/SettingsRepository'
import { run } from '../database'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export class SettingsController {
  constructor(private settingsRepository: ISettingsRepository) {}

  async get(key: string) {
    return await this.settingsRepository.get(key)
  }

  async getAll() {
    return await this.settingsRepository.getAll()
  }

  async set(key: string, value: string) {
    return await this.settingsRepository.set(key, value)
  }

  async factoryReset() {
    // Clear all data but keep structure
    await run('DELETE FROM sale_items')
    await run('DELETE FROM sales')
    await run('DELETE FROM products')
    // Reset settings to defaults
    await run('DELETE FROM settings')
    // Re-init defaults (handled by app restart or manual re-insert, for now just clear)
    return true
  }

  async backupData() {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'smartpos.db')
    const backupPath = path.join(app.getPath('documents'), `smartpos_backup_${Date.now()}.db`)
    
    try {
      fs.copyFileSync(dbPath, backupPath)
      return { success: true, path: backupPath }
    } catch (error) {
      console.error('Backup failed:', error)
      throw error
    }
  }
}
