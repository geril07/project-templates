import { apiClient } from '@/lib/ky'

import type { CreateProductInput, Product } from './types'

export const fetchAllProducts = async (params?: {
  q?: string
}): Promise<Product[]> => {
  return apiClient.get('products', { searchParams: params }).json<Product[]>()
}

export const fetchProductById = async (id: string): Promise<Product> => {
  return apiClient.get(`products/${id}`).json<Product>()
}

export const createProduct = async (
  input: CreateProductInput,
): Promise<Product> => {
  return apiClient.post('products', { json: input }).json<Product>()
}

export const productService = {
  fetchAll: fetchAllProducts,
  fetchById: fetchProductById,
  create: createProduct,
}
