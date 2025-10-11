# Agent Coding Guidelines

This document outlines the conventions and commands for agentic coding in this repository.

## 1. Commands

| Action | Command | Notes |
| :--- | :--- | :--- |
| **Build** | `npm run build` | Runs `vite build` after type-checking. |
| **Lint** | `npm run lint` | Runs ESLint for code quality checks. |
| **Type Check** | `npm run typecheck` | Runs `tsc -b` for TypeScript compilation checks. |
| **Format** | `npm run format` | Auto-formats all files using Prettier. |
| **Test** | `vitest` | Runs all unit tests. |
| **Single Test** | `vitest <path/to/test/file>` | Use this to run a specific test file. |

## 2. Code Style & Conventions

*   **Language:** TypeScript/TSX. Prioritize strong typing and type safety.
*   **Formatting:** Strict Prettier rules: single quotes, no semicolons, trailing commas (`all`).
*   **Imports:** Imports must be sorted into three groups: third-party modules, local aliases (starting with `@/`), and relative paths. Groups must be separated by a newline.
*   **Naming:** Use `camelCase` for variables and functions. Use `PascalCase` for React components, types, and interfaces.
*   **Error Handling:** Rely on TypeScript for compile-time safety. For runtime errors, use standard `try...catch` blocks.
