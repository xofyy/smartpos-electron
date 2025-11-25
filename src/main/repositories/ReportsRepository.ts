import { all, get } from '../database'

export interface IReportsRepository {
  getDailySales(startDate: string, endDate: string): Promise<any[]>
  getTopProducts(limit: number): Promise<any[]>
  getSummaryStats(date: string): Promise<any>
  getSales(startDate: string, endDate: string): Promise<any[]>
}

export class ReportsRepository implements IReportsRepository {
  async getDailySales(startDate: string, endDate: string): Promise<any[]> {
    // Group by date (YYYY-MM-DD) using SQLite date() function to handle ISO strings
    return await all(
      'SELECT date(date) as date, SUM(total_amount) as total FROM sales WHERE date(date) >= ? AND date(date) <= ? GROUP BY date(date) ORDER BY date(date)',
      [startDate, endDate]
    )
  }

  async getTopProducts(limit: number): Promise<any[]> {
    return await all(
      'SELECT product_name, SUM(quantity) as total_quantity FROM sale_items GROUP BY product_name ORDER BY total_quantity DESC LIMIT ?',
      [limit]
    )
  }

  async getSummaryStats(date: string): Promise<any> {
    const result = await get(
      'SELECT SUM(total_amount) as total_revenue, COUNT(*) as total_sales FROM sales WHERE date(date) = ?',
      [date]
    )
    return {
      total_revenue: result?.total_revenue || 0,
      total_sales: result?.total_sales || 0
    }
  }

  async getSales(startDate: string, endDate: string): Promise<any[]> {
    return await all(
      `SELECT s.uuid, s.date, s.total_amount, s.payment_method, 
              GROUP_CONCAT(si.product_name || ' (' || si.quantity || 'x)', ' | ') as items
       FROM sales s
       LEFT JOIN sale_items si ON s.id = si.sale_id
       WHERE date(s.date) >= ? AND date(s.date) <= ?
       GROUP BY s.id
       ORDER BY s.date DESC`,
      [startDate, endDate]
    )
  }
}
