import { useQuery } from '@tanstack/react-query'

import { listProductsOptions } from '@/features/products/api/queryOptions'

export const ProductsPage = () => {
  const { data, isLoading, error } = useQuery(listProductsOptions())
  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Failed to load products</p>
  return (
    <ul>
      {data?.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}
