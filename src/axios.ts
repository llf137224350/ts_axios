import { IAxiosRequestConfig, IAxiosStatic } from './types'
import { Axios } from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/MergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isClancel } from './cancel/Cancel'
function createInstance(initConfig: IAxiosRequestConfig): IAxiosStatic {
  const context = new Axios(initConfig)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as IAxiosStatic
}

const axios = createInstance(defaults)
axios.create = function(config) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isClancel
export default axios
