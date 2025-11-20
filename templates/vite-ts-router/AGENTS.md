# AGENTS.md (compact version)

## 1. Commands

| Action      | Command                 |
| ----------- | ----------------------- |
| Build       | `npm run build`         |
| Lint        | `npm run lint`          |
| Type Check  | `npm run typecheck`     |
| Format      | `npm run format`        |
| Test        | `vitest`                |
| Single Test | `vitest <path/to/test>` |

## 2. Code Style & Conventions

- **Language**: TypeScript/TSX, strong typing.
- **Formatting**: Prettier, single quotes, no semicolons, trailing commas `all`.
- **Imports**: Three groups (third‑party, local aliases `@/…`, relative) with a blank line between groups.
- **Naming**: `camelCase` for vars/functions, `PascalCase` for components/types.
- **Interfaces vs Types**: Prefer `interface` for object shapes, `type` for unions, primitives, tuples.
- **Functions**: Arrow functions for components/hooks/utilities; `function` only when hoisting or `this` needed.
- **Error handling**: Typed errors, narrow catches.
- **Class names**: Use `clsx` when composing class names.

## 3. Project Structure (Fractal Architecture)

```
src/
├─ features/          # Self-contained business domains
│  └─ <feature>/      # e.g., products, orders, auth
│     ├─ api/         # React Query integration
│     ├─ components/  # Feature-specific UI
│     ├─ hooks/       # Feature-specific hooks
│     ├─ schemas/     # Zod validation schemas
│     ├─ services/    # Business logic & API calls
│     ├─ types/       # TypeScript types
│     ├─ utils/       # Feature-specific utilities
│     └─ index.ts     # ⭐ PUBLIC API - only entry point
├─ pages/             # Composition layer - orchestrates features
├─ shared/            # Infrastructure & truly shared code
│  ├─ api/            # HTTP client (ky)
│  ├─ query/          # TanStack Query setup
│  ├─ router/         # TanStack Router setup
│  ├─ config/         # Environment & constants
│  ├─ types/          # Global TypeScript types
│  └─ utils/          # Generic utilities
├─ routes/            # TanStack Router definitions (thin)
└─ main.tsx           # App bootstrap
```

**Key Principles:**

- Each feature is self-contained with all related code colocated
- Features export public API via `index.ts` - import only from there
- Pages compose multiple features together
- No cross-feature imports (feature → feature ❌)
- Services and schemas organized in folders, not flat files

## 4. Testing

- Run all tests: `vitest`
- Run a single test: `vitest <path>`

## 5. Agent Workflow

1. Make focused changes per feature.
2. Validate locally: `npm run typecheck && npm run lint && npm run format && vitest`.
3. Keep imports ordered in three groups.
4. Use strong typing for props, API I/O, hook returns.
5. Minimal user‑facing error messages.

## 6. Scope & Precedence

- Rules apply repo‑wide unless a more specific `AGENTS.md` exists in a subdirectory; that file overrides the root rules. Direct developer/user instructions supersede any guideline.

## 7. Env Vars

- Vite only exposes variables prefixed with `VITE_`.
- Define them in `.env`/`.env.local` and centralize usage in `src/constants/api.ts` as `apiBaseUrl`.

## 8. API Structure (per feature)

```
src/features/<domain>/api/
├─ queryOptions.ts   # factories for `useQuery` options
└─ mutations.ts     # `useMutation` hooks (uses `useQueryClient`)
```

- Keep UI/hooks separate from API.
- Export `queryOptions`/`mutationOptions` for thin hooks and easy testing.

## 9. Services (domain logic)

- Add a service layer when logic doesn't belong in React hooks or API client.
- Prefer plain functions; avoid React imports.
- Place services in `src/features/<domain>/services/` folder with `index.ts` re-export.
- Example: `src/features/products/services/productService.ts`
- Export interfaces for request/response shapes; keep return types explicit.

## 10. Contexts

