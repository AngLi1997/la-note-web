<script setup>
import { ref, onMounted } from 'vue'
import {axiosInstance} from "@/plugins/axios.js";

// 用户设置信息
const userSettings = ref({
  userId: '',
  username: '',
  nickname: '',
  avatar: '',
  bio: '',
  blogIntro: '',
  contactEmail: '',
  githubUrl: '',
  extraContacts: ''
})

// 解析的额外联系方式
const parsedExtraContacts = ref({})

// 页面加载时获取用户设置
onMounted(async () => {
  try {
    // 这里假设默认使用ID为1的用户信息，实际使用时可以从用户登录信息中获取
    const userId = '1'
    const response = await axiosInstance.get(`/user-settings/${userId}`)
    console.log('接口返回数据:', response)
    
    if (response && response.code === 200 && response.data) {
      userSettings.value = response.data
      console.log('设置后的userSettings:', userSettings.value)
      
      // 解析额外联系方式
      if (userSettings.value.extraContacts) {
        try {
          parsedExtraContacts.value = JSON.parse(userSettings.value.extraContacts)
        } catch (e) {
          console.error('解析额外联系方式失败:', e)
        }
      }
    }
  } catch (error) {
    console.error('获取用户设置信息失败:', error)
  }
})
</script>

<template>
  <div class="about-view">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 页面标题 -->
      <h1 class="page-title fade-in">关于我</h1>
      
      <!-- 个人信息区 -->
      <div class="about-card">
        <div class="author-info">
          <div class="avatar-container fade-in" style="animation-delay: 0.2s">
            <div class="avatar" :style="{ backgroundImage: userSettings.avatar ? `url(${userSettings.avatar})` : '' }"></div>
          </div>
          <div class="bio fade-in" style="animation-delay: 0.3s">
            <h2 class="section-title">个人简介</h2>
            <p>{{ userSettings.bio || '暂无个人简介' }}</p>
          </div>
        </div>
      </div>
      
      <!-- 博客介绍 -->
      <div class="about-card fade-in" style="animation-delay: 0.4s">
        <h2 class="section-title">博客介绍</h2>
        <p>{{ userSettings.blogIntro || '暂无博客介绍' }}</p>
      </div>
      
      <!-- 联系方式 -->
      <div class="about-card fade-in" style="animation-delay: 0.5s">
        <h2 class="section-title">联系方式</h2>
        <ul class="contact-list">
          <li v-if="userSettings.contactEmail" class="contact-item">
            <span class="contact-label">邮箱：</span>
            <a :href="`mailto:${userSettings.contactEmail}`" class="contact-link">{{ userSettings.contactEmail }}</a>
          </li>
          <li v-if="userSettings.githubUrl" class="contact-item">
            <span class="contact-label">GitHub：</span>
            <a :href="userSettings.githubUrl" target="_blank" class="contact-link">{{ userSettings.githubUrl }}</a>
          </li>
          <!-- 解析并展示额外联系方式 -->
          <template v-if="Object.keys(parsedExtraContacts).length > 0">
            <li v-for="(value, key) in parsedExtraContacts" :key="key" class="contact-item">
              <span class="contact-label">{{ key }}：</span>
              <span class="contact-link">{{ value }}</span>
            </li>
          </template>
          <li v-if="!userSettings.contactEmail && !userSettings.githubUrl && Object.keys(parsedExtraContacts).length === 0" class="contact-item">
            <span>暂无联系方式</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  padding: 20px 0;
}

/* 主要内容区域 */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin: 0 0 10px 0;
  text-align: center;
}

.about-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
}

p {
  line-height: 1.8;
  color: #444;
  margin: 0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 30px;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100%;
  height: 100%;
  background-color: #eee;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bio {
  flex: 1;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.contact-label {
  font-weight: 500;
  color: #555;
  margin-right: 10px;
  min-width: 60px;
}

.contact-link {
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
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

/* 响应式设计 */
@media (max-width: 600px) {
  .author-info {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-container {
    margin-bottom: 20px;
  }
  
  .contact-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .contact-label {
    margin-bottom: 5px;
  }
}
</style> 