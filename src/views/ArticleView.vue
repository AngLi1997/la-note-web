<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { ElMessage, ElLoading } from 'element-plus'

const api = inject('api')
const route = useRoute()
const router = useRouter()
const article = ref(null)
const loading = ref(false)
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// 格式化日期
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

// 获取文章详情
const fetchArticle = async () => {
  const id = route.params.id
  if (!id) {
    ElMessage.error('文章ID不能为空')
    router.push('/')
    return
  }
  
  loading.value = true
  const loadingInstance = ElLoading.service({
    target: '.article-view',
    text: '文章加载中...'
  })
  
  try {
    const response = await api.article.getArticleById(id)
    
    if (response && response.code === 200) {
      article.value = {
        ...response.data,
        date: formatDate(response.data.createTime || response.data.updateTime)
      }
    } else {
      ElMessage.error(response?.msg || '获取文章失败')
      router.push('/')
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
    ElMessage.error('获取文章详情失败')
    router.push('/')
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div class="article-view">
    <div v-if="article" class="article-container">
      <h1 class="title fade-in">{{ article.title }}</h1>
      
      <div class="meta fade-in" style="animation-delay: 0.1s">
        <span class="date">{{ article.date }}</span>
        <span class="category" v-if="article.category">分类: {{ article.category }}</span>
        <span class="views"><i class="views-icon"></i>{{ article.viewCount || 0 }}</span>
      </div>
      
      <div class="tags fade-in" style="animation-delay: 0.2s" v-if="article.tags && article.tags.length">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      
      <div class="content fade-in markdown-body" style="animation-delay: 0.3s" v-html="md.render(article.content || '')"></div>
    </div>
    <div v-else-if="loading" class="loading fade-in">
      加载中...
    </div>
    <div v-else class="error fade-in">
      文章不存在或已被删除
    </div>
  </div>
</template>

<style scoped>
.article-view {
  min-height: 80vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 32px;
  margin-bottom: 15px;
  color: #333;
  line-height: 1.3;
}

.meta {
  margin-bottom: 15px;
  color: #666;
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.views-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888888'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
  background-size: contain;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.tag {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.content {
  line-height: 1.8;
  color: #333;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(code) {
  background-color: rgba(27, 31, 35, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 85%;
}

.markdown-body :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
  display: block;
  overflow-x: auto;
  line-height: 1.5;
}

.markdown-body :deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
  border-radius: 3px;
}

.markdown-body :deep(ul), 
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #f56c6c;
}

/* 淡入动画 */
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

@media (max-width: 768px) {
  .article-container {
    padding: 20px;
    margin: 0 15px;
  }
  
  .title {
    font-size: 24px;
  }
}
</style> 