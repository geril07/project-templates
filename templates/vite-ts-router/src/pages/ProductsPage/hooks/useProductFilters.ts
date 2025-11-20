import { useNavigate, useSearch } from '@tanstack/react-router'

import type { ProductPageFilters } from '../types'

export const useProductFilters = () => {
  const search = useSearch({ strict: false })
  const navigate = useNavigate()

  const filters = search as ProductPageFilters

  const setFilters = (newFilters: Partial<ProductPageFilters>) => {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: { ...filters, ...newFilters } as any,
    })
  }

  return {
    filters,
    setFilters,
  }
}
