<script setup>
import { ref, onMounted, inject, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { ElMessage, ElLoading, ElImageViewer } from 'element-plus'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 导入一个代码高亮主题，可以选择其他主题

const api = inject('api')
const route = useRoute()
const router = useRouter()
const article = ref(null)
const loading = ref(false)

// 图片预览相关
const showViewer = ref(false)
const previewImages = ref([])
const previewIndex = ref(0)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code class="language-' + lang + '">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    // 使用默认的转义
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})

// 添加复制代码功能
const setupCodeCopyButtons = () => {
  nextTick(() => {
    const preElements = document.querySelectorAll('.markdown-body pre');
    
    preElements.forEach((pre, index) => {
      // 检查是否已经添加了复制按钮
      if (pre.querySelector('.copy-btn')) return;
      
      // 创建复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = '复制';
      copyBtn.setAttribute('data-index', index);
      
      // 添加按钮到代码块
      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
      
      // 添加点击事件
      copyBtn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (code) {
          const textToCopy = code.textContent || '';
          
          // 使用 Clipboard API 复制文本
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              // 复制成功，更改按钮文本
              copyBtn.textContent = '已复制';
              copyBtn.classList.add('copied');
              
              // 2秒后恢复按钮文本
              setTimeout(() => {
                copyBtn.textContent = '复制';
                copyBtn.classList.remove('copied');
              }, 2000);
            })
            .catch(err => {
              console.error('复制失败:', err);
              ElMessage.error('复制失败，请手动复制');
            });
        }
      });
    });
  });
};

// 设置图片点击事件
const setupImageClickHandlers = () => {
  nextTick(() => {
    const contentImages = document.querySelectorAll('.markdown-body img');
    const allImageUrls = Array.from(contentImages).map(img => img.src);
    
    contentImages.forEach((img, index) => {
      // 添加鼠标样式
      img.style.cursor = 'zoom-in';
      
      // 移除已有的事件监听器（如果有的话）
      const clonedImg = img.cloneNode(true);
      img.parentNode.replaceChild(clonedImg, img);
      
      // 添加点击事件
      clonedImg.addEventListener('click', (event) => {
        event.preventDefault();
        previewImages.value = allImageUrls;
        previewIndex.value = index;
        showViewer.value = true;
      });
    });
  });
};

// 关闭图片预览
const closeViewer = () => {
  showViewer.value = false;
};

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

// 检查文章是否有图片
const hasImages = (content) => {
  if (!content) return false
  // 简单检查Markdown中是否包含图片语法
  return /!\[.*?\]\(.*?\)/.test(content) || /<img.*?>/.test(content)
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
        date: formatDate(response.data.createTime),
        hasImages: hasImages(response.data.content)
      }
      
      // 文章加载完成后，设置代码块复制按钮
      nextTick(() => {
        setupCodeCopyButtons();
        setupImageClickHandlers();
      });
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

// 监听文章内容变化，重新设置复制按钮和图片点击事件
watch(() => article.value?.content, () => {
  if (article.value?.content) {
    nextTick(() => {
      setupCodeCopyButtons();
      setupImageClickHandlers();
    });
  }
});

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div class="article-view">
    <div v-if="article" class="article-container" :class="{'no-images': !article.hasImages}">
      <h1 class="title">{{ article.title }}</h1>
      
      <div class="meta">
        <span class="date">{{ article.date }}</span>
        <span class="category" v-if="article.category">分类: {{ article.category }}</span>
        <span class="views"><i class="views-icon"></i>{{ article.viewCount || 0 }}</span>
      </div>
      
      <div class="tags" v-if="article.tags && article.tags.length">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      
      <div class="content markdown-body" v-html="md.render(article.content || '')"></div>
      
      <!-- 图片预览组件 -->
      <el-image-viewer
        v-if="showViewer"
        :url-list="previewImages"
        :initial-index="previewIndex"
        :hide-on-click-modal="true"
        @close="closeViewer"
      />
    </div>
    <div v-else-if="loading" class="loading">
      加载中...
    </div>
    <div v-else class="error">
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

.article-container.no-images {
  position: relative;
}

.article-container.no-images::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #11754b, #88c5aa);
  border-radius: 8px 8px 0 0;
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
  margin-bottom: 20px;
}

.tag {
  background-color: #f0f7f4;
  color: #11754b;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.content {
  line-height: 1.8;
  color: #333;
}

/* 自定义Markdown样式 */
:deep(.markdown-body) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

:deep(.markdown-body img) {
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 10px 0;
  transition: transform 0.3s ease;
}

:deep(.markdown-body img:hover) {
  transform: scale(1.01);
}

:deep(.markdown-body pre) {
  position: relative;
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  overflow: auto;
}

:deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background-color: #f0f7f4;
  color: #11754b;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

:deep(.markdown-body pre:hover .copy-btn) {
  opacity: 1;
}

:deep(.copy-btn.copied) {
  background-color: #11754b;
  color: white;
}

.loading,
.error {
  text-align: center;
  padding: 50px 0;
  color: #666;
  font-size: 16px;
}

@media (max-width: 768px) {
  .article-container {
    padding: 20px;
    border-radius: 0;
    box-shadow: none;
  }
  
  .title {
    font-size: 24px;
  }
  
  .meta {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style> 