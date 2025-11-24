import { IProductRepository, Product } from '../repositories/ProductRepository'

export class ProductController {
  constructor(private productRepository: IProductRepository) {}

  async getAll() {
    return await this.productRepository.getAll()
  }

  async add(product: Product) {
    // Validation logic can go here
    if (!product.barcode || !product.name) {
      throw new Error('Invalid product data')
    }
    return await this.productRepository.add(product)
  }

  async update(product: Product) {
    return await this.productRepository.update(product)
  }

  async delete(id: number) {
    return await this.productRepository.delete(id)
  }

  async getByBarcode(barcode: string) {
    return await this.productRepository.getByBarcode(barcode)
  }
}
