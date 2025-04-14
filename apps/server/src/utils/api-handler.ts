import axios from 'axios'

import { baseUrl } from '../constants'
import { ENDPOINTS } from '../endpoints'
import { RequestMethod } from '../types/api-types'
import { logger } from './logger'

interface APIProps {
  requestMethod: RequestMethod
  endpoint: ENDPOINTS
  subEndpoint?: string
  params?: Record<string, string | number | boolean | undefined>
  body?: Record<string, string | number | boolean | undefined>
  accessToken?: string
  errorCount?: number
}

export const requestDataFromAPI = async <ResponseType>({
  requestMethod,
  accessToken,
  params,
  endpoint,
  subEndpoint,
  body,
  errorCount,
}: APIProps): Promise<ResponseType> => {
  try {
    axios.defaults.headers.Authorization = `Bearer ${accessToken ?? ''}`

    const requestData =
      requestMethod === RequestMethod.POST
        ? { ...body }
        : {
            params,
          }

    const response = await axios[requestMethod]<ResponseType>(
      `${baseUrl}${endpoint}${subEndpoint ?? ''}`,
      requestData,
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error?.response?.headers)
      await logger({
        action: 'Axios error',
        message: `Error code ${error?.response?.status}`,
      })
    }

    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      let errCount = errorCount ?? 0
      errCount++

      if (errCount > 20) {
        await logger({
          action: 'Axios error',
          message: 'Too many API errors',
        })
        throw new Error('Too many API errors')
      }

      return await requestDataFromAPI({
        requestMethod,
        accessToken,
        params,
        endpoint,
        subEndpoint,
        body,
        errorCount: errCount,
      })
    }
    await logger({
      action: 'Axios error',
      message: `Error during API call for endpoint: ${baseUrl}${endpoint}${
        subEndpoint ?? ''
      }`,
    })
    throw new Error(
      `Error during API call for endpoint: ${baseUrl}${endpoint}${
        subEndpoint ?? ''
      }`,
    ) //Error handling TBD
  }

  // 429 handling TBD
}
