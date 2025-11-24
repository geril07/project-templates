# AGENTS.md (compact version)

## 1. Commands

| Action     | Command             |
| ---------- | ------------------- |
| Build      | `npm run build`     |
| Lint       | `npm run lint`      |
| Type Check | `npm run typecheck` |
| Format     | `npm run format`    |

## 2. Code Style & Conventions

- **Language**: TypeScript/TSX, strong typing.
- **Formatting**: Prettier, single quotes, no semicolons, trailing commas `all`.
- **Imports**: Three groups (third‑party, local aliases `@/…`, relative) with a blank line between groups.
- **Naming**: `camelCase` for vars/functions, `PascalCase` for components/types.
- **Interfaces vs Types**: Prefer `interface` for object shapes, `type` for unions, primitives, tuples.
- **Functions**: Arrow functions for components/hooks/utilities; `function` only when hoisting or `this` needed.
- **Error handling**: Typed errors, narrow catches.

## 3. Project Structure (Fractal Architecture)

```
src/
├─ features/          # Self-contained business domains
│  └─ <feature>/      # e.g., products, orders, auth
│     ├─ api/         # React Query integration
│     ├─ components/  # Feature-specific UI
│     ├─ hooks/       # Feature-specific hooks
│     ├─ schemas/     # Validation schemas
│     ├─ services/    # Business logic & API calls
│     ├─ types/       # TypeScript types
│     ├─ utils/       # Feature-specific utilities
│     └─ index.ts     # ⭐ PUBLIC API - only entry point
├─ pages/             # Composition layer - orchestrates features
├─ api/               # HTTP client setup (ky)
├─ query/             # TanStack Query setup
├─ router/            # TanStack Router setup
├─ routes/            # TanStack Router definitions (thin)
├─ assets/            # Shared assets (icons, images)
├─ components/        # Shared UI components
│  ├─ ui/             # Primitives (Button, Input)
│  └─ composites/     # Complex components (DataTable)
├─ constants/         # Environment & app constants
├─ styles/            # Global styles
├─ types/             # Global TypeScript types
├─ utils/             # Generic utilities
└─ main.tsx           # App bootstrap
```

**Key Principles:**

- Each feature is self-contained with all related code colocated
- Features export public API via `index.ts` - import only from there
- Pages compose multiple features together
- No cross-feature imports (feature → feature ❌)
- Services and schemas organized in folders, not flat files
- Infrastructure code (api, query, router) at root level for clarity

## 4. Agent Workflow

1. Make focused changes per feature.
2. Validate locally: `npm run typecheck && npm run lint && npm run format`.
3. Keep imports ordered in three groups.
4. Use strong typing for props, API I/O, hook returns.

## 5. Scope & Precedence

- Rules apply repo‑wide unless a more specific `AGENTS.md` exists in a subdirectory; that file overrides the root rules. Direct developer/user instructions supersede any guideline.

## 6. Env Vars

- Vite only exposes variables prefixed with `VITE_`.
- Define them in `.env`/`.env.local` and centralize usage in `src/constants/api.ts` as `apiBaseUrl`.

## 7. API Structure (per feature)

```
src/features/<domain>/api/
├─ queryOptions.ts   # factories for `useQuery` options
└─ mutations.ts     # `useMutation` hooks (uses `useQueryClient`)
```

- Keep UI/hooks separate from API.
- Export `queryOptions`/`mutationOptions` for thin hooks and easy testing.

## 8. Services (domain logic)

- Add a service layer when logic doesn't belong in React hooks or API client.
- Prefer plain functions; avoid React imports.
- Place services in `src/features/<domain>/services/` folder with `index.ts` re-export.
- Example: `src/features/products/services/productService.ts`
- Export interfaces for request/response shapes; keep return types explicit.

## 9. Contexts

- Use React Context sparingly (auth, theming, shared feature state).
- Create via `createContextFactory` (in `src/utils/contextFactory.ts`).
- Feature‑scoped contexts live under the feature folder.

## 10. Pages Structure & Organization

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
   - Create `types/` for URL param schemas

2. **Orchestrate multiple features**
   - Create `hooks/usePageData.ts` to combine feature queries
   - Keep orchestration logic separate from components

3. **Have page-specific components**
   - Create `components/` for page-specific composition widgets
   - Components that combine multiple feature components

4. **Transform feature data for presentation**
   - Create `utils/` for page-specific transformations
   - View models that don't belong in features

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

## 11. Feature Types & Schemas

- Colocate schemas in `schemas/` folder.
- Example: `src/features/products/schemas/productSchema.ts` with `index.ts` re-export.
- Colocate TypeScript types under `types/`:
  - `models.ts` – core domain types
  - `api.ts` – API request/response types
  - `index.ts` – re‑exports

## 12. Components Structure

### Global Components (`src/components/`)

```
components/
├── ui/                    # Primitives (Button, Input, Card)
└── composites/            # Complex components (DataTable, forms)
```

- **ui/**: Stateless primitives
- **composites/**: Logic-heavy wrappers (DataTable using TanStack Table)
- Structure flexible: flat files (`button.tsx`) or folders (`button/button.tsx` + `index.ts`)

### Feature Components (`src/features/<domain>/components/`)

- Domain-specific composites (uses ui/composites + domain data)
- **No cross-feature imports**
- Export selectively via `index.ts`

### Page Components (`src/pages/<PageName>/components/` - optional)

- Page-specific composition widgets
- Use when widget doesn't belong in feature or shared

### Rules

- **Public API**: Export via `index.ts` (barrel exports)
- **Stateless primitives** in ui/ (no React Query, no business logic)
- **Arrow functions**, `interface` props
- **No cross-feature imports**

## 13. Stores

- Prefer React Query for server state.
- Use a client store (e.g., Zustand) only for UI state that isn't derived from queries/props.
- Domain stores: `src/features/<domain>/store/<name>Store.ts`.
- Keep stores minimal, serializable, and typed.

## 14. Import Rules & Boundaries

**Allowed Import Patterns:**

- ✅ Feature → Shared: `import { apiClient } from '@/api'`
- ✅ Page → Feature: `import { ProductList } from '@/features/products'`
- ✅ Page → Shared: `import { Button } from '@/components/ui'`
- ✅ Route → Page: `import { ProductsPage } from '@/pages/ProductsPage'`

**Forbidden Import Patterns:**

- ❌ Feature → Feature: Features must not import from each other
- ❌ Shared → Feature: Shared code cannot depend on features
- ❌ Bypassing Public API: `import { ... } from '@/features/products/services'` (must use `@/features/products`)

## 15. Feature Public API

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

## 16. Pages as Composition Layer

Pages orchestrate multiple features:

```tsx
// src/pages/DashboardPage/DashboardPage.tsx
import { Card } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { OrderList } from '@/features/orders'
import { ProductList } from '@/features/products'

export const DashboardPage = () => {
  const { user } = useAuth()
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <Card>
        <ProductList limit={5} />
      </Card>
      <Card>
        <OrderList limit={5} />
      </Card>
    </div>
  )
}
```

- Pages can use multiple features
- Pages handle feature composition and layout
- Keep business logic in features, not pages

## 17. Assets & Styles

**Assets Organization:**

- Feature-specific assets: `src/features/<domain>/assets/` (images/icons used only in that feature)
- Shared assets: `src/assets/` (logos, shared icons, fonts)
  - `src/assets/images/`
  - `src/assets/icons/`
- Static public assets: `public/` (favicon, robots.txt, files referenced in HTML)
