# Agent Coding Guidelines

This template includes conventions and ready-to-copy examples to help agents contribute quickly and consistently. If you’re unsure how something should look, check the “Examples” under each section.

## 1. Commands

| Action          | Command                      | Notes                                            |
| :-------------- | :--------------------------- | :----------------------------------------------- |
| **Build**       | `npm run build`              | Runs `vite build` after type-checking.           |
| **Lint**        | `npm run lint`               | Runs ESLint for code quality checks.             |
| **Type Check**  | `npm run typecheck`          | Runs `tsc -b` for TypeScript compilation checks. |
| **Format**      | `npm run format`             | Auto-formats all files using Prettier.           |
| **Test**        | `vitest`                     | Runs all unit tests.                             |
| **Single Test** | `vitest <path/to/test/file>` | Run a specific test file.                        |

Example usage during a change:

```
npm run typecheck
npm run lint
npm run format
vitest src/features/auth/hooks/useLogin.test.ts
npm run build
```

## 2. Code Style & Conventions

– Language: TypeScript/TSX with strong typing.

– Formatting: Prettier with single quotes, no semicolons, trailing commas `all`.

– Imports: Three groups in order with a blank line between groups:

```
// 1) third-party
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

// 2) local aliases (start with @/)
import { apiBaseUrl } from '@/constants/api'
import { queryClient } from '@/lib/tanstackQuery'

// 3) relative paths
import { LoginForm } from '../components/LoginForm'
import { useLogin } from '../hooks/useLogin'
```

– Naming: `camelCase` for variables/functions; `PascalCase` for components, types, interfaces.

– Interfaces vs types: Prefer `interface` for object shapes and public contracts. Use `type` for unions, primitives, tuples, and complex utility compositions.
\n+– Functions: Prefer arrow functions (`const fn = () => {}`) for components, hooks, and utilities. Reserve `function` declarations only when hoisting or `this` binding is required.

– Error handling: Prefer typed errors and narrow catches.

Example (typed error and safe parsing):

```
interface ApiError { message: string }

export const safeJson = async <T>(res: Response): Promise<T> => {
  try {
    return (await res.json()) as T
  } catch {
    throw new Error('Invalid JSON response')
  }
}

export const example = async (): Promise<void> => {
  try {
    // ...
  } catch (e) {
    const err = e as Error
    console.error(err.message)
    throw err
  }
}
```

## 3. Structure & Examples

The codebase is domain-oriented under `src/features/` with shared utilities in `src/lib/` and global configuration in `src/constants/`. Routes live in `src/routes/`.

High-level layout:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   └── useLogin.ts
│   │   └── api/
│   │       └── login.ts
│   └── products/
│       ├── components/
│       ├── hooks/
│       └── api/
├── lib/
│   ├── ky.ts
│   └── tanstackQuery.ts
├── constants/
│   └── api.ts
├── routes/
│   ├── __root.tsx
│   └── auth.login.tsx
└── main.tsx
```

### 3.1 Components (PascalCase)

```
// src/features/auth/components/LoginForm.tsx
import { useState } from 'react'

interface Props { onSubmit: (email: string, password: string) => void }

export const LoginForm = ({ onSubmit }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(email, password)
      }}
    >
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}
```

### 3.2 Hooks (camelCase)

```
// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query'
import { login } from '../api/login'

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login({ email, password }),
  })
```

### 3.3 API modules

```
// src/features/auth/api/login.ts
import ky from '@/lib/ky'
import { apiBaseUrl } from '@/constants/api'

interface LoginRequest { email: string; password: string }
interface LoginResponse { token: string }

export const login = async (body: LoginRequest): Promise<LoginResponse> =>
  ky.post(`${apiBaseUrl}/auth/login`, { json: body }).json<LoginResponse>()
```

### 3.4 Shared libs

```
// src/lib/ky.ts
import Ky from 'ky'

const ky = Ky.create({
  headers: { 'Content-Type': 'application/json' },
  retry: { limit: 1 },
})

export default ky
```

```
// src/lib/tanstackQuery.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
})
```

### 3.5 Constants

```
// src/constants/api.ts
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
```

### 3.6 Routing (TanStack Router)

```
// src/routes/auth.login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useLogin } from '@/features/auth/hooks/useLogin'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

