<script setup>
import { ref, onMounted, computed } from 'vue'
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

// 提取所有分类
const categories = computed(() => {
  const categorySet = new Set(articles.value.map(article => article.category))
  return Array.from(categorySet)
})

// 提取所有标签
const tags = computed(() => {
  const tagSet = new Set()
  articles.value.forEach(article => {
    article.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet)
})

const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

const currentCategory = ref('all')
const filteredArticles = computed(() => {
  if (currentCategory.value === 'all') {
    return articles.value
  }
  return articles.value.filter(article => article.category === currentCategory.value)
})

const setCategory = (category) => {
  currentCategory.value = category
}
</script>

<template>
  <div class="articles-view">
    <!-- 主要内容区域：左侧导航 + 右侧文章列表 -->
    <div class="main-content">
      <!-- 左侧导航栏 -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <h2 class="sidebar-title">分类</h2>
          <ul class="sidebar-list">
            <li 
              :class="['sidebar-item', currentCategory === 'all' ? 'active' : '']"
              @click="setCategory('all')"
            >
              全部文章
            </li>
            <li 
              v-for="category in categories" 
              :key="category"
              :class="['sidebar-item', currentCategory === category ? 'active' : '']"
              @click="setCategory(category)"
            >
              {{ category === 'tech' ? '技术' : category === 'life' ? '生活' : category }}
            </li>
          </ul>
        </div>
        
        <div class="sidebar-section">
          <h2 class="sidebar-title">标签</h2>
          <div class="tag-cloud">
            <span 
              v-for="tag in tags" 
              :key="tag" 
              class="tag-item"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </aside>
      
      <!-- 右侧文章列表 -->
      <div class="content-area">
        <div class="articles-list">
          <div class="list-container">
            <ArticleListItem 
              v-for="article in filteredArticles" 
              :key="article.id" 
              :article="article"
              class="list-item"
              @click="viewArticle(article.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.articles-view {
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  color: #fff;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  gap: 30px;
  padding: 40px 40px 60px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左侧导航栏 */
.sidebar {
  flex: 0 0 300px;
}

.sidebar-section {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  padding: 10px 15px;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.25);
  color: #fff;
  transform: translateY(-2px);
}

.sidebar-item.active {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.tag-item:hover {
  background-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 右侧文章列表 */
.content-area {
  flex: 1;
}

.articles-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.list-container {
  width: 100%;
}

.list-item {
  animation: showItem 0.5s ease-out forwards;
}

/* 自定义文章列表项样式覆盖 */
:deep(.article-list-item) {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 20px;
  transition: all 0.3s;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.article-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

:deep(.title) {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 20px;
  color: #fff;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

:deep(.meta) {
  display: flex;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

:deep(.summary) {
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: 15px;
}

:deep(.tag) {
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.read-more) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:deep(.read-more)::after {
  content: '→';
  font-size: 16px;
  transition: transform 0.3s ease;
}

:deep(.article-list-item:hover .read-more)::after {
  transform: translateX(4px);
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 20px;
  }
}

:deep(.article-content) {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

:deep(.thumbnail-container) {
  flex: 0 0 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
  height: auto;
  align-self: stretch;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.article-list-item:hover .thumbnail) {
  transform: scale(1.05);
}
</style> 