<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('管理员');

const logout = () => {
  localStorage.removeItem('adminToken');
  router.push('/');
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>管理员仪表板</h1>
      <div class="user-info">
        <span>欢迎，{{ username }}</span>
        <button @click="logout" class="logout-button">退出登录</button>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="dashboard-card">
        <h2>网站统计</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">23</div>
            <div class="stat-label">文章总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">154</div>
            <div class="stat-label">评论总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1,254</div>
            <div class="stat-label">访问量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">45</div>
            <div class="stat-label">吐槽数量</div>
          </div>
        </div>
      </div>
      
      <div class="action-cards">
        <div class="action-card">
          <h3>内容管理</h3>
          <ul>
            <li><a href="#">发布新文章</a></li>
            <li><a href="#">管理文章</a></li>
            <li><a href="#">管理评论</a></li>
            <li><a href="#">管理吐槽</a></li>
          </ul>
        </div>
        
        <div class="action-card">
          <h3>系统设置</h3>
          <ul>
            <li><a href="#">网站设置</a></li>
            <li><a href="#">用户管理</a></li>
            <li><a href="#">备份与恢复</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.dashboard-header h1 {
  color: #11754b;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.dashboard-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.dashboard-card h2 {
  color: #11754b;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #11754b;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.action-card h3 {
  color: #11754b;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.action-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.action-card li {
  margin-bottom: 12px;
}

.action-card a {
  color: #333;
  text-decoration: none;
  display: block;
  padding: 8px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.action-card a:hover {
  background-color: #f5f5f5;
  color: #11754b;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-cards {
    grid-template-columns: 1fr;
  }
}
</style> 