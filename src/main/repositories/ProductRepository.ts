import { run, get, all } from '../database'
import { Product } from '../../shared/types'

export interface IProductRepository {
  getAll(): Promise<Product[]>
  add(product: Product): Promise<number>
  update(product: Product): Promise<void>
  delete(id: number): Promise<void>
  getByBarcode(barcode: string): Promise<Product | undefined>
}

export class ProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    return await all('SELECT * FROM products WHERE is_deleted = 0 ORDER BY id DESC')
  }

  async add(product: Product): Promise<number> {
    const result = await run(
      'INSERT INTO products (barcode, name, price, stock, category) VALUES (?, ?, ?, ?, ?)',
      [product.barcode, product.name, product.price, product.stock, product.category]
    )
    return result.lastID
  }

  async update(product: Product): Promise<void> {
    if (!product.id) throw new Error('Product ID is required for update')
    await run(
      'UPDATE products SET barcode = ?, name = ?, price = ?, stock = ?, category = ? WHERE id = ?',
      [product.barcode, product.name, product.price, product.stock, product.category, product.id]
    )
  }

  async delete(id: number): Promise<void> {
    await run('UPDATE products SET is_deleted = 1 WHERE id = ?', [id])
  }

  async getByBarcode(barcode: string): Promise<Product | undefined> {
    return await get('SELECT * FROM products WHERE barcode = ? AND is_deleted = 0', [barcode])
  }
}
