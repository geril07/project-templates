import { isPlainObject } from 'es-toolkit'
import { HTTPError } from 'ky'

import type { ApiErrorResponse } from '@/types/api'

export class ApiResponseError extends Error {
  err: HTTPError
  data: ApiErrorResponse

  constructor(err: HTTPError, data: ApiErrorResponse) {
    super(data.detail)
    this.name = 'ApiResponseError'
    this.err = err
    this.data = data
  }
}

export const isDataApiErrorResponse = (
  data?: unknown,
): data is ApiErrorResponse => {
  if (isPlainObject(data) && 'detail' in data) return true

  return false
}

export const getDetailFromApiResponseError = (err?: unknown) => {
  if (!(err instanceof ApiResponseError)) return

  return err.data.detail
}

export const throwApiResponseErrFromKyErr = async (err?: unknown) => {
  if (!(err instanceof HTTPError)) throw err

  const data = await err.response.json()

  if (!isDataApiErrorResponse(data)) throw err

  throw new ApiResponseError(err, data)
}
