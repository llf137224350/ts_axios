import axios, { ICanceler } from '../../src'
import CancelToken from '../../src/cancel/CancelToken'

const cancelToken = axios.CancelToken
const source = cancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch((e) => {
  if (axios.isCancel(e)) {
    console.log('request canceled', e.message)
  }
})
setTimeout(() => {
  source.cancel('operation canceled')
  axios.post('/cancel/post', {
    cancelToken: source.token
  }).catch((e) => {
    if (axios.isCancel(e)) {
      console.log('request canceled', e.message)
    }
  })
}, 100)

let cancel: ICanceler
axios.get('/cancel/get', {
  withCredentials: true,
  auth: {
    username: 'llf',
    password: '123456'
  },
  cancelToken: new CancelToken ((c) => {
      cancel = c;
  })
}).catch((e) => {
  if (axios.isCancel(e)) {
    console.log('request canceled')
  }
})

setTimeout(() => {
  cancel()
}, 2000)
