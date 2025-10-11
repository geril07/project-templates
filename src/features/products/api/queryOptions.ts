import { queryOptions } from '@tanstack/react-query'

import { productSchema } from '../schemas'
import type { Product } from '../types'
import { fetchAllProducts, fetchProductById } from '../productService'

export const listProductsOptions = (params?: { q?: string }) =>
  queryOptions({
    queryKey: ['products', 'list', params] as const,
    queryFn: async (): Promise<Product[]> => fetchAllProducts(params),
  })

export const productDetailOptions = (id: string) =>
  queryOptions({
    queryKey: ['products', 'detail', id] as const,
    queryFn: async (): Promise<Product> => fetchProductById(id),
  })
