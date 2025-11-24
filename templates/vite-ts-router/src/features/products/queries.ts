import { queryOptions } from '@tanstack/react-query'

import type { Product } from './models'
import { fetchAllProducts, fetchProductById } from './service'

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
