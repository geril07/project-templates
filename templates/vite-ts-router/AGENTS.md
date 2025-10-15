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

## 3. Project Structure (high‑level)

```
src/
├─ features/   # domain‑oriented code
├─ lib/        # shared utilities (e.g., ky client, query client)
├─ constants/  # config values
├─ routes/     # TanStack Router definitions
├─ pages/      # UI for routes
└─ main.tsx    # app bootstrap
```

- Feature folders contain `components/`, `hooks/`, `api/`, `utils/`, `types/`, `schemas.ts`.
- Shared libs live under `src/lib/`.

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

- Add a service layer when logic doesn’t belong in React hooks or API client.
- Prefer plain functions; avoid React imports.
- Place a single file `src/features/<domain>/<domain>Service.ts` or a `services/` folder if multiple services grow.
- Export interfaces for request/response shapes; keep return types explicit.

## 10. Contexts

- Use React Context sparingly (auth, theming, shared feature state).
- Create via `createContextFactory` (in `src/utils/contextFactory.ts`).
- Feature‑scoped contexts live under the feature folder; global contexts under `src/lib/contexts/` or `src/contexts/`.

## 11. Pages vs Routes

- **Routes** (`src/routes/`): TanStack Router wiring (loaders, params, config).
- **Pages** (`src/pages/`): Presentational UI for a route, minimal domain logic.
- Keep pages thin; delegate data fetching to feature hooks.

## 12. Feature Types & Schemas

- Use Zod for runtime validation; keep schemas in `schemas.ts`.
- colocate TypeScript types under `types/`:
  - `models.ts` – core domain interfaces.
  - `api.ts` – request/response shapes (often `z.infer<>`).
  - `index.ts` – re‑exports.
- Prefer `interface` for manually authored shapes; use `type` for Zod‑inferred types.

## 13. Components Structure

- Global UI primitives under `src/components/ui/`.
- Feature‑specific components under `src/features/<domain>/components/`.
- One component per folder; keep primitives (`ui/`) stateless and accessible.
- Prefer arrow‑function components; type props with `interface`.

## 14. Stores

- Prefer React Query for server state.
- Use a client store (e.g., Zustand) only for UI state that isn’t derived from queries/props.
- Domain stores: `src/features/<domain>/store/<name>Store.ts`.
- Global stores (rare): `src/stores/` or `src/lib/state/`.
- Keep stores minimal, serializable, and typed.
