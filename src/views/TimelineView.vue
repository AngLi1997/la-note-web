<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'

// 注入API
const api = inject('api')

// 数据状态
const timelineEvents = ref([])
const filterCategory = ref('all')
const categories = ref(['all'])
const loading = ref(false)

// 获取时间轴事件数据
const fetchTimelineEvents = async () => {
  const loadingInstance = ElLoading.service({
    target: '.timeline-view',
    text: '加载中...'
  })
  
  loading.value = true
  
  try {
    const response = await api.timeline.getTimelineEvents()
    timelineEvents.value = response.data || []
    
    // 获取分类
    await fetchCategories()
  } catch (error) {
    console.error('获取时间轴数据失败:', error)
    ElMessage.error('获取时间轴数据失败')
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}

// 获取分类数据
const fetchCategories = async () => {
  try {
    const response = await api.timeline.getTimelineCategories()
    const categorySet = new Set(['all'])
    
    // 如果后端返回了分类数据，使用后端数据
    if (response.data && response.data.length > 0) {
      response.data.forEach(category => categorySet.add(category))
    } else {
      // 否则从事件数据中提取分类
      timelineEvents.value.forEach(event => {
        if (event.category) {
          categorySet.add(event.category)
        }
      })
    }
    
    categories.value = Array.from(categorySet)
  } catch (error) {
    console.error('获取分类数据失败:', error)
    // 从事件中提取分类作为备选
    const extractedCategories = new Set(['all'])
    timelineEvents.value.forEach(event => {
      if (event.category) {
        extractedCategories.add(event.category)
      }
    })
    categories.value = Array.from(extractedCategories)
  }
}

const filteredEvents = computed(() => {
  if (filterCategory.value === 'all') {
    return timelineEvents.value
  }
  return timelineEvents.value.filter(event => event.category === filterCategory.value)
})

const setFilter = (category) => {
  filterCategory.value = category
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTimelineEvents()
})
</script>

<template>
  <div class="timeline-view">
    <div class="container">
      <header class="page-header">
        <h1>时间轴</h1>
        <p class="subtitle">记录成长与学习的足迹</p>
      </header>
      
      <div class="filter-container">
        <div 
          v-for="category in categories" 
          :key="category"
          :class="['filter-item', filterCategory === category ? 'active' : '']"
          @click="setFilter(category)"
        >
          {{ category === 'all' ? '全部' : category }}
        </div>
      </div>
      
      <!-- 空数据提示 -->
      <div v-if="!loading && filteredEvents.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>暂无时间轴数据</h3>
        <p>当前分类下没有可显示的事件</p>
      </div>
      
      <div v-else class="timeline-container">
        <div class="timeline-line"></div>
        
        <div 
          v-for="event in filteredEvents" 
          :key="event.id"
          class="timeline-item"
        >
          <div class="timeline-icon">{{ event.icon || '📝' }}</div>
          <div class="timeline-content">
            <div class="timeline-date">{{ event.date }}</div>
            <div class="timeline-category">{{ event.category }}</div>
            <h3 class="timeline-title">{{ event.title }}</h3>
            <p class="timeline-text">{{ event.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-view {
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
}

.filter-item:hover {
  background-color: #f0f7f4;
}

.filter-item.active {
  background-color: #11754b;
  color: white;
}

.timeline-container {
  position: relative;
  padding-left: 40px;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15px;
  width: 2px;
  background-color: #11754b;
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
  animation: fadeIn 0.6s ease-out forwards;
}

.timeline-icon {
  position: absolute;
  left: -40px;
  width: 40px;
  height: 40px;
  background-color: #11754b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.timeline-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
}

.timeline-content::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 20px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid white;
}

.timeline-date {
  color: #11754b;
  font-weight: 500;
  margin-bottom: 5px;
}

.timeline-category {
  display: inline-block;
  background-color: #f0f7f4;
  color: #11754b;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 1.3rem;
  margin: 0 0 12px 0;
  color: #333;
}

.timeline-text {
  color: #555;
  line-height: 1.6;
  margin: 0;
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

@media (max-width: 768px) {
  .timeline-container {
    padding-left: 30px;
  }
  
  .timeline-line {
    left: 10px;
  }
  
  .timeline-icon {
    left: -30px;
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
}

.empty-state {
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
</style> 