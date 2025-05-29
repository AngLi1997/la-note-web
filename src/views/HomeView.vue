<script setup>
import { ref, onMounted, computed, watch, inject, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleListItem from '../components/ArticleListItem.vue'

// 使用注入的API
const api = inject('api')

const props = defineProps({
  defaultCategory: {
    type: String,
    default: 'all'
  }
})

const router = useRouter()
const route = useRoute()
const articles = ref([])
const categories = ref([])
const tags = ref([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 分页信息
const pagination = computed(() => ({
  current: currentPage.value,
  total: totalCount.value,
  pageSize: pageSize.value
}))

// 统计每个标签的文章数量
const tagCounts = ref({})

// 添加新的标志，区分初始加载和切换加载
const initialLoading = ref(false)
const switchLoading = ref(false)
const isDataSwitching = ref(false)
const silentLoading = ref(true)

// 添加一个变量记录是否首次加载
const hasAnimated = ref(false)

// 网站设置数据
const siteSettings = ref({
  title: '',
  subtitle: '',
  description: '',
  slogan: '',
  avatar: '',
  socialLinks: []
})

const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

const currentCategory = ref(props.defaultCategory)
const currentTag = ref(null)

// 获取文章列表
const fetchArticles = async () => {
  const isInitial = !articles.value.length
  
  if (isInitial && !silentLoading.value) {
    initialLoading.value = true
  } else if (!isInitial) {
    switchLoading.value = true
    isDataSwitching.value = true
  }
  
  try {
    // 构建查询参数
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    // 添加分类筛选
    if (currentCategory.value && currentCategory.value !== 'all') {
      params.category = currentCategory.value
    }
    
    // 添加标签筛选
    if (currentTag.value) {
      params.tag = currentTag.value
    }
    
    const response = await api.article.getArticlesList(params)
    
    // 处理不同的响应结构
    let newArticles = []
    
    if (response) {
      if (response.code === 200 && response.data) {
        // 处理格式: {code: 200, msg: "success", data: { pageNum, pageSize, total, pages, list: [] }}
        if (response.data.list) {
          newArticles = response.data.list.map(article => {
            // 处理日期格式，确保有文章日期字段
            return {
              ...article,
              date: formatDate(article.createTime || article.updateTime || new Date())
            };
          });
          totalCount.value = response.data.total || 0;
        }
        // 标准响应格式: { code: 200, data: { records: [], total: 0 } }
        else if (response.data.records) {
          newArticles = response.data.records.map(article => {
            return {
              ...article,
              date: formatDate(article.createTime || article.updateTime || new Date())
            };
          });
          totalCount.value = response.data.total || 0;
        } 
        // 格式: { code: 200, data: [] }
        else if (Array.isArray(response.data)) {
          newArticles = response.data.map(article => {
            return {
              ...article,
              date: formatDate(article.createTime || article.updateTime || new Date())
            };
          });
          totalCount.value = response.data.length;
        }
      } 
      // 直接返回数组的格式
      else if (Array.isArray(response)) {
        newArticles = response.map(article => {
          return {
            ...article,
            date: formatDate(article.createTime || article.updateTime || new Date())
          };
        });
        totalCount.value = response.length;
      }
      // 其他格式，兼容处理
      else if (typeof response === 'object') {
        const possibleData = response.records || response.list || response.items || response.content || [];
        newArticles = Array.isArray(possibleData) ? possibleData.map(article => {
          return {
            ...article,
            date: formatDate(article.createTime || article.updateTime || new Date())
          };
        }) : [];
        totalCount.value = response.total || response.totalCount || response.count || newArticles.length || 0;
      }
      
      // 使用nextTick确保DOM更新后再替换数据
      nextTick(() => {
        // 替换数据，一次性更新避免多次重绘
        articles.value = newArticles
        // 首次加载后标记动画已播放
        hasAnimated.value = true
      })
    }
  } catch (error) {
    console.error('获取文章列表失败', error);
    articles.value = [];
  } finally {
    // 延迟关闭加载状态
    setTimeout(() => {
      initialLoading.value = false;
      switchLoading.value = false;
      isDataSwitching.value = false;
      silentLoading.value = false;
    }, 300);
  }
}

// 日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // 如果解析失败，直接返回原字符串
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    console.error('日期格式化错误:', e);
    return dateString;
  }
}

// 获取所有分类
const fetchCategories = async () => {
  try {
    const response = await api.article.getCategories()
    if (response && response.code === 200) {
      categories.value = response.data || []
    }
  } catch (error) {
    console.error('获取分类列表失败', error)
  }
}

// 获取所有标签
const fetchTags = async () => {
  try {
    const response = await api.article.getTags()
    if (response && response.code === 200) {
      tags.value = response.data || []
      
      // 获取标签后，重新计算每个标签的数量
      calculateTagCounts()
    }
  } catch (error) {
    console.error('获取标签列表失败', error)
  }
}

// 计算每个标签的文章数量
const calculateTagCounts = () => {
  // 这里理想情况是从后端获取每个标签的文章数量
  // 暂时设置为1，后续可以修改API返回每个标签的文章数量
  const counts = {}
  tags.value.forEach(tag => {
    counts[tag] = 1
  })
  tagCounts.value = counts
}

// 切换页码
const handlePageChange = (page) => {
  currentPage.value = page
}

// 设置分类，不显示加载状态
const setCategory = (category) => {
  if (category === currentCategory.value) return
  currentCategory.value = category
  currentTag.value = null // 切换分类时清除标签筛选
  currentPage.value = 1   // 重置为第一页
}

// 设置标签，不显示加载状态
const setTag = (tag) => {
  currentTag.value = tag === currentTag.value ? null : tag
  currentPage.value = 1   // 重置为第一页
}

// 获取网站设置
const fetchSiteSettings = async () => {
  try {
    const response = await api.site.getSiteSetting()
    if (response && response.code === 200) {
      siteSettings.value = response.data || {}
    }
  } catch (error) {
    console.error('获取网站设置失败', error)
  }
}

// 监听路由变化
watch(() => route.name, (newRoute) => {
  if (newRoute === 'essay') {
    currentCategory.value = 'essay'
  } else if (newRoute === 'timeline') {
    currentCategory.value = 'timeline'
  } else if (newRoute === 'home') {
    currentCategory.value = 'all'
  }
  fetchArticles()
}, { immediate: true })

// 监听筛选条件变化
watch([() => currentCategory.value, () => currentTag.value, () => currentPage.value], () => {
  fetchArticles()
})

// 页面加载时获取数据
onMounted(() => {
  fetchCategories()
  fetchTags()
  fetchSiteSettings()
  silentLoading.value = true
})
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
        <div 
          v-for="category in categories" 
          :key="category" 
          class="nav-item" 
          :class="{ active: currentCategory === category }" 
          @click="setCategory(category)"
        >
          {{ category }}
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div class="articles-container">
        <div v-if="silentLoading" class="skeleton-container">
          <div v-for="i in 3" :key="i" class="skeleton-item">
            <div class="skeleton-header"></div>
            <div class="skeleton-content"></div>
            <div class="skeleton-footer"></div>
          </div>
        </div>
        
        <div v-else-if="initialLoading && !silentLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载文章...</p>
        </div>
        
        <div v-else-if="articles.length === 0 && !isDataSwitching && !silentLoading" class="no-articles">
          <div class="empty-icon">📄</div>
          <p>没有找到符合条件的文章</p>
        </div>
        
        <div 
          v-else-if="articles.length > 0"
          class="article-list"
          :class="{ 'switching': switchLoading }"
        >
          <div 
            v-for="article in articles" 
            :key="article.id" 
            class="article-item"
            :class="{ 'with-animation': !hasAnimated }"
          >
            <ArticleListItem 
              :article="article"
              @click="viewArticle(article.id)"
            />
          </div>
        </div>
        
        <!-- 分页器 -->
        <div v-if="totalCount > 0" class="pagination">
          <button 
            :disabled="currentPage === 1" 
            @click="handlePageChange(currentPage - 1)"
            class="page-btn"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ Math.ceil(totalCount / pageSize) }}</span>
          <button 
            :disabled="currentPage >= Math.ceil(totalCount / pageSize)" 
            @click="handlePageChange(currentPage + 1)"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 个人介绍卡片 -->
        <div class="intro-card">
          <h2>👋 中午好！这里是</h2>
          <h1>{{ siteSettings.title }}</h1>
          <p>{{ siteSettings.description }}</p>
          <p>{{ siteSettings.slogan }}</p>
          <div class="social-links">
            <a v-for="link in siteSettings.socialLinks" :key="link" :href="link" class="social-link"></a>
          </div>
          <div class="avatar">
            <img :src="siteSettings.avatar" alt="头像">
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
              <span class="tag-count">{{ tagCounts[tag] || 0 }}</span>
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
  overflow-x: auto;
}

