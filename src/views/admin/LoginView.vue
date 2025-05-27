<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

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
    // 这里应该是实际的登录逻辑，例如调用 API
    // 目前只是模拟登录过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 假设用户名为 admin，密码为 admin123 时登录成功
    if (username.value === 'admin' && password.value === 'admin123') {
      // 登录成功后可以存储 token 或用户信息
      localStorage.setItem('adminToken', 'sample-token');
      router.push('/admin/dashboard'); // 登录成功后跳转到管理员仪表板
    } else {
      errorMessage.value = '用户名或密码错误';
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后再试';
    console.error('登录错误:', error);
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