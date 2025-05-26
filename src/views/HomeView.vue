<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleListItem from '../components/ArticleListItem.vue'

const router = useRouter()
const articles = ref([
  {
    id: 1,
    title: '如何使用Vue3构建现代Web应用',
    summary: 'Vue3带来了许多新特性，如Composition API、Teleport、Fragments等，本文将详细介绍如何利用这些特性构建现代Web应用。',
    date: '2023-05-15',
    category: 'tech',
    tags: ['Vue', 'JavaScript', 'Web开发'],
    thumbnail: 'https://picsum.photos/id/11/800/600'
  },
  {
    id: 2,
    title: '2023年最值得学习的编程语言',
    summary: '随着技术的不断发展，编程语言也在不断更新迭代。本文将介绍2023年最值得学习的几种编程语言及其应用场景。',
    date: '2023-06-22',
    category: 'tech',
    tags: ['编程语言', '学习资源'],
    thumbnail: 'https://picsum.photos/id/24/800/600'
  },
  {
    id: 3,
    title: '旅行中的摄影技巧',
    summary: '旅行中如何拍出美丽的照片？本文分享一些实用的摄影技巧，帮助你在旅途中捕捉精彩瞬间。',
    date: '2023-07-10',
    category: 'life',
    tags: ['摄影', '旅行', '技巧'],
    thumbnail: 'https://picsum.photos/id/65/800/600'
  }
])

const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}
</script>

<template>
  <div class="home-view">
    <h1 class="fade-in">最新文章</h1>
    
    <div class="articles-list">
      <div class="list-container">
        <ArticleListItem 
          v-for="(article, index) in articles" 
          :key="article.id" 
          :article="article"
          class="list-item"
          @click="viewArticle(article.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 20px 0;
}

h1 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
}

.articles-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 10px;
}

.list-container {
  width: 100%;
}

.list-item {
  animation: showItem 0.5s ease-out forwards;
}

/* 标题淡入动画 */
.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
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

@keyframes showItem {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 