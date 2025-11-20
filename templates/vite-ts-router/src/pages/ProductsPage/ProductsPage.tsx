import { useQuery } from '@tanstack/react-query'

import { listProductsOptions } from '@/features/products'

import { useProductFilters } from './hooks/useProductFilters'

export const ProductsPage = () => {
  const { filters, setFilters } = useProductFilters()
  const { data, isLoading, error } = useQuery(listProductsOptions(filters))

  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Failed to load products</p>

  return (
    <div>
      <input
        type="text"
        value={filters.q ?? ''}
        onChange={(e) => setFilters({ q: e.target.value || undefined })}
        placeholder="Search products..."
      />
      <ul>
        {data?.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
