import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
})

export const createProductInputSchema = z.object({
  name: z.string().min(1),
})
