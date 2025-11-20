import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createProduct } from '../services'
import type { CreateProductInput } from '../types'

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
