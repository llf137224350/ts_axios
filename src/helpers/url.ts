import { isDate, isPlainObject, isUrlSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

// 对特殊符号编码后进行还原
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/gi, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/gi, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

// get请求时，处理请求参数
export function buildUrl(url: string, params?: any, paramsSerializer?: (params: any) => string) {
  if (params === null || params === undefined) {
    return url
  }
  let serializableParams
  if (paramsSerializer) {
    serializableParams = paramsSerializer(params)
  } else if (isUrlSearchParams(params)) {
    serializableParams = params.toString()
  } else {
    const parts: string[] = []
    // // 将请求时传入的params进行遍历
    Object.keys(params).forEach((key: string) => {
      // 获取属性值
      let val = params[key]
      // 判断值
      if (val === null || val === undefined) {
        return
      }
      // 将传入的value进行处理
      let values = []
      // 判断是否为数组，如果为数组，更改值为数组对应的key值为key[]
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values.push(val)
      }
      values.forEach(val => {
        // 判断值类型
        if (isDate(val)) {
          // 值为Date类型
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          // 值为普通对象
          val = JSON.stringify(val)
        }
        // 拼接为对应的key=value，然后放入数据组
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    // 将数组连接为字符串
    serializableParams = parts.join('&')
  }

  if (serializableParams) {
    //  判断url是否携带了#
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 判断url是否携带了?
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializableParams
  }
  return url
}

//  判断是不是同源请求
export function isURLSameOrigin(requestUrl: string) {
  const parsedOrigin = resolveURL(requestUrl)
  return parsedOrigin.protocol === currentPageOrigin.protocol && parsedOrigin.host === currentPageOrigin.host
}

const urlParsingNode = document.createElement('a')
// 创建一个a dom元素
const currentPageOrigin = resolveURL(location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

export function isAbsoluteUrl(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseUrl: string, relativeUrl?: string): string {
  return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}
