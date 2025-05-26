<script setup>
</script>

<template>
  <div class="about-view">
    <h1 class="fade-in">关于我的博客</h1>
    
    <section class="about-section fade-in" style="animation-delay: 0.1s">
      <h2>博客介绍</h2>
      <p>这是一个简洁的个人博客系统，用于分享技术文章和生活感悟。博客使用Vue3和Element Plus构建，采用了简约的设计风格，注重内容的展示和阅读体验。</p>
    </section>
    
    <section class="about-section fade-in" style="animation-delay: 0.2s">
      <h2>关于作者</h2>
      <div class="author-info">
        <div class="avatar fade-in" style="animation-delay: 0.3s"></div>
        <div class="bio fade-in" style="animation-delay: 0.4s">
          <h3>Liang同学</h3>
          <p>Web开发爱好者，喜欢探索新技术，分享学习心得。同时热爱摄影、旅行，希望通过这个博客记录技术成长和生活点滴。</p>
        </div>
      </div>
    </section>
    
    <section class="about-section fade-in" style="animation-delay: 0.5s">
      <h2>联系方式</h2>
      <ul class="contact-list">
        <li class="fade-in" style="animation-delay: 0.6s">
          <strong>邮箱：</strong>
          <a href="mailto:example@example.com">example@example.com</a>
        </li>
        <li class="fade-in" style="animation-delay: 0.7s">
          <strong>GitHub：</strong>
          <a href="https://github.com/example" target="_blank">github.com/example</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

h1 {
  margin-bottom: 30px;
  font-size: 32px;
  color: #333;
}

.about-section {
  margin-bottom: 40px;
}

h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

p {
  line-height: 1.8;
  color: #444;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #eee;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23aaa"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 60px;
}

.bio h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  margin-bottom: 10px;
}

.contact-list a {
  color: #3498db;
  text-decoration: none;
}

.contact-list a:hover {
  text-decoration: underline;
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 