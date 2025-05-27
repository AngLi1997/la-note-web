<script setup>
</script>

<template>
  <div class="app-container">
    <header>
      <div class="header-content">
        <h1 class="logo">liang-note</h1>
        <nav>
          <router-link to="/">文章</router-link>
          <router-link to="/essay">吐槽</router-link>
          <router-link to="/timeline">时间轴</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
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
}

.logo {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 500;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  font-size: 16px;
  position: relative;
  transition: all 0.3s ease;
}

nav a:hover {
  color: rgba(255, 255, 255, 0.8);
}

nav a.router-link-active {
  color: white;
}

nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 2px;
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
