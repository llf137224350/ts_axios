import { IAxiosRequestConfig, IAxiosPromise, IAxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: IAxiosRequestConfig): IAxiosPromise {
  return new Promise((resolve, reject) => {
    // 获取请求参数
    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken, withCredentials, xsrfHeaderName, xsrfCookieName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config
    // 初始化一个请求对象
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)
    // 设置请求参数
    setRequest()
    // 添加事件监听
    addEventListener()
    // 添加未完成请求中断请求
    addCancel()
    // 设置请求头
    setHeaders()
    // 发送请求
    request.send(data)

    // 处理返回
    function handleResponse(response: IAxiosResponse): void {
      if (!validateStatus || validateStatus!(response.status)) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code：${response.status}`, config, null, request, response))
      }
    }

    // 处理请求参数
    function setRequest(): void {
      // 如果设置了返回数据类型
      if (responseType) {
        request.responseType = responseType
      }
      // 设置超时时间 单位为毫秒
      if (timeout) {
        request.timeout = timeout
      }
    }

    // 添加事件监听
    function addEventListener() {
      // 下载进度
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      // 上传进度
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
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
        // 处理返回
        handleResponse(response)
      }
      // 添加请求错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }
      // 超时
      request.ontimeout = function hanndleTimeout() {
        reject(createError(`Timeout of ${timeout}ms exceeded`, config, 'ECONNABORTED', request))
      }
    }

    // 设置请求头
    function setHeaders() {
      if (isFormData(data)) {
        // 删除设置的Content-Type，让浏览器自动设置
        delete headers['Content-Type']
      }
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
      // 防止xsrf攻击
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }
      // https授权
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
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
    }

    function addCancel() {
      // 如果配置了可取消
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
  })
}
