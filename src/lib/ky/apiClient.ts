import ky from 'ky'

import { apiBaseUrl } from '@/constants/api'

export const apiClient = ky.create({
  prefixUrl: apiBaseUrl,
  retry: 0,
})
