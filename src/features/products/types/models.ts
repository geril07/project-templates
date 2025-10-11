import { z } from 'zod'

import { createProductInputSchema, productSchema } from '../schemas'

export interface ProductFilters {
  q?: string
}

export type Product = z.infer<typeof productSchema>
export type CreateProductInput = z.infer<typeof createProductInputSchema>