- Use React Context sparingly (auth, theming, shared feature state).
- Create via `createContextFactory` (in `src/shared/utils/contextFactory.ts`).
- Feature‑scoped contexts live under the feature folder; global contexts under `src/shared/contexts/`.

## 11. Pages Structure & Organization

### Pages vs Routes

- **Routes** (`src/routes/`): TanStack Router wiring (loaders, params, validation, config).
- **Pages** (`src/pages/`): Composition layer - orchestrates features, manages URL state, minimal domain logic.
- Keep pages thin; delegate business logic to features.

### Page Folder Structure (Always Use Folders)

**All pages must use folder structure, never flat files:**

```
src/pages/
├─ ProductsPage/
│  ├─ ProductsPage.tsx        # Main page component
│  ├─ index.ts                # Public export
│  ├─ hooks/                  # Page-specific hooks
│  │  └─ useProductFilters.ts # URL state management
│  ├─ types/                  # Page-specific types (URL params, view models)
│  │  └─ index.ts
│  └─ components/             # Page-specific composition widgets (optional)
│     └─ ProductFilters.tsx
└─ HomePage/
   ├─ HomePage.tsx            # Simple page - still uses folder
   └─ index.ts
```

### When Pages Need Internal Structure

**Pages should have internal structure when they:**

1. **Manage URL state** (search params, filters, pagination)
   - Create `hooks/usePageFilters.ts` for search param management
   - Create `types/` for URL param schemas (use Zod)

2. **Orchestrate multiple features**
   - Create `hooks/usePageData.ts` to combine feature queries
   - Keep orchestration logic separate from components

3. **Have page-specific components**
   - Create `components/` for page-specific composition widgets
   - Components that combine multiple feature components

4. **Transform feature data for presentation**
   - Create `utils/` for page-specific transformations
   - View models that don't belong in features

### Example: URL State Management

```typescript
// pages/ProductsPage/types/index.ts
import { z } from 'zod'

export const productPageFiltersSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(['name', 'price']).optional(),
})

export type ProductPageFilters = z.infer<typeof productPageFiltersSchema>

// pages/ProductsPage/hooks/useProductFilters.ts
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { ProductPageFilters } from '../types'

export const useProductFilters = () => {
  const search = useSearch({ strict: false })
  const navigate = useNavigate()
  const filters = search as ProductPageFilters

  const setFilters = (newFilters: Partial<ProductPageFilters>) => {
    navigate({ search: { ...filters, ...newFilters } as any })
  }

  return { filters, setFilters }
}

// pages/ProductsPage/ProductsPage.tsx
import { useQuery } from '@tanstack/react-query'
import { listProductsOptions } from '@/features/products'
import { useProductFilters } from './hooks/useProductFilters'

export const ProductsPage = () => {
  const { filters, setFilters } = useProductFilters()
  const { data } = useQuery(listProductsOptions(filters))

  return (
    <div>
      <input
        value={filters.q ?? ''}
        onChange={(e) => setFilters({ q: e.target.value || undefined })}
      />
      {/* render products */}
    </div>
  )
}

// routes/products.index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage, type ProductPageFilters } from '@/pages/ProductsPage'

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductPageFilters => ({
    q: (search.q as string) || undefined,
    category: (search.category as string) || undefined,
    sort: (search.sort as 'name' | 'price') || undefined,
  }),
})
```

### What Belongs in Pages vs Features

| Concern                   | Page                  | Feature          |
| ------------------------- | --------------------- | ---------------- |
| Business logic            | ❌                    | ✅               |
| API calls                 | ❌                    | ✅               |
| URL state management      | ✅                    | ❌               |
| Search params parsing     | ✅                    | ❌               |
| Multi-feature composition | ✅                    | ❌               |
| Reusable components       | ❌                    | ✅               |
| Page-specific widgets     | ✅                    | ❌               |
| View transformations      | ✅ (if page-specific) | ✅ (if reusable) |

## 12. Feature Types & Schemas

