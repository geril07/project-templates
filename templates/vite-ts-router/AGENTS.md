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
- Define them in `.env`/`.env.local` and centralize usage in `src/constants/api.ts` as `API_BASE_URL`.

## 7. API Structure

- `api/queryOptions.ts` and `api/mutations.ts`
- Expand to `api/queryOptions/` and `api/mutations/` folders grouped by feature area (e.g., products.ts, categories.ts)

## 8. Services (domain logic)

- Add a service layer when logic doesn't belong in React hooks or API client.
- Prefer plain functions; avoid React imports.
- Place services in `src/features/<domain>/services/` folder.
- Group by feature area (e.g., `services/auth.ts`, `services/oauth.ts`).
- Export interfaces for request/response shapes; keep return types explicit.

## 9. Contexts

- Use React Context sparingly (auth, theming, shared feature state).
- Create via `createContextFactory` (in `src/utils/contextFactory.ts`).
- Feature‑scoped contexts live under the feature folder.

## 10. Pages

- **Pages** (`src/pages/`): Composition layer, orchestrates features, manages URL state.
- **Routes** (`src/routes/`): TanStack Router wiring (loaders, params, validation).
- Pages always use folder structure with internal `hooks/`, `types/`, `components/`, `utils/` as needed.
- Keep pages thin; delegate business logic to features.

## 11. Feature Types & Schemas

- schemas/ folder with files like `productSchema.ts`
- types/ folder with files like `models.ts`, `api.ts`

## 12. Components

```
components/
├── ui/          # Stateless primitives (Button, Input)
└── composites/  # Logic-heavy wrappers (DataTable)
```

- Feature components: `src/features/<domain>/components/` (domain-specific, no cross-feature imports)
- Page components: `src/pages/<PageName>/components/` (page-specific widgets, optional)

## 13. Stores

- Prefer React Query for server state.
- Use a client store (e.g., Zustand) only for UI state that isn't derived from queries/props.
- Domain stores: `src/features/<domain>/stores/<name>Store.ts`
- Shared stores (optional): `src/stores/<name>Store.ts` when needed across features
- Keep stores minimal, serializable, and typed.

## 14. Assets & Styles

- Feature assets: `src/features/<domain>/assets/`
- Shared assets: `src/assets/` (images, icons)
- Public assets: `public/` (favicon, static files)
- Global styles: `src/styles/`
