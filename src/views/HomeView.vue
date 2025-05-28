<script setup>
import { ref, onMounted, computed, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleListItem from '../components/ArticleListItem.vue'

// 从插件中获取配置好的axios实例
const axios = inject('axios')

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

const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

const currentCategory = ref(props.defaultCategory)
const currentTag = ref(null)

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
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
    
    const response = await axios.get('/articles/list', { params })
    console.log('文章列表响应数据:', response) // 添加日志查看响应结构
    
    // 处理不同的响应结构
    if (response) {
      if (response.code === 200 && response.data) {
        // 处理格式: {code: 200, msg: "success", data: { pageNum, pageSize, total, pages, list: [] }}
        if (response.data.list) {
          articles.value = response.data.list.map(article => {
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
          articles.value = response.data.records.map(article => {
            return {
              ...article,
              date: formatDate(article.createTime || article.updateTime || new Date())
            };
          });
          totalCount.value = response.data.total || 0;
        } 
        // 格式: { code: 200, data: [] }
        else if (Array.isArray(response.data)) {
          articles.value = response.data.map(article => {
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
        articles.value = response.map(article => {
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
        articles.value = Array.isArray(possibleData) ? possibleData.map(article => {
          return {
            ...article,
            date: formatDate(article.createTime || article.updateTime || new Date())
          };
        }) : [];
        totalCount.value = response.total || response.totalCount || response.count || articles.value.length || 0;
      }
      
      console.log('处理后的文章数据:', articles.value); // 添加日志查看处理后的数据
    }
  } catch (error) {
    console.error('获取文章列表失败', error);
    articles.value = [];
  } finally {
    loading.value = false;
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
    const response = await axios.get('/articles/categories')
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
    const response = await axios.get('/articles/tags')
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

const setCategory = (category) => {
  currentCategory.value = category
  currentTag.value = null // 切换分类时清除标签筛选
  currentPage.value = 1   // 重置为第一页
}

const setTag = (tag) => {
  currentTag.value = tag === currentTag.value ? null : tag
  currentPage.value = 1   // 重置为第一页
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
        <div v-if="loading" class="loading-state">
          加载中...
        </div>
        <div v-else-if="articles.length === 0" class="no-articles">
          没有找到符合条件的文章
        </div>
        <ArticleListItem 
          v-else
          v-for="article in articles" 
          :key="article.id" 
          :article="article"
          @click="viewArticle(article.id)"
        />
        
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
}

.loading-state,
.no-articles {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  color: #666;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
</style> 