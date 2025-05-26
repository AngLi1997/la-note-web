<script setup>
</script>

<template>
  <div class="app-container">
    <header>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/timeline">时间轴</router-link>
        <router-link to="/essay">随笔</router-link>
        <router-link to="/about">关于</router-link>
      </nav>
    </header>
    
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer>
      <p>© {{ new Date().getFullYear() }} 交换余生. 保留所有权利。</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
}

nav {
  display: flex;
  gap: 8px;
  background-color: #f5f5f5;
  padding: 6px;
  border-radius: 16px;
  align-items: center;
  width: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

nav a {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  font-size: 15px;
}

nav a:hover {
  color: #3498db;
  background-color: rgba(255, 255, 255, 0.5);
}

nav a.router-link-active {
  color: #2980b9;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

main {
  flex: 1;
  padding: 20px 0;
  position: relative;
}

footer {
  padding: 20px 0;
  border-top: 1px solid #eee;
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
</style>
