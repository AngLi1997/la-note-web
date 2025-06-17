<script setup>
import { ref, onMounted, computed, watch, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ComplaintListItem from '../components/ComplaintListItem.vue'
import { getMoodEmoji } from '../utils/moodUtils'

// 使用注入的API
const api = inject('api')

const router = useRouter()
const complaints = ref([])
const types = ref([])
const moods = ref([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 添加新的变量来区分初始加载和切换加载
const initialLoading = ref(true)
const switchLoading = ref(false)
const oldComplaints = ref([])
const silentLoading = ref(false) // 移除静默加载，改用fadeIn动画

// 分页信息
const pagination = computed(() => ({
  current: currentPage.value,
  total: totalCount.value,
  pageSize: pageSize.value
}))

const viewComplaint = (id) => {
  router.push({ name: 'moment', params: { id } })
}

const currentType = ref(null)
const currentMood = ref(null)

// 处理文章数据，确保每个文章都有正确的图片信息
const processComplaintData = (complaint) => {
  // 检查是否有图片数组且不为空
  const hasValidImages = complaint.images && Array.isArray(complaint.images) && complaint.images.length > 0
  
  return {
    ...complaint,
    date: formatDate(complaint.createTime || complaint.updateTime || new Date()),
    // 确保images属性存在且为数组
    images: hasValidImages ? complaint.images : []
  }
}

// 获取拾光列表
const fetchComplaints = async () => {
  const isInitial = complaints.value.length === 0
  
  if (isInitial) {
    initialLoading.value = true
  } else {
    // 切换标签时，保存旧数据并设置切换状态
    switchLoading.value = true
    oldComplaints.value = [...complaints.value]
  }
  
  try {
    // 构建查询参数
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    
    // 添加类型筛选
    if (currentType.value) {
      params.type = currentType.value
    }
    
    // 添加心情筛选
    if (currentMood.value) {
      params.mood = currentMood.value
    }
    
    const response = await api.complaint.getComplaintsList(params)
    
    // 处理响应数据
    let newComplaints = []
    
    if (response && response.code === 200 && response.data) {
      if (response.data.list) {
        newComplaints = response.data.list.map(complaint => ({
          ...complaint,
          date: complaint.createTime ? formatDate(complaint.createTime) : formatDate(new Date()),
        }))
        totalCount.value = response.data.total || 0
      } else if (Array.isArray(response.data)) {
        newComplaints = response.data.map(processComplaintData)
        totalCount.value = response.data.length
      }
      
      // 使用nextTick确保DOM更新后再替换数据
      nextTick(() => {
        // 替换数据，一次性更新避免多次重绘
        complaints.value = newComplaints
      })
    }
  } catch (error) {
    console.error('获取拾光列表失败', error)
    complaints.value = []
  } finally {
    // 延迟关闭加载状态
    setTimeout(() => {
      initialLoading.value = false
      switchLoading.value = false
    }, 300)
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

// 获取所有心情标签
const fetchMoods = async () => {
  try {
    const response = await api.complaint.getMoods()
    if (response && response.code === 200) {
      moods.value = response.data || []
    }
  } catch (error) {
    console.error('获取心情标签失败', error)
  }
}

// 切换页码
const handlePageChange = (page) => {
  currentPage.value = page
}

const setType = (type) => {
  currentType.value = type === currentType.value ? null : type
  currentPage.value = 1   // 重置为第一页
}

const setMood = (mood) => {
  currentMood.value = mood === currentMood.value ? null : mood
  currentPage.value = 1   // 重置为第一页
}

// 监听筛选条件变化
watch([() => currentType.value, () => currentMood.value, () => currentPage.value], () => {
  fetchComplaints()
})

// 页面加载时获取数据
onMounted(() => {
  fetchComplaints()
  fetchMoods()
})
</script>

<template>
  <div class="complaints-view">
    <div class="container">
      <header class="page-header">
        <h1>拾光</h1>
        <p class="subtitle">拾起光阴里的点滴，记录当下。</p>
      </header>
      
      <!-- 筛选器 -->
      <div class="filter-container">
        <div 
          v-for="mood in moods" 
          :key="mood" 
          :class="['filter-item', currentMood === mood ? 'active' : '']"
          @click="setMood(mood)"
        >
          {{ getMoodEmoji(mood).emoji }} {{ mood }}
        </div>
      </div>
      
      <!-- 拾光列表 -->
      <div class="complaints-container">
        <div v-if="complaints.length === 0 && !switchLoading && !initialLoading" class="empty-state">
          <div class="empty-icon">📝</div>
        </div>
        <div v-else-if="initialLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        <div v-else class="complaint-items">
          <div 
            v-for="(complaint, index) in complaints.length ? complaints : oldComplaints" 
            :key="complaint.id" 
            class="complaint-item-wrapper"
          >
            <ComplaintListItem 
              :complaint="complaint"
              @click="viewComplaint(complaint.id)"
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
    </div>
  </div>
</template>

<style scoped>
.complaints-view {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 10px;
}

/* 淡入动画 */
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

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.filter-item {
  padding: 8px 16px;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-item:hover {
  background-color: #f0f7f4;
}

.filter-item.active {
  background-color: #11754b;
  color: white;
}

.complaints-container {
  margin-top: 20px;
}

.empty-state,
.loading-state {
  background-color: white;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #11754b;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #333;
}

.empty-state p {
  color: #666;
  margin: 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(17, 117, 75, 0.2);
  border-top-color: #11754b;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

@media (max-width: 768px) {
  .complaints-view {
    padding: 20px 0;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}

.complaint-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 200px; /* 保持最小高度，减少布局跳动 */
  position: relative;
}

.complaint-item-wrapper {
  animation: fadeIn 0.6s ease-out forwards;
}
</style> 