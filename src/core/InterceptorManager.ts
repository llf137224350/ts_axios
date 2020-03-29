import { IAxiosInterceptorManager, IRejectedFn, IResolvedFn } from '../types'

interface Interceptor<T> {
  resolved: IResolvedFn<T>
  rejected?: IRejectedFn
}

export class InterceptorManager<T> implements IAxiosInterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: IResolvedFn<T>, rejected?: IRejectedFn): number {
    this.interceptors.push({
      rejected,
      resolved
    })
    return this.interceptors.length - 1
  }
  // 对外提供的方法
  forEach(fn: (interceptor: Interceptor<any>) => void) {
    this.interceptors.forEach(interceptor => {
      if (interceptor != null) {
        fn(interceptor)
      }
    })
  }
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
