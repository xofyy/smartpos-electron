import { ISalesRepository, Sale } from '../repositories/SalesRepository'

export class SalesController {
  constructor(private salesRepository: ISalesRepository) {}

  async processSale(sale: Sale) {
    // Business logic: e.g., check stock levels before processing
    if (!sale.items || sale.items.length === 0) {
      throw new Error('Sale must have items')
    }
    return await this.salesRepository.processSale(sale)
  }
}
