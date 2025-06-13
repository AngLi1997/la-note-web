<script setup>
import { computed } from 'vue'
import { getMoodEmoji } from '../utils/moodUtils'

const props = defineProps({
  complaint: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}

// 格式化日期 
const formattedDate = computed(() => {
  if (!props.complaint.date) return ''
  return props.complaint.date
})

// 提取第一张图片作为缩略图
const thumbnailImage = computed(() => {
  if (!props.complaint.images || props.complaint.images.length === 0) {
    return null
  }
  return props.complaint.images[0]
})

// 使用导入的getMoodEmoji函数
const moodEmoji = computed(() => {
  return getMoodEmoji(props.complaint.mood)
})

// 判断是否有图片
const hasImage = computed(() => {
  return thumbnailImage.value !== null
})
</script>

<template>
  <div class="complaint-item" @click="handleClick" :class="{ 'no-image': !hasImage }">
    <div class="complaint-content">
      <div class="complaint-header">
        <div class="complaint-mood" :style="{ backgroundColor: moodEmoji.color }">
          {{ moodEmoji.emoji }}
        </div>
        <h3 class="complaint-title">{{ complaint.title }}</h3>
      </div>
      
      <p class="complaint-text">{{ complaint.content }}</p>
      
      <div class="complaint-meta">
        <span class="complaint-date">{{ formattedDate }}</span>
      </div>
    </div>
    
    <div v-if="hasImage" class="complaint-image">
      <img :src="thumbnailImage" alt="拾光配图">
    </div>
  </div>
</template>

<style scoped>
.complaint-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  cursor: pointer;
  padding: 16px;
}

.complaint-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.complaint-item.no-image {
  position: relative;
}

.complaint-item.no-image::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #11754b, #88c5aa);
  border-radius: 8px 0 0 8px;
}

.complaint-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.complaint-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.complaint-mood {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 20px;
}

.complaint-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.complaint-text {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.complaint-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.like-icon {
  font-size: 14px;
}

.complaint-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  margin-left: 15px;
  flex-shrink: 0;
}

.complaint-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 600px) {
  .complaint-image {
    display: none;
  }
  
  .complaint-item {
    padding: 12px;
  }
  
  .complaint-title {
    font-size: 16px;
  }
  
  .complaint-text {
    -webkit-line-clamp: 2;
    font-size: 13px;
  }
  
  .complaint-item.no-image::before {
    width: 3px;
  }
}
</style> 