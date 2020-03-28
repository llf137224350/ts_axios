export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'put'
  | 'PUT'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'patch'
  | 'PATCH'

// 请求参数类型
export interface IAxiosRequestConfig {
  url: string // 请求路径
  method?: Method // 请求方法
  data?: any // post 请求时请求数据
  params?: any // get请求时 请求参数
  headers?: any // 请求头
  responseType?: XMLHttpRequestResponseType // 返回数据类型
}

// 返回数据
export interface IAxiosResponse {
  data: any // 返回数据
  status: number // 状态码
  statusText: string // 状态文本
  headers: any // 响应头
  config: IAxiosRequestConfig // 用户传入请求数据
  request: any // ajax请求
}

// 返回数据promise
export interface IAxiosPromise extends Promise<IAxiosResponse> {}
