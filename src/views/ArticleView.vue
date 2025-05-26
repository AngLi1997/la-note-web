<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const article = ref(null)
const md = new MarkdownIt()

// 模拟文章数据
const articles = [
  {
    id: 1,
    title: '如何使用Vue3构建现代Web应用',
    content: `
Vue3带来了许多新特性，如Composition API、Teleport、Fragments等，本文将详细介绍如何利用这些特性构建现代Web应用。

## Composition API

Composition API是Vue3最大的特性之一，它允许我们更好地组织和重用代码。

\`\`\`js
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
\`\`\`

## Teleport

Teleport是Vue3中引入的一个新特性，它允许我们将组件的一部分DOM"传送"到组件DOM树之外的位置。

\`\`\`html
<teleport to="body">
  <div class="modal">
    <!-- 模态框内容 -->
  </div>
</teleport>
\`\`\`

## Fragments

在Vue3中，组件可以有多个根节点，这就是所谓的Fragments。

\`\`\`html
<template>
  <header>页头</header>
  <main>主内容</main>
  <footer>页脚</footer>
</template>
\`\`\`

通过使用这些新特性，我们可以构建更灵活、更可维护的应用程序。
    `,
    date: '2023-05-15',
    category: 'tech',
    tags: ['Vue', 'JavaScript', 'Web开发']
  },
  {
    id: 2,
    title: '2023年最值得学习的编程语言',
    content: `
随着技术的不断发展，编程语言也在不断更新迭代。本文将介绍2023年最值得学习的几种编程语言及其应用场景。

## 1. Python

Python继续保持其在数据科学、机器学习和人工智能领域的主导地位。其简洁的语法和丰富的库使其成为初学者和专业人士的首选语言。

## 2. JavaScript/TypeScript

随着Web应用的普及，JavaScript（以及其超集TypeScript）仍然是前端开发的必备语言。Node.js的兴起也使其成为全栈开发的有力工具。

## 3. Rust

Rust因其内存安全和高性能而获得了越来越多的关注。它被用于系统编程、游戏开发和Web Assembly应用程序。

## 4. Go

Go语言以其简单性和并发支持而闻名，特别适合构建微服务和分布式系统。

## 5. Kotlin

Kotlin已成为Android开发的首选语言，其与Java的互操作性使其易于学习和采用。

无论你选择学习哪种语言，重要的是要了解它的应用场景和生态系统。选择一门适合你职业目标的语言，并深入学习，将帮助你在2023年的技术浪潮中立于不败之地。
    `,
    date: '2023-06-22',
    category: 'tech',
    tags: ['编程语言', '学习资源']
  },
  {
    id: 3,
    title: '旅行中的摄影技巧',
    content: `
旅行中如何拍出美丽的照片？本文分享一些实用的摄影技巧，帮助你在旅途中捕捉精彩瞬间。

## 黄金时段拍摄

早晨和傍晚的光线最适合拍摄风景照，这段时间被称为"黄金时段"。此时的光线柔和，角度低，能够创造出丰富的色彩和纹理。

## 学会构图

好的构图能让照片更加吸引人。可以尝试使用三分法则，将画面分为九等份，将主体放置在交叉点上。也可以利用前景来增加照片的深度感。

## 捕捉当地人的生活

除了风景，当地人的生活和文化也是旅行照片的重要元素。尝试捕捉市场、街道和日常活动中的真实瞬间。

## 减少装备，增加体验

虽然专业设备能提升照片质量，但过多的装备可能会影响旅行体验。一台好的相机和一两个镜头通常就足够了。记住，最好的相机是你随身携带的那一台。

## 后期编辑

适当的后期编辑能让照片更加出彩。学习基本的色彩调整、曝光修正和构图裁剪技巧，能让你的照片更加专业。

记住，摄影最重要的是捕捉瞬间和讲述故事。技术只是辅助，真正重要的是你的视角和感受。
    `,
    date: '2023-07-10',
    category: 'life',
    tags: ['摄影', '旅行', '技巧']
  }
]

onMounted(() => {
  const id = parseInt(route.params.id)
  article.value = articles.find(a => a.id === id)
})
</script>

<template>
  <div class="article-view" v-if="article">
    <h1 class="title fade-in">{{ article.title }}</h1>
    
    <div class="meta fade-in" style="animation-delay: 0.1s">
      <span class="date">{{ article.date }}</span>
      <span class="category">分类: {{ article.category }}</span>
    </div>
    
    <div class="tags fade-in" style="animation-delay: 0.2s">
      <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    
    <div class="content fade-in" style="animation-delay: 0.3s" v-html="md.render(article.content)"></div>
  </div>
  <div v-else class="loading fade-in">
    加载中...
  </div>
</template>

<style scoped>
.article-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

.title {
  font-size: 32px;
  margin-bottom: 15px;
  color: #333;
}

.meta {
  margin-bottom: 15px;
  color: #666;
  display: flex;
  gap: 20px;
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

.content :deep(h1),
.content :deep(h2),
.content :deep(h3) {
  margin-top: 30px;
  margin-bottom: 15px;
}

.content :deep(p) {
  margin-bottom: 15px;
}

.content :deep(code) {
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.content :deep(pre) {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 20px;
}

.content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 内容动画效果 */
.content :deep(h1),
.content :deep(h2),
.content :deep(h3),
.content :deep(p),
.content :deep(pre) {
  animation: contentFadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.content :deep(h1) { animation-delay: 0.4s; }
.content :deep(h2) { animation-delay: 0.5s; }
.content :deep(h3) { animation-delay: 0.6s; }
.content :deep(p) { animation-delay: 0.7s; }
.content :deep(pre) { animation-delay: 0.8s; }

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 