<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleListItem from '../components/ArticleListItem.vue'

const props = defineProps({
  defaultCategory: {
    type: String,
    default: 'all'
  }
})

const router = useRouter()
const route = useRoute()
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
  },
  {
    id: 4,
    title: '日常的思考：我们为什么感到焦虑',
    summary: '现代社会中，焦虑已经成为常态。本文从心理学角度探讨焦虑的来源及应对方法。',
    date: '2023-08-05',
    category: 'life',
    tags: ['心理', '思考', '生活'],
    thumbnail: 'https://picsum.photos/id/42/800/600'
  },
  {
    id: 5,
    title: '咖啡馆的一次偶遇',
    summary: '在城市的角落里，一家不起眼的咖啡馆里，发生了一个小小的故事...',
    date: '2023-09-18',
    category: 'life',
    tags: ['随想', '生活', '故事'],
    thumbnail: 'https://picsum.photos/id/54/800/600'
  },
  {
    id: 6,
    title: '2023年度技术回顾',
    summary: '回顾2023年技术领域的重大事件和技术趋势，展望未来发展方向。',
    date: '2023-12-28',
    category: 'tech',
    tags: ['年度总结', '技术趋势'],
    thumbnail: 'https://picsum.photos/id/48/800/600'
  },
  {
    id: 7,
    title: '个人成长历程：从初学者到专业开发',
    summary: '记录我在编程道路上的成长经历，分享学习心得和职业发展建议。',
    date: '2023-11-15',
    category: 'tech',
    tags: ['成长', '学习', '职业发展'],
    thumbnail: 'https://picsum.photos/id/91/800/600'
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

// 统计每个标签的文章数量
const tagCounts = computed(() => {
  const counts = {}
  articles.value.forEach(article => {
    article.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return counts
})

const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

const currentCategory = ref(props.defaultCategory)
const currentTag = ref(null)

// 监听路由变化
watch(() => route.name, (newRoute) => {
  if (newRoute === 'essay') {
    currentCategory.value = 'essay'
  } else if (newRoute === 'timeline') {
    currentCategory.value = 'timeline'
  } else if (newRoute === 'home') {
    currentCategory.value = 'all'
  }
}, { immediate: true })

const filteredArticles = computed(() => {
  let result = articles.value

  // 先按分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(article => article.category === currentCategory.value)
  }
  
  // 再按标签筛选
  if (currentTag.value) {
    result = result.filter(article => article.tags.includes(currentTag.value))
  }
  
  return result
})

const setCategory = (category) => {
  currentCategory.value = category
  currentTag.value = null // 切换分类时清除标签筛选
}

const setTag = (tag) => {
  currentTag.value = tag === currentTag.value ? null : tag
}
</script>

<template>
  <div class="home-view">
    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 横向导航栏 -->
      <div class="category-nav">
        <div class="nav-item" :class="{ active: currentCategory === 'all' }" @click="setCategory('all')">
          全部
        </div>
        <div class="nav-item" :class="{ active: currentCategory === 'tech' }" @click="setCategory('tech')">
          技术
        </div>
        <div class="nav-item" :class="{ active: currentCategory === 'life' }" @click="setCategory('life')">
          生活
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div class="articles-container">
        <div v-if="filteredArticles.length === 0" class="no-articles">
          没有找到符合条件的文章
        </div>
        <ArticleListItem 
          v-else
          v-for="article in filteredArticles" 
          :key="article.id" 
          :article="article"
          @click="viewArticle(article.id)"
        />
      </div>
      
      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 个人介绍卡片 -->
        <div class="intro-card">
          <h2>👋 中午好！这里是</h2>
          <h1>liang-note</h1>
          <p>我会在这里分享我的心得，干货笔记，以及生活中的感悟、吐槽、看法，与思考。</p>
          <p>精致的五官是心动的开始，迷人的气质是动情的深渊。</p>
          <div class="social-links">
            <a href="#" class="social-link"></a>
            <a href="#" class="social-link"></a>
          </div>
          <div class="avatar">
            <img src="https://picsum.photos/id/1012/200/200" alt="头像">
          </div>
        </div>
        
        <!-- 标签面板 -->
        <div class="tags-panel">
          <h3 class="panel-title">标签云</h3>
          <div class="tags-cloud">
            <div 
              v-for="tag in tags" 
              :key="tag" 
              class="tag-item"
              :class="{ active: currentTag === tag }"
              @click="setTag(tag)"
            >
              <span class="tag-name">{{ tag }}</span>
              <span class="tag-count">{{ tagCounts[tag] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-areas: 
    "nav nav"
    "articles sidebar";
  gap: 15px;
}

/* 横向导航栏 */
.category-nav {
  grid-area: nav;
  display: flex;
  gap: 10px;
  margin-bottom: 0;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-item {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(17, 117, 75, 0.1);
}

.nav-item.active {
  background-color: #11754b;
  color: white;
}

/* 文章列表 */
.articles-container {
  grid-area: articles;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.no-articles {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  color: #666;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 侧边栏 */
.sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-card {
  background-color: #11754b;
  color: white;
  border-radius: 8px;
  padding: 25px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.intro-card h2 {
  font-size: 18px;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.intro-card h1 {
  font-size: 26px;
  margin: 0 0 20px 0;
}

.intro-card p {
  margin: 10px 0;
  line-height: 1.6;
}

.social-links {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 标签面板 */
.tags-panel {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f5f5f5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background-color: #e8f4ee;
}

.tag-item.active {
  background-color: #11754b;
  color: white;
}

.tag-name {
  font-size: 14px;
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
}

.tag-item.active .tag-count {
  background-color: rgba(255, 255, 255, 0.2);
}

.contact-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-card p {
  margin: 0 0 15px 0;
  color: #555;
}

.qrcode {
  display: flex;
  justify-content: center;
}

.qrcode img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "nav"
      "articles"
      "sidebar";
  }
}
</style> 