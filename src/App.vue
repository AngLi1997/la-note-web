<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { isLoggedIn, logout, getUserInfo } from './utils/auth.js';

const router = useRouter();
const showDropdown = ref(false);
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
  showDropdown.value = false;
  router.push('/');
};

// 跳转到登录页
const goToLogin = () => {
  showDropdown.value = false;
  router.push('/admin/login');
};

// 跳转到其他页面
const goToPage = (path) => {
  showDropdown.value = false;
  router.push(path);
};

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  // 在打开下拉菜单时重新检查登录状态
  checkLoginStatus();
  showDropdown.value = !showDropdown.value;
};

// 点击外部关闭下拉菜单
const closeDropdown = () => {
  showDropdown.value = false;
};
</script>

<template>
  <div class="app-container" @click="closeDropdown">
    <header>
      <div class="header-content">
        <h1 class="logo">NOTE</h1>
        <nav class="main-nav">
          <router-link to="/">文章</router-link>
          <router-link to="/essay">吐槽</router-link>
          <router-link to="/timeline">时间轴</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
        <div class="admin-login" @click.stop>
          <div class="user-dropdown">
            <div class="dropdown-trigger" @click="toggleDropdown">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="user-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="dropdown-menu" v-show="showDropdown">
              <div v-if="loggedIn">
                <div class="user-info">{{ userInfo?.username || '管理员' }}</div>
                <div class="dropdown-item" @click="goToPage('/admin/site-settings')">网站设置</div>
                <div class="dropdown-item" @click="goToPage('/admin/profile')">个人信息设置</div>
                <div class="dropdown-item logout" @click="handleLogout">退出登录</div>
              </div>
              <div v-else>
                <div class="dropdown-item" @click="goToLogin">立即登录</div>
              </div>
            </div>
          </div>
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

.logo {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 500;
  width: 100px;
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
  width: 100px;
  display: flex;
  justify-content: flex-end;
}

.user-dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: all 0.3s ease;
}

.dropdown-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;
  overflow: hidden;
}

.user-info {
  padding: 12px 16px;
  font-weight: 500;
  color: #11754b;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  color: #333;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.logout {
  color: #e53935;
  border-top: 1px solid #eee;
}

.dropdown-item.logout:hover {
  background-color: #ffebee;
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
