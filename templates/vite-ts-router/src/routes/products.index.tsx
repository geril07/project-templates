import { createFileRoute } from '@tanstack/react-router'

import { ProductsPage } from '@/pages/ProductsPage'
import type { ProductPageFilters } from '@/pages/ProductsPage'

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductPageFilters => ({
    q: (search.q as string) || undefined,
  }),
})
