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

## 11. Pages vs Routes

- **Routes** (`src/routes/`): TanStack Router wiring (loaders, params, config).
- **Pages** (`src/pages/`): Presentational UI for a route, minimal domain logic.
- Keep pages thin; delegate data fetching to feature hooks.

## 12. Feature Types & Schemas

- Use Zod for runtime validation; keep schemas in `schemas/` folder.
- Example: `src/features/products/schemas/productSchema.ts` with `index.ts` re-export.
- Colocate TypeScript types under `types/`:
  - `models.ts` – core domain interfaces.
  - `api.ts` – request/response shapes (often `z.infer<>`).
  - `index.ts` – re‑exports.
- Prefer `interface` for manually authored shapes; use `type` for Zod‑inferred types.

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
