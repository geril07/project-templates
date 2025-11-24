# FLAT.md: Flat Variant Migration Guide

## Why Flat?

- **Prototypes/MVPs** (<5k LOC, 1-5 features). Zero boilerplate (no index.ts everywhere).
- **Visual simplicity**: Everything grouped by type. Easy IDE scan.
- **No loss**: Fractal compatible (migrate back anytime). Compare side-by-side.

**Skeptical Warning**: Flat = bicycle (fast/simple). Fractal = car (structured/scalable). Chaos at 10+ features/5k LOC (collisions, no isolation). Migrate early.

## 1. Migration Plan: What Moves Where

| Current Path                   | Flat Target                                                                                                   | Reason                                                   | Notes                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| `src/features/products/` (all) | `src/components/` (domain UI), `src/hooks/products.ts`, `src/services/products.ts`, `src/schemas/products.ts` | Flatten feature. UI to components/, logic to type-based. | Selective: api/ → hooks/services. Lose isolation (intentional). |
| `src/pages/HomePage/`          | `src/pages/Home.tsx`                                                                                          | Flat pages.                                              | Merge hooks/types to page/hooks/.                               |
| `src/pages/ProductsPage/`      | `src/pages/Products.tsx`                                                                                      | Flat.                                                    | Merge hooks/useProductFilters → page/hooks/productsFilters.ts.  |
| `src/api/`                     | `src/api/`                                                                                                    | Global infra root.                                       | apiClient.ts → api/apiClient.ts.                                |
| `src/query/`                   | `src/query/`                                                                                                  | Global.                                                  | queryClient.ts → query/client.ts.                               |
| `src/router/`                  | `src/router/`                                                                                                 | Global.                                                  | routeTree.gen.ts update vite.config.ts.                         |
| `src/components/`              | `src/components/`                                                                                             | Root (keep ui/composites nested).                        | ui/button/ → components/ui/button/.                             |
| `src/utils/`                   | `src/utils/`                                                                                                  | Global.                                                  | cn(), contextFactory → utils/.                                  |
| `src/styles/`                  | `src/styles/`                                                                                                 | Global CSS.                                              | globals.css → styles/globals.css.                               |
| `src/types/`                   | `src/types/`                                                                                                  | Global.                                                  | api.ts → types/api.ts.                                          |
| `src/routes/`                  | Unchanged                                                                                                     | File-based.                                              | Update imports.                                                 |
| `src/main.tsx`                 | Unchanged                                                                                                     | Adjust imports.                                          | `@/query/client`, `@/router/router`.                            |

**Cost**: ~20 moves. 15min (git mv + import fixes). Test build/lint.

## 2. End Result Structure

```
flat-template/
├── src/
│   ├── api/                # apiClient.ts
│   ├── components/         # ui/button/, composites/data-table/ (nested)
│   │   ├── ui/
│   │   └── composites/
│   ├── config/             # api.ts
│   ├── hooks/              # useProductFilters.ts, query wrappers
│   ├── pages/              # Home.tsx, Products.tsx (flat)
│   ├── query/              # client.ts
│   ├── router/             # router.ts, routeTree.gen.ts
│   ├── routes/             # __root.tsx, index.tsx, products.index.tsx
│   ├── schemas/            # products.ts (Zod)
│   ├── services/           # products.ts (API calls)
│   ├── styles/             # globals.css
│   ├── types/              # api.ts, models
│   ├── utils/              # cn.ts, contextFactory.ts
│   └── main.tsx
├── AGENTS.md-flat          # Simplified rules
├── package.json            # Identical
└── vite.config.ts          # Update routeTree path
```

## AGENTS.md-flat Snippet (Create This)

```
# Flat Rules
- Group by type: components/hooks/services/pages/utils.
- Prefix: useProductsQuery, productsService.
- No features/pages folders.
- For prototypes <5k LOC. Scale → fractal template.
- Imports: @/hooks/products, @/components/ui/button.
```

## Tradeoffs

| Aspect             | Flat                   | Fractal                |
| ------------------ | ---------------------- | ---------------------- |
| **Setup Speed**    | ⭐⭐⭐⭐⭐             | ⭐⭐⭐                 |
| **<5k LOC**        | ⭐⭐⭐⭐⭐             | ⭐⭐⭐⭐               |
| **20k+ LOC**       | ⭐⭐                   | ⭐⭐⭐⭐⭐             |
| **Team (5+ devs)** | ⭐⭐                   | ⭐⭐⭐⭐⭐             |
| **Maintenance**    | Easy start, hard scale | Hard start, easy scale |

## When to Migrate Back

- Naming collisions (useProducts vs useOrders).
- 10+ features/services.
- Team growth.
- Cross-pollution (page hook → feature service).

**Skeptical Note**: Hybrid (nested ui/) = compromise. Pure flat (`components/Button.tsx`) simpler but loses shadcn/TanStack patterns. Monitor collisions.