const LoginPage = () => {
  const { mutate, isPending, error } = useLogin()
  return (
    <div>
      <h1>Login</h1>
      {error ? <p>Failed: {(error as Error).message}</p> : null}
      <LoginForm
        onSubmit={(email, password) => mutate({ email, password })}
      />
      {isPending ? <p>Signing in…</p> : null}
    </div>
  )
}
```

### 3.7 App bootstrap

```
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { queryClient } from '@/lib/tanstackQuery'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
```

## 4. Testing

Run all tests: `vitest`

Run a single test: `vitest src/features/auth/hooks/useLogin.test.ts`

Example test file:

```
// src/features/auth/hooks/useLogin.test.ts
import { describe, expect, it } from 'vitest'

describe('useLogin', () => {
  it('placeholder', () => {
    expect(true).toBe(true)
  })
})
```

## 5. Agent Workflow

1. Make focused changes per feature directory.

2. Validate locally:

```
npm run typecheck && npm run lint && npm run format && vitest
```

3. Keep imports ordered in three groups with blank lines.

4. Favor strong typing for component props, API inputs/outputs, and hook returns.

5. Handle runtime errors with minimal, user-facing messaging where appropriate.

## 6. Scope & Precedence

These guidelines apply to all files under this repository. If a more specific `AGENTS.md` exists in a subdirectory, its rules take precedence for files in that subtree. Direct developer or user instructions supersede any `AGENTS.md` guidance.

## Env Vars

- Vite only exposes vars prefixed with `VITE_`.
- Define app config in `.env`/`.env.local` using `VITE_` prefix.
- Template includes `.env.example` with `VITE_API_BASE_URL`.
- Access with `import.meta.env.VITE_API_BASE_URL` and centralize usage in `src/constants/api.ts` as `apiBaseUrl`.

## 7. API Structure (Per Feature)

For each feature, colocate API concerns under `src/features/<domain>/api/` using option factories for queries and hook-based mutations. Keep UI/hooks separate from API. Default layout:

```
src/features/<domain>/api/
├── queryOptions.ts   // Factories for useQuery options
└── mutations.ts      // useMutation hooks (uses useQueryClient)
```

Rationale

- Options-first: return `queryOptions`/`mutationOptions` to keep hooks/UI thin.
- Testable: pure option factories are easy to unit test.
- Reusable: same options can be used in loaders, prefetching, or components.

Example: products (inline query keys)

```
// src/features/products/api/queryOptions.ts
import { queryOptions } from '@tanstack/react-query'
import ky from '@/lib/ky'
import { apiBaseUrl } from '@/constants/api'
import { throwApiResponseErrFromKyErr } from '@/utils/errors/apiErrorResponse'

export interface Product { id: string; name: string }

export const listProductsOptions = (params?: { q?: string }) =>
  queryOptions({
    queryKey: ['products', 'list', params] as const,
    queryFn: async (): Promise<Product[]> => {
      try {
        return await ky
          .get(`${apiBaseUrl}/products`, { searchParams: params })
          .json<Product[]>()
      } catch (e) {
        await throwApiResponseErrFromKyErr(e)
        throw e
      }
    },
    staleTime: 5 * 60 * 1000,
  })

export const productDetailOptions = (id: string) =>
  queryOptions({
    queryKey: ['products', 'detail', id] as const,
    queryFn: async (): Promise<Product> => {
      try {
        return await ky.get(`${apiBaseUrl}/products/${id}`).json<Product>()
      } catch (e) {
        await throwApiResponseErrFromKyErr(e)
        throw e
      }
    },
  })
```

```
// src/features/products/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/ky'
import type { CreateProductInput, Product } from '../types'
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProductInput) =>
      apiClient.post('products', { json: input }).json<Product>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

Usage in hooks/components

```
// src/features/products/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { listProductsOptions } from '../api/queryOptions'
import { useCreateProduct } from '../api/mutations'

export const useProducts = (params?: { q?: string }) => {
  const query = useQuery(listProductsOptions(params))
  const createMutation = useCreateProduct()
  return { ...query, createMutation }
}
```

Notes

- Keep domain-specific types under `src/features/<domain>/types/`.
- Surface errors via `ApiResponseError` and extract `detail` with `getDetailFromApiResponseError` in UI.
- Prefer `interface` for request/response shapes; use `type` for unions or Zod `z.infer` outputs.
- Declare query keys inline in `queryOptions.ts` to keep things simple; introduce a dedicated `keys.ts` only if keys become complex and shared across multiple modules.

