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
        newComplaints = response.data.list.map(processComplaintData)
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
    <h1 class="page-title fade-in">拾光</h1>
    <p class="page-description fade-in" style="animation-delay: 0.1s">拾起光阴里的点滴，记录当下。</p>
    
    <!-- 筛选器 -->
    <div class="filters fade-in" style="animation-delay: 0.2s">
      <div class="filter-section">
        <h3 class="filter-title">心情标签</h3>
        <div class="filter-tags">
          <div 
            v-for="mood in moods" 
            :key="mood" 
            class="filter-tag mood-tag"
            :class="{ active: currentMood === mood }"
            @click="setMood(mood)"
          >
            {{ getMoodEmoji(mood).emoji }} {{ mood }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 拾光列表 -->
    <div class="complaints-container">
      <div v-if="complaints.length === 0 && !switchLoading && !initialLoading" class="no-complaints fade-in">
        没有找到符合条件的拾光
      </div>
      <div v-else-if="initialLoading" class="loading-state fade-in">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      <div v-else class="complaint-items">
        <div 
          v-for="(complaint, index) in complaints.length ? complaints : oldComplaints" 
          :key="complaint.id" 
          class="complaint-item-wrapper fade-in"
          :style="{ 'animation-delay': `${0.3 + index * 0.1}s` }"
        >
          <ComplaintListItem 
            :complaint="complaint"
            @click="viewComplaint(complaint.id)"
          />
        </div>
      </div>
      
      <!-- 分页器 -->
      <div v-if="totalCount > 0" class="pagination fade-in" style="animation-delay: 0.6s">
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
</template>

<style scoped>
.complaints-view {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  margin-bottom: 10px;
  color: #333;
}

.page-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
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

.filters {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-section {
  margin-bottom: 15px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-size: 16px;
  margin: 0 0 10px 0;
  color: #333;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  padding: 8px 16px;
  background-color: white;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.filter-tag:hover {
  background-color: #f0f7f4;
}

.filter-tag.active {
  background-color: #11754b;
  color: white;
}

.mood-tag {
  display: flex;
  align-items: center;
  gap: 5px;
}

.complaints-container {
  margin-top: 20px;
}

.loading-state,
.no-complaints {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  color: #666;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
    padding: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .filters {
    padding: 15px;
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
  /* 应用淡入动画效果 */
}
</style> 