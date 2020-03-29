export default class Cancel {
  message?: string
  constructor(message?: string) {
    this.message = message
  }
}
// 是否为一个Cancel对象
export function isClancel(val: any): boolean {
  return val instanceof Cancel
}
