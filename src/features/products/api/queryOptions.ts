import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/lib/ky'

import { productSchema } from '../schemas'
import type { Product } from '../types'

export const listProductsOptions = (params?: { q?: string }) =>
  queryOptions({
    queryKey: ['products', 'list', params] as const,
    queryFn: async (): Promise<Product[]> => {
      const data = await apiClient
        .get('products', { searchParams: params })
        .json()
      return productSchema.array().parse(data)
    },
  })

export const productDetailOptions = (id: string) =>
  queryOptions({
    queryKey: ['products', 'detail', id] as const,
    queryFn: async (): Promise<Product> => {
      const data = await apiClient.get(`products/${id}`).json()
      return productSchema.parse(data)
    },
  })
