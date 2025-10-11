export interface ProductResponse {
  id: string
  name: string
}

export interface CreateProductRequest {
  name: string
}

export type CreateProductResponse = ProductResponse
