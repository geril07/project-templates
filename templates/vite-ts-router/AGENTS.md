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
- **Naming**: `camelCase` for vars/functions, `PascalCase` for components/types. Omit postfixes for sole files (e.g., `service.ts`).
- **Barrels**: Use `index.ts` for public feature API; explicit imports internally.
- **Interfaces vs Types**: Prefer `interface` for object shapes, `type` for unions, primitives, tuples.
- **Functions**: Arrow functions for components/hooks/utilities; `function` only when hoisting or `this` needed.
- **Error handling**: Typed errors, narrow catches.

## 3. Project Structure (Hybrid Guidelines)

```
src/
├─ features/          # Self-contained business domains
│  └─ <feature>/      # e.g., products (large), theme (small)
│     ├─ queries.ts   # React Query queries (or queries/ if multiple)
│     ├─ mutations.ts # React Query mutations (or mutations/ if multiple)
│     ├─ components/  # Optional: Feature-specific UI
│     ├─ hooks/       # Feature-specific hooks (flat or hooks/ if multiple)
│     ├─ service.ts   # Business logic (or services/ if multiple)
│     ├─ types.ts    # Core types (or types/ if multiple)
│     ├─ utils/       # Feature-specific utilities (only if >1)
│     └─ index.ts     # ⭐ PUBLIC API - barrel re-exports
├─ pages/             # Composition layer - orchestrates features
├─ api/               # Global HTTP client setup (ky)
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
- Infrastructure code (api, query, router) at root level for clarity
- Flat files by default (e.g., `service.ts`); subfolders only if aspect >1 file or messy

**When to Simplify:**

- Small features (<5 files): Flatten (e.g., `features/theme/useTheme.ts`, `themeConstants.ts`, `index.ts`).
- Large features: Hybrid—flat for single files (e.g., `service.ts`), subfolders for multiples (e.g., `services/userService.ts`).
- Naming: Omit postfixes for sole files (e.g., `service.ts` not `productService.ts`); add for distinction.
- Barrels: Public API only; use explicit imports internally to avoid hidden deps.

## 4. Agent Workflow

1. Make focused changes per feature.
2. Validate locally: `npm run typecheck && npm run lint && npm run format`.
3. Keep imports ordered in three groups.
4. Use strong typing for props, API I/O, hook returns.

## 5. Scope & Precedence

- Rules apply repo‑wide unless a more specific `AGENTS.md` exists in a subdirectory; that file overrides the root rules. Direct developer/user instructions supersede any guideline.

## 6. Env Vars

- Vite only exposes variables prefixed with `VITE_`.
- Define them in `.env`/`.env.local` and centralize usage in `src/constants/api.ts` as `API_BASE_URL`.

## 7. API Structure

- For React Query, use root-level `queries.ts`/`mutations.ts` in features (or `queries/`/`mutations/` if >1 file).
- Group by feature (e.g., `features/products/queries/productList.ts`).
- Global raw HTTP: Keep in `src/api/`.

## 8. Services (domain logic)

- Add a service layer when logic doesn't belong in React hooks or API client.
- Prefer plain functions; avoid React imports.
- Place at feature root as `service.ts` (or `services/` if multiple/domain-specific).
- Group by feature (e.g., `features/products/service.ts`).
- Export interfaces for request/response shapes; keep return types explicit.

## 9. Contexts

- Use React Context sparingly (auth, theming, shared feature state).
- Create via `createContextFactory` (in `src/utils/contextFactory.ts`).
- Feature-scoped: Flat `context.ts` (or `contexts/` if multiple).

## 10. Pages

- **Pages** (`src/pages/`): Composition layer, orchestrates features, manages URL state.
- **Routes** (`src/routes/`): TanStack Router wiring (loaders, params, validation).
- Pages always use folder structure with internal `hooks/`, `types/`, `components/`, `utils/` as needed.
- Keep pages thin; delegate business logic to features.

## 11. Feature Types & Schemas

- Flat: `types.ts`, `schemas.ts` (or `types/`, `schemas/` if multiple).

## 12. Components

```
components/
├── ui/          # Stateless primitives (Button, Input)
└── composites/  # Logic-heavy wrappers (DataTable)
```

- Feature components: Optional `src/features/<domain>/components/` (domain-specific, no cross-feature imports).
- Page components: `src/pages/<PageName>/components/` (page-specific, optional).

## 13. Stores

- Prefer React Query for server state.
- Use a client store (e.g., Zustand) only for UI state that isn't derived from queries/props.
- Domain stores: Flat `store.ts` (or `stores/` if multiple) in features.
- Shared stores (optional): `src/stores/<name>Store.ts`.
- Keep stores minimal, serializable, and typed.

## 14. Assets & Styles

- Feature assets: `src/features/<domain>/assets/`
- Shared assets: `src/assets/` (images, icons)
- Public assets: `public/` (favicon, static files)
- Global styles: `src/styles/`
