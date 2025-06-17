<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { ElImageViewer } from 'element-plus'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

// 检查文章是否有有效的缩略图
const hasThumbnail = computed(() => {
  return props.article.thumbnail && typeof props.article.thumbnail === 'string' && props.article.thumbnail.trim() !== '';
})

// 处理不同格式的标签（字符串或数组）
const getArticleTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  return [];
}

// 图片预览相关
const showViewer = ref(false)
const previewImages = ref([])

// 点击图片时预览
const handleImageClick = (event) => {
  event.stopPropagation() // 阻止冒泡，避免触发文章点击事件
  if (hasThumbnail.value) {
    previewImages.value = [props.article.thumbnail]
    showViewer.value = true
  }
}

// 关闭图片预览
const closeViewer = () => {
  showViewer.value = false
}

defineEmits(['click'])
</script>

<template>
  <div class="article-list-item" @click="$emit('click')" :class="{ 'no-thumbnail': !hasThumbnail }">
    <div v-if="hasThumbnail" class="article-image" @click.stop="handleImageClick">
      <img :src="article.thumbnail" :alt="article.title"/>
    </div>
    <div class="article-content">
      <h2 class="article-title">{{ article.title }}</h2>
      <p class="article-summary" v-if="article.summary">{{ article.summary }}</p>
      <div class="article-meta">
        <span class="article-category" v-if="article.category">{{ article.category }}</span>
        <span class="article-date">{{ article.date }}</span>
        <span class="article-views"><i class="view-icon"></i>{{ article.viewCount || 0 }}</span>
      </div>
      <div class="article-tags" v-if="article.tags && article.tags.length">
        <span class="tag" v-for="(tag, index) in getArticleTags(article.tags)" :key="index">{{ tag }}</span>
      </div>
    </div>
    
    <!-- 图片预览组件 -->
    <el-image-viewer
      v-if="showViewer"
      :url-list="previewImages"
      :initial-index="0"
      :hide-on-click-modal="true"
      @close="closeViewer"
    />
  </div>
</template>

<style scoped>
.article-list-item {
  display: flex;
  gap: 15px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-items: center;
}

.article-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-list-item.no-thumbnail {
  position: relative;
}

.article-list-item.no-thumbnail::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #11754b, #88c5aa);
  border-radius: 8px 0 0 8px;
}

.article-image {
  flex: 0 0 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 6px;
  background-color: #f5f5f5;
  position: relative;
  cursor: zoom-in;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.article-summary {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.article-category {
  display: inline-block;
  background-color: #f0f7f4;
  color: #11754b;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888888'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
  background-size: contain;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  background-color: #f0f9f4;
  color: #11754b;
  border-radius: 4px;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .article-image {
    display: block;
    flex: 0 0 80px;
    height: 80px;
  }
  
  .article-list-item.no-thumbnail::before {
    width: 3px;
  }
}
</style> 