import axios from 'axios'
import qs from 'qs'
import { message, notification } from 'ant-design-vue'
import store from '@/store'

const service = axios.create({
  // baseURL: '//192.168.0.127:772',
  // baseURL: '//192.168.0.123:8082',
  // baseURL: '//192.168.0.6:5000',
  baseURL: '//192.168.0.105:5000',
  // baseURL: '//192.168.0.204:5000',
  // baseURL: 'localhost:5000',
  // baseURL: '//10.10.10.204:5000',
  timeout: 20000
})

service.interceptors.request.use(
  config => {
    store.commit('showSpinning')
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    store.commit('hideSpinning')
    if (response.data.errorCode === 200 || response.data.errorCode === 201) {
      return response.data
    }
    message.error(response.data.errorMsg)
  },
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      notification.open({
        message: '登录超时，请重新登录',
        btn: (h) => {
          return h('a-button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => notification.close(window.location.href = '/')
            }
          }, '确定')
        },
        onClose: close
      })
    }
    return Promise.reject(error)
  }
)

export const get = function (url, params) {
  const request = params ? `${url}?${qs.stringify(params)}` : url
  return new Promise((resolve, reject) => {
    service.get(request)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const post = function (url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const del = function (url, params, body) {
  const request = `${url}?${qs.stringify(params)}`
  return new Promise((resolve, reject) => {
    service.delete(request, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {
  get, post, del
}
