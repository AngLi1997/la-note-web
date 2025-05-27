<script setup>
</script>

<template>
  <div class="app-container">
    <header>
      <div class="header-content">
        <h1 class="logo">NOTE</h1>
        <nav class="main-nav">
          <router-link to="/">文章</router-link>
          <router-link to="/essay">吐槽</router-link>
          <router-link to="/timeline">时间轴</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
        <div class="admin-login">
          <router-link to="/admin/login" title="管理员登录">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="user-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </router-link>
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

.admin-login a {
  color: white;
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

.admin-login a:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
