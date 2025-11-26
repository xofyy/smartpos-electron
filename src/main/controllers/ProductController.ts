import { IProductRepository } from '../repositories/ProductRepository'
import { Product } from '../../shared/types'

import { ProductSchema } from '../../shared/schemas'

export class ProductController {
  constructor(private productRepository: IProductRepository) {}

  async getAll() {
    return await this.productRepository.getAll()
  }

  async add(product: Product) {
    const validatedProduct = ProductSchema.parse(product)
    return await this.productRepository.add(validatedProduct)
  }

  async update(product: Product) {
    const validatedProduct = ProductSchema.parse(product)
    return await this.productRepository.update(validatedProduct)
  }

  async delete(id: number) {
    return await this.productRepository.delete(id)
  }

  async getByBarcode(barcode: string) {
    return await this.productRepository.getByBarcode(barcode)
  }
}
