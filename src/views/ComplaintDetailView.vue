<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 使用注入的API
const api = inject('api')
const route = useRoute()
const router = useRouter()

const complaint = ref(null)
const loading = ref(true)
const complaintId = route.params.id

// 获取吐槽详情
const fetchComplaintDetail = async () => {
  loading.value = true
  try {
    const response = await api.complaint.getComplaintById(complaintId)
    if (response.code === 200) {
      complaint.value = response.data
    } else {
      ElMessage.error(response.msg || '获取吐槽详情失败')
      complaint.value = null
    }
  } catch (error) {
    console.error('获取吐槽详情失败', error)
    ElMessage.error('获取吐槽详情失败，请稍后重试')
    complaint.value = null
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    console.error('日期格式化错误:', e)
    return dateString
  }
}

// 心情标签对应的表情和颜色
const getMoodEmoji = (mood) => {
  const moods = {
    '开心': { emoji: '😄', color: '#4CAF50' },
    '悲伤': { emoji: '😢', color: '#2196F3' },
    '生气': { emoji: '😡', color: '#F44336' },
    '焦虑': { emoji: '😓', color: '#FF9800' },
    '无奈': { emoji: '😕', color: '#9C27B0' },
    '兴奋': { emoji: '🤩', color: '#FF5722' },
    '疲惫': { emoji: '😪', color: '#795548' },
    'default': { emoji: '😐', color: '#607D8B' }
  }
  
  return moods[mood] || moods.default
}

// 返回列表页
const goBack = () => {
  router.push({ name: 'complaints' })
}

// 页面加载时获取数据
onMounted(() => {
  fetchComplaintDetail()
})
</script>

<template>
  <div class="complaint-detail-view">
    <div class="container">
      <div class="back-button" @click="goBack">
        &larr; 返回列表
      </div>
      
      <div v-if="loading" class="loading-state">
        加载中...
      </div>
      
      <div v-else-if="!complaint" class="not-found">
        未找到该吐槽内容
      </div>
      
      <div v-else class="complaint-content">
        <div class="complaint-header">
          <div 
            v-if="complaint.mood" 
            class="complaint-mood"
            :style="{ backgroundColor: getMoodEmoji(complaint.mood).color }"
          >
            {{ getMoodEmoji(complaint.mood).emoji }}
          </div>
          <h1 class="complaint-title">{{ complaint.title }}</h1>
        </div>
        
        <div class="complaint-meta">
          <span class="complaint-date">{{ formatDate(complaint.createTime) }}</span>
        </div>
        
        <div class="complaint-body">
          <p class="complaint-text">{{ complaint.content }}</p>
          
          <div v-if="complaint.images && complaint.images.length > 0" class="complaint-images">
            <div 
              v-for="(image, index) in complaint.images" 
              :key="index" 
              class="image-wrapper"
            >
              <img :src="image" :alt="`吐槽图片${index + 1}`">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.complaint-detail-view {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.container {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.loading-state,
.not-found {
  padding: 40px 0;
  text-align: center;
  color: #666;
  font-size: 16px;
}

.complaint-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.complaint-mood {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
}

.complaint-title {
  margin: 0;
  font-size: 28px;
  color: #333;
  line-height: 1.3;
}

.complaint-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  font-size: 14px;
  color: #666;
}

.complaint-body {
  margin-top: 20px;
}

.complaint-text {
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  white-space: pre-line;
  margin-bottom: 30px;
}

.complaint-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.image-wrapper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.image-wrapper:hover img {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  
  .complaint-title {
    font-size: 22px;
  }
  
  .complaint-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .complaint-images {
    grid-template-columns: 1fr;
  }
}
</style> 