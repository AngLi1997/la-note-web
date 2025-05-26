import axios from 'axios'

export default {
  install: (app) => {
    // 创建axios实例
    const axiosInstance = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 请求拦截器
    axiosInstance.interceptors.request.use(
      config => {
        // 可以在这里添加认证令牌等
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    axiosInstance.interceptors.response.use(
      response => {
        return response.data
      },
      error => {
        // 处理错误响应
        console.error('API请求错误:', error)
        return Promise.reject(error)
      }
    )

    // 将axios实例挂载到app.config.globalProperties
    app.config.globalProperties.$axios = axiosInstance
    // 挂载到app实例上供组合API使用
    app.provide('axios', axiosInstance)
  }
} 