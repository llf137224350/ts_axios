export type Method = 'get' | 'GET' | 'post' | 'POST' | 'delete' | 'DELETE' | 'put' | 'PUT' | 'options' | 'OPTIONS' | 'head' | 'HEAD' | 'patch' | 'PATCH'

// 请求参数类型
export interface IAxiosRequestConfig {
  baseUrl?: string
  url?: string // 请求路径
  method?: Method // 请求方法
  data?: any // post 请求时请求数据
  params?: any // get请求时 请求参数
  headers?: any // 请求头
  responseType?: XMLHttpRequestResponseType // 返回数据类型
  timeout?: number // 超时时间 单位为毫秒
  transformRequest?: IAxiosTransformer | IAxiosTransformer[]
  transformResponse?: IAxiosTransformer | IAxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: IAxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string

  [propName: string]: any
}

// 返回数据
export interface IAxiosResponse<T = any> {
  data: T // 返回数据
  status: number // 状态码
  statusText: string // 状态文本
  headers: any // 响应头
  config: IAxiosRequestConfig // 用户传入请求数据
  request: any // ajax请求
}

// 返回数据promise
export interface IAxiosPromise<T = any> extends Promise<IAxiosResponse<T>> {}

// 请求错误
export interface IAxiosError extends Error {
  isAxiosError: boolean
  config: IAxiosRequestConfig
  code?: string | null
  request?: any
  respone?: IAxiosResponse
}

// 常用请求方法
export interface IAxios {
  defaults: IAxiosRequestConfig
  interceptors: {
    request: IAxiosInterceptorManager<IAxiosRequestConfig>
    response: IAxiosInterceptorManager<IAxiosResponse>
  }

  request<T = any>(config: IAxiosRequestConfig): IAxiosPromise<T>

  get<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>

  delete<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>

  head<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>

  options<T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise<T>
}

export interface IAxiosInstance extends IAxios {
  <T = any>(config: IAxiosRequestConfig): IAxiosPromise<T>

  <T = any>(url: string, config?: IAxiosRequestConfig): IAxiosPromise<T>
}

export interface IAxiosStatic extends IAxiosInstance {
  create(config?: IAxiosRequestConfig): IAxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (val: any) => boolean
}

export interface IAxiosInterceptorManager<T> {
  use(resolved: IResolvedFn<T>, rejected?: IRejectedFn): number

  // 销毁拦截器
  eject(id: number): void
}

export interface IResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface IRejectedFn {
  (error: any): any
}

export interface IAxiosTransformer {
  (data: any, header?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfReqiest(): void
}

export interface ICanceler {
  (message?: string): void
}

export interface ICancelExceptor {
  (cancel: ICanceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: ICanceler
}

export interface CancelTokenStatic {
  new (exceptor: ICancelExceptor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface IAxiosBasicCredentials {
  username: string
  password: string
}
