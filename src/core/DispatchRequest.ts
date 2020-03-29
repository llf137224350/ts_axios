import { IAxiosRequestConfig, IAxiosPromise, IAxiosResponse } from '../types'
import xhr from './xhr'
import { buildUrl } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeader } from '../helpers/headers'
import { flattenHeaders } from '../helpers/util'
import transform from './Transform'

// 对外提供调用方法
export default function dispatchRequest(config: IAxiosRequestConfig): IAxiosPromise {
  throwIfCancellationRequested(config)
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
  // 对header和data进行提交前处理
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理url后面参数
function transformUrl(config: IAxiosRequestConfig): string {
  const { url, params, paramsSerializer } = config
  return buildUrl(url!, params, paramsSerializer)
}

// 处理返回数据 如果返回数据为字符串，则尝试解析为json
function transformResponseData(res: IAxiosResponse): IAxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: IAxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfReqiest()
  }
}
