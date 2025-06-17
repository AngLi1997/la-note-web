import { ElMessage } from 'element-plus'

// 保存原始方法的引用
const originalMessage = {
  info: ElMessage.info,
  success: ElMessage.success,
  warning: ElMessage.warning,
  error: ElMessage.error,
  closeAll: ElMessage.closeAll,
  _original: ElMessage
}

// 重写 ElMessage 的各种方法
ElMessage.info = (options) => {
  if (typeof options === 'string') {
    return originalMessage.info({
      message: options,
      duration: 1000
    })
  }
  return originalMessage.info({
    ...options,
    duration: options.duration || 1000
  })
}

ElMessage.success = (options) => {
  if (typeof options === 'string') {
    return originalMessage.success({
      message: options,
      duration: 1000
    })
  }
  return originalMessage.success({
    ...options,
    duration: options.duration || 1000
  })
}

ElMessage.warning = (options) => {
  if (typeof options === 'string') {
    return originalMessage.warning({
      message: options,
      duration: 1000
    })
  }
  return originalMessage.warning({
    ...options,
    duration: options.duration || 1000
  })
}

ElMessage.error = (options) => {
  if (typeof options === 'string') {
    return originalMessage.error({
      message: options,
      duration: 1000
    })
  }
  return originalMessage.error({
    ...options,
    duration: options.duration || 1000
  })
}

// 重写默认方法
const originalFn = ElMessage;
ElMessage.install = originalFn.install;
const newElMessage = function(options) {
  if (typeof options === 'string') {
    return originalFn({
      message: options,
      duration: 1000
    })
  }
  return originalFn({
    ...options,
    duration: options.duration || 1000
  })
}

// 复制所有属性到新函数
Object.keys(ElMessage).forEach(key => {
  newElMessage[key] = ElMessage[key];
})

// 替换全局方法
window.ElMessage = newElMessage;

export default {
  install: (app) => {
    app.config.globalProperties.$message = newElMessage;
  }
} 