Housekeeping

- Remove empty interfaces. If a shape only extends another without adding fields, use a `type` alias (e.g., `export type CreateProductResponse = ProductResponse`).

## 8. Services (Domain Logic)

Add a service layer when a feature needs domain logic that should not live in React hooks or the API client (e.g., orchestration, transformations, policies, multi-call flows).

Directory options

- Flat (default for a single service):

```
src/features/<domain>/
└── <domain>Service.ts
```

- Folder (when you need multiple services):

```
src/features/<domain>/services/
├── <domain>Service.ts      // main domain orchestration
├── pricingService.ts       // another cohesive area
└── inventoryService.ts     // another cohesive area
```

Guidelines

- Framework-agnostic: no React imports.
- Depend on `api/` and other services, not on components/hooks.
- Prefer simple exported functions over classes to reduce complexity.
- Define request/response shapes with `interface` and keep return types explicit.
- If grouping helps, export a plain object of functions (no need for classes).
- Naming: use `<domain>Service.ts` for the primary unit; additional files should reflect their focus (`pricingService.ts`, `inventoryService.ts`).
- Choosing flat vs folder: start flat; promote to a `services/` folder once you have more than one service file or the single file becomes unwieldy (>300 lines or unrelated concerns).

Example: products service (function-first, flat)

```
// src/features/products/productService.ts
import ky from '@/lib/ky'
import { apiBaseUrl } from '@/constants/api'
import { throwApiResponseErrFromKyErr } from '@/utils/errors/apiErrorResponse'

export interface Product { id: string; name: string }
export interface CreateProductInput { name: string }

export const fetchAllProducts = async (params?: { q?: string }): Promise<Product[]> => {
  try {
    return await ky.get(`${apiBaseUrl}/products`, { searchParams: params }).json<Product[]>()
  } catch (e) {
    await throwApiResponseErrFromKyErr(e)
    throw e
  }
}

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    return await ky.get(`${apiBaseUrl}/products/${id}`).json<Product>()
  } catch (e) {
    await throwApiResponseErrFromKyErr(e)
    throw e
  }
}

export const createProduct = async (input: CreateProductInput): Promise<Product> => {
  try {
    return await ky.post(`${apiBaseUrl}/products`, { json: input }).json<Product>()
  } catch (e) {
    await throwApiResponseErrFromKyErr(e)
    throw e
  }
}

// Optional: grouped export if you prefer an object
export const productService = {
  fetchAll: fetchAllProducts,
  fetchById: fetchProductById,
  create: createProduct,
}
```

Using services inside API options

```
// src/features/products/api/queryOptions.ts
import { queryOptions } from '@tanstack/react-query'
import { fetchAllProducts } from '../productService'

export const listProductsOptions = (params?: { q?: string }) =>
  queryOptions({
    queryKey: ['products', 'list', params] as const,
    queryFn: () => fetchAllProducts(params),
  })
```

When to add a service

- You need to combine multiple API calls into one flow.
- Significant data transformation or business rules are applied.
- You want reusability across hooks, loaders, and server actions.

## 9. Contexts

Use React Contexts sparingly for cross-component state that is truly shared (auth, theming, feature-level shared state). Prefer props and hooks for local state. This template includes a small factory to eliminate boilerplate when creating contexts.

Factory utility

```
// src/utils/contextFactory.ts
import { createContext, useContext } from 'react'

export const createContextFactory = <T,>(name = 'Context') => {
  const Context = createContext<T | undefined>(undefined)

  const useContextHook = () => {
    const context = useContext(Context)
    if (context === undefined) {
      throw new Error(`${name} must be used within Provider`)
    }
    return context
  }

  return { Context, useContextHook }
}
```

Feature-scoped context (recommended)

```
// src/features/auth/AuthContext.tsx
import { ReactNode, useMemo } from 'react'
import { createContextFactory } from '@/utils/contextFactory'

interface AuthValue { token: string | null }

const { Context: AuthContext, useContextHook: useAuth } = createContextFactory<AuthValue>('AuthContext')

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo<AuthValue>(() => ({ token: null }), [])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { useAuth }
```

Usage in components

```
// src/features/auth/components/UserMenu.tsx
import { useAuth } from '@/features/auth/AuthContext'

export const UserMenu = () => {
  const { token } = useAuth()
  return <div>{token ? 'Signed in' : 'Guest'}</div>
}
```

