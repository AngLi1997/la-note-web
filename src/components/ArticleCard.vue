<script setup>
import { defineProps, defineEmits, computed } from 'vue'

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

defineEmits(['click'])
</script>

<template>
  <div class="article-list-item" @click="$emit('click')" :class="{ 'no-thumbnail': !hasThumbnail }">
    <div class="article-content">
      <div v-if="hasThumbnail" class="thumbnail-container">
        <img class="thumbnail" :src="article.thumbnail" :alt="article.title" />
      </div>
      <div class="text-content">
        <h2 class="title">{{ article.title }}</h2>
        <div class="meta">
          <span class="date">{{ article.date }}</span>
          <span class="category" v-if="article.category">{{ article.category }}</span>
        </div>
        <p class="summary">{{ article.summary }}</p>
        <div class="footer">
          <div class="tags" v-if="article.tags && article.tags.length">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="read-more">阅读全文</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-list-item {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
  transition: all 0.3s;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.article-list-item:hover {
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
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

.article-content {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.thumbnail-container {
  flex: 0 0 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 6px;
  overflow: hidden;
  height: auto;
  align-self: stretch;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-list-item:hover .thumbnail {
  transform: scale(1.05);
}

.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}

.meta {
  display: flex;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.meta .date {
  margin-right: 15px;
}

.meta .category {
  text-transform: capitalize;
}

.summary {
  margin-bottom: 15px;
  color: #666;
  line-height: 1.6;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.read-more {
  color: #3498db;
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 600px) {
  .thumbnail-container {
    display: none;
  }
  
  .article-content {
    gap: 0;
  }
  
  .article-list-item.no-thumbnail::before {
    width: 3px;
  }
}
</style> 