import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateProductInput } from './models'
import { createProduct } from './service'

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
