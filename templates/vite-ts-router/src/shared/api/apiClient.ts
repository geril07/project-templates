import ky from 'ky'

import { apiBaseUrl } from '@/shared/config/api'

export const apiClient = ky.create({
  prefixUrl: apiBaseUrl,
  retry: 0,
})
