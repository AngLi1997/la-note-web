<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isLoggedIn, logout, getUserInfo } from './utils/auth.js';

const router = useRouter();
const route = useRoute();
const loggedIn = ref(false);
const userInfo = ref(null);
const mobileMenuOpen = ref(false);

// 检查登录状态
const checkLoginStatus = () => {
  loggedIn.value = isLoggedIn();
  if (loggedIn.value) {
    userInfo.value = getUserInfo();
  } else {
    userInfo.value = null;
  }
};

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});

// 监听路由变化，重新检查登录状态
watch(() => route.path, () => {
  checkLoginStatus();
  // 路由变化时关闭移动菜单
  mobileMenuOpen.value = false;
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

// 切换移动菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// 获取用户头像或默认头像
const userAvatar = computed(() => {
  return userInfo.value && userInfo.value.avatar ? userInfo.value.avatar : null;
});
</script>

<template>
  <div class="app-container">
    <header>
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <h1 class="logo">Liang's Note</h1>
        </router-link>
        
        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- 导航菜单 - 在移动端会被隐藏并通过菜单按钮控制显示 -->
        <nav class="main-nav" :class="{ 'mobile-menu-open': mobileMenuOpen }">
          <router-link to="/" @click="mobileMenuOpen = false">文章</router-link>
          <router-link to="/moments" @click="mobileMenuOpen = false">拾光</router-link>
          <router-link to="/timeline" @click="mobileMenuOpen = false">时间轴</router-link>
          <router-link to="/about" @click="mobileMenuOpen = false">关于</router-link>
        </nav>
        
        <div class="admin-login">
          <button class="admin-button" @click="handleAdminClick" :class="{ 'admin-avatar-button': loggedIn, 'admin-icon-button': !loggedIn }">
            <template v-if="loggedIn && userAvatar">
              <img :src="userAvatar" alt="用户头像" class="user-avatar" />
            </template>
            <template v-else-if="loggedIn">
              <span class="avatar-placeholder">{{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || 'U' }}</span>
            </template>
            <template v-else>
              <svg class="user-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#11754b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="#11754b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
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
  position: relative;
  z-index: 100;
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
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
}

.admin-icon-button:hover {
  background-color: #f0f0f0;
}

.admin-avatar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  overflow: hidden;
}

.admin-avatar-button:hover {
  opacity: 0.9;
}

.user-icon {
  width: 24px;
  height: 24px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #0d5f3d;
  color: white;
  font-size: 18px;
  font-weight: 500;
}

/* 移动端菜单按钮样式 */
.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.mobile-menu-button span {
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .logo {
    width: auto;
  }
  
  .mobile-menu-button {
    display: flex;
    order: 3;
    margin-left: 20px;
  }
  
  .main-nav {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    flex-direction: column;
    background-color: #11754b;
    padding: 0;
    gap: 0;
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
    transform: none;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
  }
  
  .main-nav.mobile-menu-open {
    height: auto;
    opacity: 1;
    visibility: visible;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  
  .main-nav a {
    padding: 15px 20px;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .main-nav a.router-link-active::after {
    display: none;
  }
  
  .main-nav a.router-link-active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .header-content {
    justify-content: space-between;
  }
  
  .admin-login {
    margin-left: 0;
    order: 2;
  }
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
