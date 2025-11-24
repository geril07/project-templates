// Base URL for API requests.
// In dev, requests should go to `/api` and be proxied by Vite to `VITE_API_BASE_URL`.
// In prod, use `VITE_API_BASE_URL` directly; fallback to `/api` if not set.
export const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_BASE_URL ?? '/api')
  : '/api'
