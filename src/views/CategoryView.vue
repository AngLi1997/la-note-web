<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleListItem from '../components/ArticleListItem.vue'
import { ElMessage } from 'element-plus'

const api = inject('api')
const route = useRoute()
const router = useRouter()
const category = computed(() => route.params.category)
const isAnimating = ref(false)
const loading = ref(false)
const articles = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取分类下的文章列表
const fetchArticlesByCategory = async () => {
  if (!category.value) return
  
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      category: category.value,
      status: 1, // 只查已发布
      includeContent: true // 添加参数，请求包含文章内容
    }
    
    const response = await api.article.getArticlesList(params)
    
    if (response && response.code === 200) {
      if (response.data.list) {
        articles.value = response.data.list.map(article => ({
          ...article,
          date: article.createTime ? formatDate(article.createTime) : formatDate(new Date()),
          thumbnail: article.thumbnail || ''
        }))
        totalCount.value = response.data.total || 0
      } else if (Array.isArray(response.data)) {
        articles.value = response.data.map(article => ({
          ...article,
          date: article.createTime ? formatDate(article.createTime) : formatDate(new Date()),
          thumbnail: article.thumbnail || ''
        }))
        totalCount.value = response.data.length
      }
    } else {
      articles.value = []
      ElMessage.error('获取文章列表失败')
    }
  } catch (error) {
    console.error('获取分类文章失败:', error)
    ElMessage.error('获取文章列表失败')
    articles.value = []
  } finally {
    loading.value = false
  }
}

// 日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    console.error('日期格式化错误:', e)
    return dateString
  }
}

const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

// 监听路由变化，获取新分类的文章
watch(() => route.params.category, () => {
  isAnimating.value = true
  fetchArticlesByCategory()
  setTimeout(() => {
    isAnimating.value = false
  }, 50)
}, { immediate: true })

// 页码变化时重新获取数据
const handlePageChange = (page) => {
  currentPage.value = page
  fetchArticlesByCategory()
}

onMounted(() => {
  fetchArticlesByCategory()
})
</script>

<template>
  <div class="category-view">
    <h1 class="fade-in">{{ category }} 分类文章</h1>
    
    <div v-if="loading" class="loading-state fade-in">
      加载中...
    </div>
    
    <div v-else-if="articles.length" class="articles-list">
      <div class="list-container">
        <ArticleListItem 
          v-for="(article, index) in articles" 
          :key="article.id" 
          :article="article"
          class="list-item"
          @click="viewArticle(article.id)"
        />
      </div>
      
      <!-- 分页器 -->
      <div v-if="totalCount > pageSize" class="pagination fade-in">
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
    
    <div v-else class="empty-state fade-in">
      该分类下暂无文章
    </div>
  </div>
</template>

<style scoped>
.category-view {
  padding: 20px 0;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
  text-transform: capitalize;
  padding: 0 20px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
}

.list-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-item {
  animation: showItem 0.5s ease-out forwards;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}

/* 分页器样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

.page-btn {
  padding: 8px 15px;
  background-color: #f0f7f4;
  color: #11754b;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #11754b;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
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