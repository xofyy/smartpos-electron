import { ISalesRepository } from '../repositories/SalesRepository'
import { Sale } from '../../shared/types'

import { SaleSchema } from '../../shared/schemas'

export class SalesController {
  constructor(private salesRepository: ISalesRepository) {}

  async processSale(sale: Sale) {
    const validatedSale = SaleSchema.parse(sale)
    return await this.salesRepository.processSale(validatedSale)
  }
}
