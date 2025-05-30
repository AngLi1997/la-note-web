<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { isLoggedIn, logout, getUserInfo } from './utils/auth.js';

const router = useRouter();
const loggedIn = ref(false);
const userInfo = ref(null);

// 检查登录状态
const checkLoginStatus = () => {
  loggedIn.value = isLoggedIn();
  if (loggedIn.value) {
    userInfo.value = getUserInfo();
  }
};

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});

// 处理登出
const handleLogout = () => {
  logout();
  loggedIn.value = false;
  userInfo.value = null;
  router.push('/');
};

// 处理管理员按钮点击
const handleAdminClick = () => {
  // 根据登录状态决定跳转到仪表板还是登录页
  if (loggedIn.value) {
    router.push('/admin/dashboard');
  } else {
    router.push('/admin/login');
  }
};
</script>

<template>
  <div class="app-container">
    <header>
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <h1 class="logo">Liang's Note</h1>
        </router-link>
        <nav class="main-nav">
          <router-link to="/">文章</router-link>
          <router-link to="/moments">拾光</router-link>
          <router-link to="/timeline">时间轴</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
        <div class="admin-login">
          <button class="admin-button" @click="handleAdminClick">
            {{ loggedIn ? '管理面板' : '管理员登录' }}
          </button>
          <button v-if="loggedIn" class="logout-button" @click="handleLogout">
            退出
          </button>
        </div>
      </div>
    </header>
    
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer>
      <p>© {{ new Date().getFullYear() }} liang-note. 保留所有权利。</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;
}

header {
  background-color: #11754b;
  color: white;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  position: relative;
}

.logo-link {
  text-decoration: none;
  color: white;
}

.logo {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 500;
  width: 150px;
}

.main-nav {
  display: flex;
  gap: 20px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  font-size: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.main-nav a:hover {
  color: rgba(255, 255, 255, 0.8);
}

.main-nav a.router-link-active {
  color: white;
}

.main-nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 2px;
}

.admin-login {
  margin-left: auto;
  display: flex;
  gap: 10px;
  align-items: center;
}

.admin-button {
  background-color: white;
  color: #11754b;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-button:hover {
  background-color: #f0f0f0;
}

.logout-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: 8px 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.user-icon {
  width: 20px;
  height: 20px;
}

main {
  flex: 1;
  padding: 0;
  position: relative;
}

footer {
  padding: 20px 0;
  background-color: #f5f5f5;
  text-align: center;
  color: #666;
}
</style>

<style>
/* 简单的淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

body {
  margin: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
}
</style>
