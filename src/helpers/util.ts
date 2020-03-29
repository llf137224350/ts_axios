import { Method } from '../types'

const toString = Object.prototype.toString

// 判断是不是Date类型
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 判断是不是对象
// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object';
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 深度拷贝
export function deepMerge(...objs: any[]) {
  let result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        // 如果value是个对象
        if (isPlainObject(val)) {
          // 如果结果集中已经存在，则进行再次合并
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  // 得到合并后的headers
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsNoData = ['get', 'delete', 'put', 'options', 'post', 'patch', 'head', 'common']
  methodsNoData.forEach(method => {
    delete headers[method]
  })
  return headers
}

// 看看是不是一个form
export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isUrlSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
