export const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_APP_API_URL ?? '/api')
  : '/api'
