import { isPlainObject } from './util'

/**
 *
 * @param headers 请求头
 * @param normalizedName 需要处理的请求头中的key
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  // 遍历请求头
  Object.keys(headers).forEach(name => {
    // 如果请求头中的key和希望设置的key不一致 如用户传入了content-type，则处理为Content-Type
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      // headers[Content-Type] = xxx
      headers[normalizedName] = headers[name]
      // 移除用户传入的key 如 content-type
      delete headers[name]
    }
  })
  return headers
}

// 处理请求的headers
export function processHeader(headers: any, data: any): any {
  // 判断请求中的data如果为对象，则发送数据格式为json，那么需要设置请求头
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    // 设置了headers，但是没有设置Content-Type，则自动设置
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

// 解析返回头
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  // 拆分返回头字符串
  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (value) {
      value = value.trim()
    }
    parsed[key] = value
  })
  return parsed
}
