import { IAxios, IAxiosPromise, IAxiosRequestConfig, IAxiosResponse, IRejectedFn, IResolvedFn, Method } from '../types'
import { InterceptorManager } from './InterceptorManager'
import dispatchRequest from './DispatchRequest'
import mergeConfig from './MergeConfig'

interface IInterceptors {
  request: InterceptorManager<IAxiosRequestConfig>
  response: InterceptorManager<IAxiosResponse>
}

interface PromiseChain<T> {
  resolved: IResolvedFn<T> | ((config: IAxiosRequestConfig) => IAxiosPromise)
  rejected?: IRejectedFn
}

export class Axios implements IAxios {
  defaults: IAxiosRequestConfig // 请求参数默认配置
  interceptors: IInterceptors // 拦截器

  constructor(initConfig: IAxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<IAxiosRequestConfig>(),
      response: new InterceptorManager<IAxiosResponse>()
    }
  }

  delete(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  get(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  head(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: IAxiosRequestConfig): IAxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  patch(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  post(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  request(url: any, config?: any): IAxiosPromise {
    let conf = config
    if (typeof url === 'string') {
      if (!conf) {
        conf = {}
      }
      conf.url = url
    } else {
      conf = url
    }
    // 对配置文件进行合并
    conf = mergeConfig(this.defaults, conf)

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    // 先添加的后执行
    this.interceptors.request.forEach(interceptor => {
      // 在开始位置添加，遍历是效果为后添加的先执行
      chain.unshift(interceptor)
    })
    // 在最后添加 先添加的先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    let promise = Promise.resolve(conf)
    while (chain.length) {
      // 返回第一个并移除第一个
      let { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }

  _requestMethodWithoutData(method: Method, url: string, config?: IAxiosRequestConfig): IAxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method
      })
    )
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: IAxiosRequestConfig): IAxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method,
        data
      })
    )
  }
}
