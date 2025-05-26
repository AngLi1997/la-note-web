<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleListItem from '../components/ArticleListItem.vue'

const route = useRoute()
const router = useRouter()
const category = computed(() => route.params.category)
const isAnimating = ref(false)

const articles = ref([
  {
    id: 1,
    title: '如何使用Vue3构建现代Web应用',
    summary: 'Vue3带来了许多新特性，如Composition API、Teleport、Fragments等，本文将详细介绍如何利用这些特性构建现代Web应用。',
    date: '2023-05-15',
    category: 'tech',
    tags: ['Vue', 'JavaScript', 'Web开发']
  },
  {
    id: 2,
    title: '2023年最值得学习的编程语言',
    summary: '随着技术的不断发展，编程语言也在不断更新迭代。本文将介绍2023年最值得学习的几种编程语言及其应用场景。',
    date: '2023-06-22',
    category: 'tech',
    tags: ['编程语言', '学习资源']
  },
  {
    id: 3,
    title: '旅行中的摄影技巧',
    summary: '旅行中如何拍出美丽的照片？本文分享一些实用的摄影技巧，帮助你在旅途中捕捉精彩瞬间。',
    date: '2023-07-10',
    category: 'life',
    tags: ['摄影', '旅行', '技巧']
  }
])

const filteredArticles = computed(() => {
  return articles.value.filter(article => article.category === category.value)
})

const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

// 监听路由变化，重置动画状态
watch(() => route.params.category, () => {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 50)
}, { immediate: true })
</script>

<template>
  <div class="category-view">
    <h1 class="fade-in">{{ category }} 分类文章</h1>
    
    <div v-if="filteredArticles.length" class="articles-list">
      <div class="list-container">
        <ArticleListItem 
          v-for="(article, index) in filteredArticles" 
          :key="article.id" 
          :article="article"
          class="list-item"
          @click="viewArticle(article.id)"
        />
      </div>
    </div>
    <div v-else class="empty-state fade-in">
      该分类下暂无文章
    </div>
  </div>
</template>

<style scoped>
.category-view {
  padding: 20px 0;
}

h1 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
  text-transform: capitalize;
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

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
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