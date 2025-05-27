<script setup>
import { ref } from 'vue'

const posts = ref([
  {
    id: 1,
    content: '今天的代码又出bug了，找了半天才发现是少了一个分号...程序员的日常🤦‍♂️',
    date: '12-15 13:45',
    images: ['https://picsum.photos/id/180/500/500']
  },
  {
    id: 2,
    content: '为什么产品经理总是在周五下班前提需求？这是什么职业习惯吗？',
    date: '12-10 18:23',
    images: []
  },
  {
    id: 3,
    content: '深夜写代码配上一杯咖啡，感觉整个人都升华了。不过明天又要顶着黑眼圈上班了...',
    date: '12-08 01:15',
    images: ['https://picsum.photos/id/216/500/500', 'https://picsum.photos/id/225/500/500']
  },
  {
    id: 4,
    content: '刚收到消息，项目deadline又提前了。我该哭还是该笑？反正头发是保不住了🥲',
    date: '12-05 09:34',
    images: []
  },
  {
    id: 5,
    content: '今天去楼下买奶茶，碰到了隔壁组的产品经理，我假装没看见他...结果他主动跟我打招呼说有个新需求想跟我聊聊。这就是命啊！',
    date: '12-01 16:20',
    images: ['https://picsum.photos/id/292/500/500']
  },
  {
    id: 6,
    content: '终于把那个困扰了我一周的问题解决了！原来是网络环境问题，我竟然一直在代码里找原因...',
    date: '11-28 21:05',
    images: []
  }
])
</script>

<template>
  <div class="posts-view">
    <div class="container">
      <header class="page-header">
        <h1>吐槽</h1>
        <p class="subtitle">程序员的日常吐槽集</p>
      </header>
      
      <div class="posts-list">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post-item"
        >
          <div class="post-date">{{ post.date }}</div>
          <div class="post-content">
            <p>{{ post.content }}</p>
            
            <div v-if="post.images.length" class="post-images" :class="{ 'single-image': post.images.length === 1 }">
              <div 
                v-for="(image, index) in post.images" 
                :key="index"
                class="image-preview"
              >
                <img :src="image" :alt="`图片${index + 1}`">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.posts-view {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 15px;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin-top: 5px;
}

.posts-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.post-item {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.post-item:last-child {
  border-bottom: none;
}

.post-date {
  flex: 0 0 100px;
  color: #11754b;
  font-size: 13px;
  padding-right: 15px;
  border-right: 1px solid #f0f0f0;
}

.post-content {
  flex: 1;
  padding-left: 15px;
}

.post-content p {
  margin: 0 0 8px 0;
  line-height: 1.4;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.post-images {
  display: flex;
  gap: 5px;
  margin-top: 5px;
  flex-wrap: wrap;
}

.image-preview {
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #eee;
}

.single-image .image-preview {
  width: 120px;
  height: 80px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .post-item {
    flex-direction: column;
  }
  
  .post-date {
    flex: 0 0 auto;
    padding-right: 0;
    padding-bottom: 5px;
    margin-bottom: 5px;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .post-content {
    padding-left: 0;
  }
}
</style> 