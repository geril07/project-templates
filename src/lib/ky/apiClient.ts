import ky from 'ky'

import { API_URL } from '@/constants/api'

export const apiClient = ky.create({
  prefixUrl: API_URL,
  retry: 0,
})
