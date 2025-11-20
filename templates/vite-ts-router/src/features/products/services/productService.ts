import { apiClient } from '@/shared/api'
import { throwApiResponseErrFromKyErr } from '@/shared/utils/errors/apiErrorResponse'

import type { CreateProductInput, Product } from '../types'

export const fetchAllProducts = async (params?: {
  q?: string
}): Promise<Product[]> =>
  apiClient
    .get('products', { searchParams: params })
    .json<Product[]>()
    .catch(throwApiResponseErrFromKyErr)

export const fetchProductById = async (id: string): Promise<Product> =>
  apiClient
    .get(`products/${id}`)
    .json<Product>()
    .catch(throwApiResponseErrFromKyErr)

export const createProduct = async (
  input: CreateProductInput,
): Promise<Product> =>
  apiClient
    .post('products', { json: input })
    .json<Product>()
    .catch(throwApiResponseErrFromKyErr)

export const productService = {
  fetchAll: fetchAllProducts,
  fetchById: fetchProductById,
  create: createProduct,
}
