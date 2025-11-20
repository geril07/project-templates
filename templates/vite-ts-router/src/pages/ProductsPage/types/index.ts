import { z } from 'zod'

// URL search params schema for products page
export const productPageFiltersSchema = z.object({
  q: z.string().optional(),
})

export type ProductPageFilters = z.infer<typeof productPageFiltersSchema>
