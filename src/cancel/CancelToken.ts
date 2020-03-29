import { ICanceler, ICancelExceptor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface IResolvePromise {
  (resson?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(exceptor: ICancelExceptor) {
    let resolvePromise: IResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    exceptor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: ICanceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }

  throwIfReqiest(): void {
    if (this.reason) {
      throw this.reason
    }
  }
}
