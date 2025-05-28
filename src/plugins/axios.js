import axios from 'axios'
import { getToken, removeToken, removeUserInfo } from '@/utils/auth'

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
    // 登录接口不需要添加Authorization头
    if (!config.url.includes('/auth/login')) {
      // 从工具函数获取token
      const token = getToken()
      
      // 如果token存在，则添加到请求头中
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
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
    
    // 处理401未授权错误（token过期或无效）
    if (error.response && error.response.status === 401) {
      // 使用工具函数清除token和用户信息
      removeToken()
      removeUserInfo()
      
      // 跳转到登录页面
      if (window.router) {
        window.router.push('/admin/login')
      } else {
        window.location.href = '/admin/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default {
  install: (app) => {
    // 将axios实例挂载到app.config.globalProperties
    app.config.globalProperties.$axios = axiosInstance
    // 挂载到app实例上供组合API使用
    app.provide('axios', axiosInstance)
    
    // 保存router实例到window对象，供响应拦截器使用
    app.config.globalProperties.$router && (window.router = app.config.globalProperties.$router)
  }
}

// 导出axios实例供直接引入使用
export { axiosInstance } 