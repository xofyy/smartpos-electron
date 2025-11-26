import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.number().optional(),
  barcode: z.string().min(1, 'Barcode is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  stock: z.number(),
  category: z.string().min(1, 'Category is required'),
  is_deleted: z.boolean().optional()
})

export const CartItemSchema = ProductSchema.extend({
  id: z.number(),
  quantity: z.number().min(1, 'Quantity must be at least 1')
})

export const SaleSchema = z.object({
  id: z.number().optional(),
  uuid: z.string().optional(),
  date: z.string().optional(),
  total_amount: z.number().min(0),
  payment_method: z.enum(['cash', 'card']),
  items: z.array(CartItemSchema).min(1, 'Sale must have at least one item')
})
