// Public API for products feature
// Only import from this file when using products feature from outside

// API - Query options and mutations for data fetching
export { listProductsOptions, productDetailOptions } from './queries'
export { useCreateProduct } from './mutations'

export type { Product, CreateProductInput, ProductFilters } from './models'

export { productSchema, createProductInputSchema } from './schemas'

// Note: service, formatProductName, and internal implementation details are NOT exported
// They are private to this feature
