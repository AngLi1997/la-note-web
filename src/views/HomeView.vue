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
  <div class="home-view">
    <!-- 顶部大背景和slogan -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">交换余生</h1>
        <p class="hero-slogan">记录技术成长，分享生活点滴</p>
      </div>
    </div>
    
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
        <h2 class="content-title fade-in">最新文章</h2>
        
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
.home-view {
  padding: 0;
}

/* 顶部大背景和slogan */
.hero-section {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  border-radius: 0 0 10px 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.hero-slogan {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  gap: 30px;
  padding: 0 10px;
}

/* 左侧导航栏 */
.sidebar {
  flex: 0 0 25%;
  max-width: 25%;
}

.sidebar-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
}

.sidebar-item:hover {
  background-color: #f5f5f5;
}

.sidebar-item.active {
  background-color: #f0f7ff;
  color: #3498db;
  font-weight: 500;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background-color: #e0e0e0;
  color: #3498db;
}

/* 右侧文章列表 */
.content-area {
  flex: 1;
}

.content-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
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

/* 淡入动画 */
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
</style> 