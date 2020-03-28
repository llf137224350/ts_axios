import { IAxiosRequestConfig, IAxiosPromise, IAxiosResponse } from './types'
import xhr from './xhr'
import { buildUrl } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeader } from './helpers/headers'

// 对外提供调用方法
function axios(config: IAxiosRequestConfig): IAxiosPromise {
  // 处理请求信息
  processConfig(config)
  // 发起ajax请求
  return xhr(config).then((res: IAxiosResponse) => {
    // 如果返回数据为字符串，则尝试解析为json格式返回
    return transformResponseData(res)
  })
}

// 处理请求信息
function processConfig(config: IAxiosRequestConfig): void {
  //  对url进行处理
  config.url = transformUrl(config)
  // 处理请求头
  config.headers = transformHeaders(config)
  // 处理请求中的data
  config.data = transformRequestData(config)
}

// 处理url后面参数
function transformUrl(config: IAxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

// 处理请求头 如果请求数据为json，用户未设置Content-Type或者设置为content-type，则转换为Content-Type
function transformHeaders(config: IAxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeader(headers, data)
}

// 处理请求数据中的data 如果数据为json对象，则返回字符串表示形式
function transformRequestData(config: IAxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 处理返回数据 如果返回数据为字符串，则尝试解析为json
function transformResponseData(res: IAxiosResponse): IAxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

export default axios
