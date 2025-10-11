import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/lib/ky'

import type { CreateProductInput, Product } from '../types'

// invalidate all product queries by the shared prefix

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProductInput) =>
      apiClient.post('products', { json: input }).json<Product>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
