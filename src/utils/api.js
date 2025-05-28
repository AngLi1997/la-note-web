import { axiosInstance } from '../plugins/axios.js'

/**
 * 用户设置相关API
 */
export const userSettingApi = {
  /**
   * 获取用户设置
   * @param {string} userId 用户ID
   * @returns {Promise} 返回请求Promise
   */
  getUserSetting: (userId) => {
    return axiosInstance.get(`/user-settings/${userId}`)
  },
  
  /**
   * 更新用户设置
   * @param {string} userId 用户ID
   * @param {Object} data 设置数据
   * @returns {Promise} 返回请求Promise
   */
  updateUserSetting: (userId, data) => {
    return axiosInstance.put(`/user-settings/${userId}`, data)
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
  getArticles: (params) => {
    return axiosInstance.get('/articles', { params })
  },
  
  /**
   * 获取文章详情
   * @param {string} id 文章ID
   * @returns {Promise} 返回请求Promise
   */
  getArticleById: (id) => {
    return axiosInstance.get(`/articles/${id}`)
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
  login: (data) => {
    return axiosInstance.post('/auth/login', data)
  },
  
  /**
   * 获取当前用户信息
   * @returns {Promise} 返回请求Promise
   */
  getCurrentUser: () => {
    return axiosInstance.get('/auth/current-user')
  }
} 