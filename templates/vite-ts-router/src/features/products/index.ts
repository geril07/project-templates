// Public API for products feature
// Only import from this file when using products feature from outside

// API - Query options and mutations for data fetching
export { listProductsOptions, productDetailOptions } from './api/queryOptions'
export { useCreateProduct } from './api/mutations'

// Types - Public contracts
export type { Product, CreateProductInput, ProductFilters } from './types'

// Schemas - For validation (if needed externally)
export { productSchema, createProductInputSchema } from './schemas'

// Note: services, utils, and internal implementation details are NOT exported
// They are private to this feature