- Use Zod for runtime validation; keep schemas in `schemas/` folder.
- Example: `src/features/products/schemas/productSchema.ts` with `index.ts` re-export.
- Colocate TypeScript types under `types/`:
  - `models.ts` – core domain types (use `z.infer<>` from schemas to avoid duplication).
  - `index.ts` – re‑exports.
- Prefer using Zod as single source of truth for data shapes; use `type` for Zod‑inferred types.
- Only use manual `interface` definitions for shapes that don't need runtime validation.

## 13. Components Structure

- Global UI primitives under `src/shared/components/ui/`.
- Feature‑specific components under `src/features/<domain>/components/`.
- One component per folder; keep primitives (`ui/`) stateless and accessible.
- Prefer arrow‑function components; type props with `interface`.

## 14. Stores

- Prefer React Query for server state.
- Use a client store (e.g., Zustand) only for UI state that isn't derived from queries/props.
- Domain stores: `src/features/<domain>/store/<name>Store.ts`.
- Global stores (rare): `src/shared/state/`.
- Keep stores minimal, serializable, and typed.

## 15. Import Rules & Boundaries

**Allowed Import Patterns:**

- ✅ Feature → Shared: `import { apiClient } from '@/shared/api'`
- ✅ Page → Feature: `import { ProductList } from '@/features/products'`
- ✅ Page → Shared: `import { Button } from '@/shared/components/ui'`
- ✅ Route → Page: `import { ProductsPage } from '@/pages/ProductsPage'`

**Forbidden Import Patterns:**

- ❌ Feature → Feature: Features must not import from each other
- ❌ Shared → Feature: Shared code cannot depend on features
- ❌ Bypassing Public API: `import { ... } from '@/features/products/services'` (must use `@/features/products`)

## 16. Feature Public API

Every feature must export a public API via `index.ts`:

```typescript
// src/features/products/index.ts
// Query options - for routes and external hooks
export { listProductsOptions, productDetailOptions } from './api/queryOptions'
export { useCreateProduct } from './api/mutations'

// Components - only if reusable outside feature
export { ProductCard } from './components/ProductCard'

// Types - public contracts
export type { Product, CreateProductInput } from './types'

// Schemas - for external validation
export { productSchema } from './schemas'

// NOTE: services/, internal components, utils are NOT exported
```

**Rules:**

- Only export what's needed outside the feature
- Services are implementation details - don't export them
- Internal utilities stay internal
- Components are exported selectively

## 17. Pages as Composition Layer

Pages orchestrate multiple features:

```typescript
// src/pages/DashboardPage.tsx
import { ProductList } from '@/features/products'
import { OrderList } from '@/features/orders'
import { useAuth } from '@/features/auth'
import { Card } from '@/shared/components/ui'

export const DashboardPage = () => {
  const { user } = useAuth()
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <Card><ProductList limit={5} /></Card>
      <Card><OrderList limit={5} /></Card>
    </div>
  )
}
```

- Pages can use multiple features
- Pages handle feature composition and layout
- Keep business logic in features, not pages

## 18. Assets & Styles

**Assets Organization:**

- Feature-specific assets: `src/features/<domain>/assets/` (images/icons used only in that feature)
- Shared assets: `src/shared/assets/` (logos, shared icons, fonts)
  - `src/shared/assets/images/`
  - `src/shared/assets/icons/`
  - `src/shared/assets/fonts/`
- Static public assets: `public/` (favicon, robots.txt, files referenced in HTML)

**Styles Organization:**

- Global styles: `src/shared/styles/index.css` (imported in `main.tsx`)
- Component styles: Colocate with components using CSS Modules (`.module.css`)
- Feature styles: `src/features/<domain>/styles/` (if needed for feature-specific themes)

**Import Examples:**

```typescript
// Shared assets
import logo from '@/shared/assets/images/logo.svg'

// Component styles
import styles from './Button.module.css'
// Feature assets (within feature only)
import icon from './assets/icons/product.svg'
```
