<script setup>
import { ref, computed } from 'vue'

const timelineEvents = ref([
  {
    id: 1,
    title: '个人博客上线',
    content: '经过一个月的努力，个人技术博客终于正式上线了！将持续分享技术心得和学习笔记。',
    date: '2023-12-15',
    category: '技术',
    icon: '🚀'
  },
  {
    id: 2,
    title: '学习Vue3源码',
    content: '开始深入研究Vue3的源码实现，尤其是关于响应式系统和编译优化的部分。记录了一些重要的设计思想和实现细节。',
    date: '2023-11-20',
    category: '学习',
    icon: '📚'
  },
  {
    id: 3,
    title: '参加技术分享会',
    content: '参加了一场关于前端性能优化的技术分享会，收获颇丰。对首屏加载优化和资源懒加载有了新的理解。',
    date: '2023-10-05',
    category: '活动',
    icon: '🎤'
  },
  {
    id: 4,
    title: '开源项目贡献',
    content: '向一个流行的开源项目提交了第一个PR，修复了一个UI渲染的bug。很高兴能为开源社区做出贡献！',
    date: '2023-09-18',
    category: '开源',
    icon: '🔧'
  },
  {
    id: 5,
    title: '开始学习TypeScript',
    content: '决定深入学习TypeScript，强类型系统对于大型项目的维护非常有帮助。记录了一些关键概念和实践经验。',
    date: '2023-08-10',
    category: '学习',
    icon: '💡'
  },
  {
    id: 6,
    title: '第一个独立项目',
    content: '完成了第一个完全由自己设计和开发的Web应用，采用了Vue3+TypeScript+Vite的技术栈。',
    date: '2023-07-02',
    category: '项目',
    icon: '🏆'
  }
])

const filterCategory = ref('all')

const filteredEvents = computed(() => {
  if (filterCategory.value === 'all') {
    return timelineEvents.value
  }
  return timelineEvents.value.filter(event => event.category === filterCategory.value)
})

const categories = computed(() => {
  const categorySet = new Set(timelineEvents.value.map(event => event.category))
  return ['all', ...Array.from(categorySet)]
})

const setFilter = (category) => {
  filterCategory.value = category
}
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
      
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        <div 
          v-for="event in filteredEvents" 
          :key="event.id"
          class="timeline-item"
        >
          <div class="timeline-icon">{{ event.icon }}</div>
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
</style> 