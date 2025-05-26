<script setup>
</script>

<template>
  <div class="app-container">
    <header>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/category/tech">技术</router-link>
        <router-link to="/category/life">生活</router-link>
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
      <p>© {{ new Date().getFullYear() }} Liang同学的博客. 保留所有权利。</p>
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
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

nav a:hover, nav a.router-link-active {
  color: #3498db;
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
