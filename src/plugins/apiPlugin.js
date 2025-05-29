import { userSettingApi, articleApi, authApi, complaintApi, timelineApi, initApi } from '@/utils/api.js'

export default {
  install: (app) => {
    // 获取由axios插件提供的实例
    const axios = app.config.globalProperties.$axios || app._context.provides.axios
    
    // 使用注入的axios初始化API
    if (axios) {
      initApi(axios)
    }
    
    // 将所有API挂载到app实例上
    const api = {
      user: userSettingApi,
      article: articleApi,
      auth: authApi,
      complaint: complaintApi,
      timeline: timelineApi
    }
    
    app.provide('api', api)
    app.config.globalProperties.$api = api
  }
} 