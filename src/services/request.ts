import { ajax } from './ajax'
import { AxiosRequestConfig } from 'axios'

interface RequestConfig extends AxiosRequestConfig {
    reportError?: boolean
}

const defaultConfig: RequestConfig = {
  reportError: true
}

export const interceptor = (res: Res, setting?: RequestConfig) => {
  const config = Object.assign({}, defaultConfig, setting)

  if (res.success) {
    return Promise.resolve(res)
  } else {
    config.reportError && alert(res.desc)
    if (res.statusCode === '10007') {
      window.location.href = '/#/login'
    }
    return Promise.reject(res)
  }
}

export function originalRequest (url: string, data:any = {}, setting?: RequestConfig) {
  const config = Object.assign({ method: 'post' }, defaultConfig, setting, { url })

  if (config.method === 'get' || config.method === 'delete') {
    config.params = data
  } else {
    config.data = data
  }

  return ajax(config).catch(error => {
    config.reportError && alert('请求失败')
    return Promise.reject(error)
  })
}

export function request (url:string, data:any = {}, setting?: RequestConfig) {
  return originalRequest(url, data, setting).then((response: { data: Res }) => interceptor(response.data, setting))
}

export function requestGenterator (url: string, setting?: RequestConfig) {
  return function (data: any = {}, config?: RequestConfig) {
    config = Object.assign({}, setting, config)
    return request(url, data, config)
  }
}

export interface Res {
    success: boolean
    data: any
    statusCode: string
    desc: string
    itemTotal?: number
}
