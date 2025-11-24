import { apiClient } from '@/api'

import type { CreateProductInput, Product } from '../types'

export const fetchAllProducts = async (params?: {
  q?: string
}): Promise<Product[]> =>
  apiClient.get('products', { searchParams: params }).json<Product[]>()

export const fetchProductById = async (id: string): Promise<Product> =>
  apiClient.get(`products/${id}`).json<Product>()

export const createProduct = async (
  input: CreateProductInput,
): Promise<Product> =>
  apiClient.post('products', { json: input }).json<Product>()

export const productService = {
  fetchAll: fetchAllProducts,
  fetchById: fetchProductById,
  create: createProduct,
}