Global contexts (optional)

- If a context is app-wide and reused across multiple domains, colocate under `src/lib/contexts/` or `src/contexts/` (team preference). Keep the same factory pattern and export a provider and hook.
- Keep values small and stable; prefer context for references to services, clients, or small state, not large data graphs.
- Use `interface` for context value types.

## 10. Pages vs Routes

We use TanStack Router files in `src/routes/` for routing definitions and keep page UI components in `src/pages/`. Pages assemble feature components and hooks; they should contain minimal domain logic.

Why this split

- Routes: framework-specific wiring (loaders, params, route config).
- Pages: presentational/compositional UI for a route, easy to test and reuse.
- Features: domain logic and UI atoms/molecules stay inside `src/features/<domain>`.

Structure

```
src/
├── routes/
│   ├── __root.tsx
│   └── products.index.tsx    // route definitions only
├── pages/
│   └── ProductsPage.tsx      // UI for the route
└── features/
    └── products/
        ├── components/
        ├── hooks/
        └── api/
```

Example

```
// src/pages/ProductsPage.tsx
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
```

```
// src/routes/products.index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/pages/ProductsPage'

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
})
```

Guidelines

- Keep pages thin; delegate to features for data fetching and domain components.
- Avoid exporting pages from `features/` to reduce cross-domain coupling.
- Use `src/pages/` for top-level navigable screens; smaller subviews can live inside features.

## 11. Feature Types & Schemas

Define runtime validation with Zod and keep domain model types colocated with each feature, under a dedicated `types/` folder for clarity.

Layout (per feature)

```
src/features/<domain>/
├── schemas.ts           // zod schemas for runtime validation
└── types/
    ├── models.ts       // core domain interfaces (entities, value objects)
    ├── api.ts          // request/response interfaces; zod-inferred types
    └── index.ts        // re-exports for convenience
```

Guidelines

- Prefer `interface` for object shapes you author manually and expose publicly within the feature.
- Use Zod for parsing/validation at the boundaries (API responses, forms).
- Exception to the interface rule: when deriving from Zod, use `type` with `z.infer<>` (TypeScript cannot create an interface from an inferred type).
- Keep schemas minimal and reusable; compose smaller schemas.

Naming

- `models.ts`: persistent/core entities, domain models, view models.
- `api.ts`: transport-level shapes (requests/responses), zod-inferred types.
- `index.ts`: re-export selected types to simplify imports.

Example

```
// src/features/products/schemas.ts
import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
})

export const createProductInputSchema = z.object({
  name: z.string().min(1),
})
```

```
// src/features/products/types/models.ts
import { z } from 'zod'
import { productSchema, createProductInputSchema } from '../schemas'

// Manually authored shapes should prefer interface
export interface ProductFilters {
  q?: string
}

// Exception: using type here to reflect zod inference
export type Product = z.infer<typeof productSchema>
export type CreateProductInput = z.infer<typeof createProductInputSchema>

```

```
// src/features/products/types/api.ts
export interface ProductResponse {
  id: string
  name: string
}

export interface CreateProductRequest {
  name: string
}

export interface CreateProductResponse extends ProductResponse {}
```

```
// src/features/products/types/index.ts
export * from './models'
export * from './api'
```

Using schemas at API boundaries

```
// src/features/products/api/queryOptions.ts
import { queryOptions } from '@tanstack/react-query'
import ky from '@/lib/ky'
import { apiBaseUrl } from '@/constants/api'
import { productSchema } from '../schemas'
import type { Product } from '../types'

export const productDetailOptions = (id: string) =>
  queryOptions({
    queryKey: ['products', 'detail', id] as const,
    queryFn: async (): Promise<Product> => {
      const data = await ky.get(`${apiBaseUrl}/products/${id}`).json()
      return productSchema.parse(data)
    },
  })
```

## 12. Domain Utilities

Colocate small, pure helpers under each feature. Use these for formatting, small calculations, and deterministic transforms.

Layout

```
src/features/<domain>/utils/
└── <helperName>.ts
```

Guidelines

- Keep functions pure and side-effect free.
- Prefer small, focused utilities; promote shared ones to `src/lib/` when used by 3+ features.
- Add unit tests in the same feature folder when useful.

Example

```
// src/features/products/utils/formatProductName.ts
export const formatProductName = (name: string) => name.trim()
```