.nav-item {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
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
  min-height: 600px; /* 最小高度约束 */
  position: relative;
  overflow: hidden; /* 防止溢出内容导致的闪烁 */
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  min-height: 450px; /* 确保列表也有最小高度 */
}

/* 文章项容器 - 默认无动画 */
.article-item {
  transition: opacity 0.2s ease;
}

/* 只有带with-animation类的元素才应用动画 */
.article-item.with-animation {
  animation: fadeIn 0.3s ease forwards;
}

/* 简单的淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态 */
.loading-state,
.no-articles {
  background-color: white;
  border-radius: 8px;
  padding: 40px 30px;
  text-align: center;
  color: #666;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #11754b;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.no-articles p {
  color: #888;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 页面过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 分页器样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

.page-btn {
  padding: 8px 16px;
  background-color: #11754b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #0d5f3d;
}

.page-btn:disabled {
  background-color: #88c5aa;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
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

/* 骨架屏样式 */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  min-height: 450px; /* 与article-list保持一致 */
}

.skeleton-item {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: pulse 1.5s infinite;
  height: 160px;
}

.skeleton-header {
  height: 24px;
  background-color: #eee;
  border-radius: 4px;
  margin-bottom: 15px;
  width: 70%;
}

.skeleton-content {
  height: 80px;
  background-color: #eee;
  border-radius: 4px;
  margin-bottom: 15px;
}

.skeleton-footer {
  height: 16px;
  background-color: #eee;
  border-radius: 4px;
  width: 40%;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style> 