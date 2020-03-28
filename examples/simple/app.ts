import axios from '../../src/index'

axios({
  method: 'get',
  url: '/simple/get?c=123',
  params: {
    a: 1,
    b: 2,
    d: {
      e: 3
    },
    f: [1,2,3,4]
  }
})





