import { IAxiosRequestConfig } from './types'
import { processHeader } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: IAxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain,*/*'
    }
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  validateStatus: (status: number) => {
    return status >= 200 && status < 300
  },
  transformRequest: [
    (data: any, headers: any): any => {
      processHeader(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    (data: any): any => {
      return transformResponse(data)
    }
  ]
}

const methodsNoData = ['get', 'delete', 'head', 'options']
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['put', 'post', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
export default defaults
