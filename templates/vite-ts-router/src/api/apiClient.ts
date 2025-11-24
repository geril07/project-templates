import ky from 'ky'

import { API_BASE_URL } from '@/constants/api'

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  retry: 0,
})
