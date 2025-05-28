import axios from 'axios'
import { getToken } from './auth.js'

// 创建axios实例
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 请求拦截器
  instance.interceptors.request.use(
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
  instance.interceptors.response.use(
    response => {
      return response.data
    },
    error => {
      console.error('API请求错误:', error)
      return Promise.reject(error)
    }
  )

  return instance
}

// 在没有注入的情况下，使用默认实例
const axiosInstance = createAxiosInstance()

/**
 * 用户设置相关API
 */
export const userSettingApi = {
  /**
   * 获取用户设置
   * @param {string} userId 用户ID
   * @returns {Promise} 返回请求Promise
   */
  getUserSetting: (userId, instance = axiosInstance) => {
    return instance.get(`/user-settings/${userId}`)
  },
  
  /**
   * 更新用户设置
   * @param {string} userId 用户ID
   * @param {Object} data 设置数据
   * @returns {Promise} 返回请求Promise
   */
  updateUserSetting: (userId, data, instance = axiosInstance) => {
    return instance.put(`/user-settings/${userId}`, data)
  }
}

/**
 * 文章相关API
 */
export const articleApi = {
  /**
   * 获取文章列表
   * @param {Object} params 查询参数
   * @returns {Promise} 返回请求Promise
   */
  getArticles: (params, instance = axiosInstance) => {
    return instance.get('/articles', { params })
  },
  
  /**
   * 获取文章详情
   * @param {string} id 文章ID
   * @returns {Promise} 返回请求Promise
   */
  getArticleById: (id, instance = axiosInstance) => {
    return instance.get(`/articles/${id}`)
  },
  
  /**
   * 获取文章列表
   * @param {Object} params 查询参数
   * @returns {Promise} 返回请求Promise
   */
  getArticlesList: (params, instance = axiosInstance) => {
    return instance.get('/articles/list', { params })
  },
  
  /**
   * 获取文章分类
   * @returns {Promise} 返回请求Promise
   */
  getCategories: (instance = axiosInstance) => {
    return instance.get('/articles/categories')
  },
  
  /**
   * 获取文章标签
   * @returns {Promise} 返回请求Promise
   */
  getTags: (instance = axiosInstance) => {
    return instance.get('/articles/tags')
  }
}

/**
 * 用户认证相关API
 */
export const authApi = {
  /**
   * 用户登录
   * @param {Object} data 登录数据
   * @returns {Promise} 返回请求Promise
   */
  login: (data, instance = axiosInstance) => {
    return instance.post('/auth/login', data)
  },
  
  /**
   * 获取当前用户信息
   * @returns {Promise} 返回请求Promise
   */
  getCurrentUser: (instance = axiosInstance) => {
    return instance.get('/auth/current-user')
  }
}

/**
 * 初始化API，使用注入的axios实例
 * @param {Object} injectedAxios 注入的axios实例
 */
export const initApi = (injectedAxios) => {
  // 重写API方法，使用注入的axios实例
  Object.keys(userSettingApi).forEach(key => {
    const originalMethod = userSettingApi[key]
    userSettingApi[key] = (...args) => originalMethod(...args, injectedAxios)
  })
  
  Object.keys(articleApi).forEach(key => {
    const originalMethod = articleApi[key]
    articleApi[key] = (...args) => originalMethod(...args, injectedAxios)
  })
  
  Object.keys(authApi).forEach(key => {
    const originalMethod = authApi[key]
    authApi[key] = (...args) => originalMethod(...args, injectedAxios)
  })
} 