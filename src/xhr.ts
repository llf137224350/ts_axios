import { IAxiosRequestConfig, IAxiosPromise, IAxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: IAxiosRequestConfig): IAxiosPromise {
  return new Promise((resolve, reject) => {
    // 获取请求参数
    const { data = null, url, method = 'get', headers, responseType } = config
    // 初始化一个请求对象
    const request = new XMLHttpRequest()
    // 如果设置了返回数据类型
    if (responseType) {
      request.responseType = responseType
    }
    // 设置参数
    request.open(method.toUpperCase(), url, true)
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      // 设置返回数据
      // 响应头
      const responseHeaders = request.getAllResponseHeaders()
      // 返回数据
      const responseData = responseType !== 'text' ? request.response : request.responseText
      // 构造返回数据
      const response: IAxiosResponse = {
        data: responseData,
        headers: parseHeaders(responseHeaders),
        status: request.status,
        statusText: request.statusText,
        config,
        request
      }
      resolve(response)
    }
    // 设置请求头
    Object.keys(headers).forEach(name => {
      // 如果没有data，则不要设置Content-Type
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    // 发送请求
    request.send(data)
  })
}
