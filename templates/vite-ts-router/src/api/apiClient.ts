import ky from 'ky'

import { API_BASE_URL } from '@/constants/api'
import {
  ApiResponseError,
  isDataApiErrorResponse,
} from '@/utils/apiErrorResponse'

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  retry: 0,
  hooks: {
    beforeError: [
      async (error) => {
        const data = await error.response
          .clone()
          .json()
          .catch(() => undefined)

        if (isDataApiErrorResponse(data)) {
          throw new ApiResponseError(error, data)
        }

        return error
      },
    ],
  },
})
