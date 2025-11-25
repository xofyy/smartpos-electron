import { IReportsRepository } from '../repositories/ReportsRepository'

export class ReportsController {
  constructor(private reportsRepository: IReportsRepository) {}

  async getDailySales(startDate: string, endDate: string) {
    return await this.reportsRepository.getDailySales(startDate, endDate)
  }

  async getTopProducts(limit: number = 5) {
    return await this.reportsRepository.getTopProducts(limit)
  }

  async getSummaryStats(date: string) {
    // If no date provided, default to today (handled by caller usually, but good to be safe)
    const targetDate = date || new Date().toISOString().split('T')[0]
    return await this.reportsRepository.getSummaryStats(targetDate)
  }

  async exportReport(startDate: string, endDate: string): Promise<string> {
    const sales = await this.reportsRepository.getSales(startDate, endDate)
    
    if (sales.length === 0) return ''

    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF'
    const delimiter = ';'
    
    const header = ['Date', 'UUID', 'Items', 'Total Amount', 'Payment Method'].join(delimiter)
    const rows = sales.map(sale => {
      const date = new Date(sale.date).toLocaleString()
      // Escape quotes in items and wrap in quotes
      const items = `"${(sale.items || '').replace(/"/g, '""')}"`
      // Format amount with comma for decimal if needed, but usually raw number is fine. 
      // However, for CSV in regions using semicolon, decimal might be comma.
      // Let's keep it simple for now, maybe convert to string with comma if locale requires it?
      // For now, just standard string representation.
      return [date, sale.uuid, items, sale.total_amount, sale.payment_method].join(delimiter)
    })

    return BOM + [header, ...rows].join('\n')
  }
}
