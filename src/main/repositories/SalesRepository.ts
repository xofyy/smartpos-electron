import db, { run } from '../database'
import { Sale } from '../../shared/types'

export interface ISalesRepository {
  processSale(sale: Sale): Promise<boolean>
}

export class SalesRepository implements ISalesRepository {
  async processSale(sale: Sale): Promise<boolean> {
    return new Promise((resolve) => {
      db.serialize(async () => {
        try {
          db.run('BEGIN TRANSACTION')

          // 1. Insert Sale
          const saleResult = await run(
            'INSERT INTO sales (uuid, date, total_amount, payment_method) VALUES (?, ?, ?, ?)',
            [sale.uuid, sale.date, sale.total_amount, sale.payment_method]
          )
          const saleId = saleResult.lastID

          // 2. Insert Sale Items & Update Stock
          const insertItemSql = 'INSERT INTO sale_items (sale_id, product_name, quantity, price) VALUES (?, ?, ?, ?)'
          const updateStockSql = 'UPDATE products SET stock = stock - ? WHERE id = ?'

          for (const item of sale.items) {
            await run(insertItemSql, [saleId, item.name, item.quantity, item.price])
            await run(updateStockSql, [item.quantity, item.id])
          }

          db.run('COMMIT', (err) => {
            if (err) {
              console.error('Commit failed:', err)
              db.run('ROLLBACK')
              resolve(false)
            } else {
              resolve(true)
            }
          })
        } catch (error) {
          console.error('Transaction failed:', error)
          db.run('ROLLBACK')
          resolve(false)
        }
      })
    })
  }
}
