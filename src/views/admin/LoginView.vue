<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { setToken, setUserInfo } from '../../utils/auth.js';

// 使用注入的API
const api = inject('api')
const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const login = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '用户名和密码不能为空';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    console.log('开始登录请求...');
    
    // 调用后端登录接口
    const response = await api.auth.login({
      username: username.value,
      password: password.value
    });
    
    console.log('登录响应:', response);
    
    // 处理登录成功的响应
    if (response.code === 200) {
      console.log('登录成功，准备存储token和用户信息');
      
      // 保存token和用户信息
      setToken(response.data.token);
      setUserInfo(response.data.userInfo);
      
      console.log('登录状态已保存，准备跳转到仪表板');
      
      // 登录成功后跳转到管理员仪表板
      router.push('/admin/dashboard');
      
      console.log('路由跳转已触发');
    } else {
      // 处理业务逻辑错误
      errorMessage.value = response.msg || '登录失败';
      console.error('登录业务错误:', response.msg);
    }
  } catch (error) {
    // 处理网络错误或服务器错误
    console.error('登录错误完整信息:', error);
    
    if (error.response) {
      errorMessage.value = error.response.data.msg || '登录失败，请检查用户名和密码';
      console.error('服务器响应错误:', error.response.data);
    } else if (error.request) {
      errorMessage.value = '无法连接到服务器，请检查网络连接';
      console.error('无服务器响应');
    } else {
      errorMessage.value = '登录请求失败，请稍后再试';
      console.error('请求配置错误');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>管理员登录</h2>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名"
            autocomplete="username"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
            autocomplete="current-password"
          >
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="back-link">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 20px;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #11754b;
  text-align: center;
  margin-bottom: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #11754b;
}

.login-button {
  background-color: #11754b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #0d5f3d;
}

.login-button:disabled {
  background-color: #88c5aa;
  cursor: not-allowed;
}

.error-message {
  color: #e53935;
  font-size: 14px;
  margin-top: -10px;
}

.back-link {
  text-align: center;
  margin-top: 20px;
}

.back-link a {
  color: #11754b;
  text-decoration: none;
  font-size: 14px;
}

.back-link a:hover {
  text-decoration: underline;
}
</style> 