import { IAxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'
// 创建一个对象，key为指定的如 url value则为具体的合并策略方法
const strats = Object.create(null)
//  默认合并策略
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}
// 以传入值为优先的合并策略
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
// 深度合并
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}
//  以下key以传入为优先
const stratKeysFromVal2 = ['url', 'params', 'data']
// 记录所使用的合并策略方法
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 需要深度合并
const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})
// 暴露一个方法
export default function mergeConfig(config1: IAxiosRequestConfig, config2?: IAxiosRequestConfig): IAxiosRequestConfig {
  // 如果用户没有传入参数 ，则复制为空对象
  if (!config2) {
    config2 = {}
  }
  // 合并后的对象
  const config = Object.create(null)
  // 遍历传入的对象
  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 根据key判断是否具有传入优先策略，有则使用传入优先策略方法返回值，如果没有则使用默认
    const strat = strats[key] || defaultStrat // 只是得到策略方法
    config[key] = strat(config1[key], config2![key]) // 进行合并值
  }

  return config
}
