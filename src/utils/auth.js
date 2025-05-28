/**
 * 认证相关工具函数
 */

// token在localStorage中的key
const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'

/**
 * 获取token
 * @returns {string|null} token值或null
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置token
 * @param {string} token token值
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象或null
 */
export function getUserInfo() {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY)
  return userInfoStr ? JSON.parse(userInfoStr) : null
}

/**
 * 设置用户信息
 * @param {Object} userInfo 用户信息对象
 */
export function setUserInfo(userInfo) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  localStorage.removeItem(USER_INFO_KEY)
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return !!getToken()
}

/**
 * 退出登录
 */
export function logout() {
  removeToken()
  removeUserInfo()
} 