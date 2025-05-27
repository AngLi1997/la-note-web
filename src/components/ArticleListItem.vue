<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<template>
  <div class="article-list-item" @click="$emit('click')">
    <div class="article-image">
      <img :src="article.thumbnail" :alt="article.title" />
    </div>
    <div class="article-content">
      <h2 class="article-title">{{ article.title }}</h2>
      <div class="article-date">{{ article.date }}</div>
    </div>
  </div>
</template>

<style scoped>
.article-list-item {
  display: flex;
  gap: 15px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.article-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-image {
  flex: 0 0 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 6px;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.article-date {
  font-size: 14px;
  color: #888;
}
</style> 