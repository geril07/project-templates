import { isPlainObject } from 'es-toolkit'
import { type HTTPError } from 'ky'

import type { ApiErrorResponse } from '@/types/api'

export class ApiResponseError extends Error {
  original: HTTPError
  data: ApiErrorResponse

  constructor(original: HTTPError, data: ApiErrorResponse) {
    super(data.message)
    this.name = 'ApiResponseError'
    this.original = original
    this.data = data
  }
}

export const isDataApiErrorResponse = (
  data?: unknown,
): data is ApiErrorResponse => {
  if (isPlainObject(data) && 'message' in data) return true

  return false
}

export const getMessageFromApiResponseError = (err?: unknown) => {
  if (!(err instanceof ApiResponseError)) return

  return err.data.message
}
