<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout, getUserInfo } from '../../utils/auth.js';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userInfo = ref(null);
const activeMenu = ref('articles');

// 菜单项
const menuItems = [
  { key: 'articles', label: '文章管理', icon: 'Document' },
  { key: 'moments', label: '拾光管理', icon: 'Picture' },
  { key: 'timeline', label: '时光轴管理', icon: 'Timer' },
  { key: 'profile', label: '个人信息管理', icon: 'User' },
  { key: 'site', label: '网站信息管理', icon: 'Setting' },
];

// 表格数据模拟
const tableData = ref([
  { id: 1, title: '示例数据1', date: '2023-05-01', status: '已发布' },
  { id: 2, title: '示例数据2', date: '2023-05-02', status: '草稿' },
  { id: 3, title: '示例数据3', date: '2023-05-03', status: '已发布' },
]);

// 表单数据模拟
const formData = ref({
  name: '管理员',
  email: 'admin@example.com',
  bio: '网站管理员简介'
});

onMounted(() => {
  // 获取用户信息
  userInfo.value = getUserInfo();
  if (!userInfo.value) {
    // 如果没有用户信息，重定向到登录页面
    router.push('/admin/login');
  }
});

const handleLogout = () => {
  logout();
  userInfo.value = null; // 确保本地状态也被清除
  ElMessage.success('已成功退出登录');
  router.push('/');
};

const handleMenuSelect = (key) => {
  activeMenu.value = key;
};
</script>

<template>
  <div class="dashboard-container">
    <el-container class="dashboard-layout">
      <!-- 顶部导航 -->
      <el-header class="dashboard-header">
        <div class="logo">后台管理系统</div>
        <div class="user-info">
          <span>欢迎，{{ userInfo?.nickname || userInfo?.username || '管理员' }}</span>
          <el-button @click="handleLogout" type="danger" size="small">退出登录</el-button>
        </div>
      </el-header>
      
      <el-container class="main-container">
        <!-- 左侧菜单 -->
        <el-aside width="220px" class="menu-aside">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical"
            @select="handleMenuSelect"
            background-color="#fff"
            text-color="#606266"
            active-text-color="#11754b"
          >
            <el-menu-item v-for="item in menuItems" :key="item.key" :index="item.key">
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        
        <!-- 右侧内容区 -->
        <el-main class="content-main">
          <!-- 文章管理 -->
          <div v-if="activeMenu === 'articles'">
            <h2>文章管理</h2>
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="date" label="发布日期" width="180" />
              <el-table-column prop="status" label="状态" width="120" />
              <el-table-column label="操作" width="180">
                <template #default>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 拾光管理 -->
          <div v-if="activeMenu === 'moments'">
            <h2>拾光管理</h2>
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="内容" />
              <el-table-column prop="date" label="发布日期" width="180" />
              <el-table-column prop="status" label="状态" width="120" />
              <el-table-column label="操作" width="180">
                <template #default>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 时光轴管理 -->
          <div v-if="activeMenu === 'timeline'">
            <h2>时光轴管理</h2>
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="事件" />
              <el-table-column prop="date" label="日期" width="180" />
              <el-table-column prop="status" label="状态" width="120" />
              <el-table-column label="操作" width="180">
                <template #default>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 个人信息管理 -->
          <div v-if="activeMenu === 'profile'" class="form-container">
            <h2>个人信息管理</h2>
            <el-form :model="formData" label-width="120px" class="admin-form">
              <el-form-item label="用户名">
                <el-input v-model="formData.name" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.email" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="formData.bio" type="textarea" :rows="4" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 网站信息管理 -->
          <div v-if="activeMenu === 'site'" class="form-container">
            <h2>网站信息管理</h2>
            <el-form :model="formData" label-width="120px" class="admin-form">
              <el-form-item label="网站名称">
                <el-input v-model="formData.name" />
              </el-form-item>
              <el-form-item label="网站描述">
                <el-input v-model="formData.bio" type="textarea" :rows="4" />
              </el-form-item>
              <el-form-item label="ICP备案号">
                <el-input v-model="formData.email" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.dashboard-container {
  height: 100vh;
  width: 100%;
}

.dashboard-layout {
  height: 100%;
}

.dashboard-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 0 20px;
  height: 60px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #11754b;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.main-container {
  height: calc(100% - 60px);
}

.menu-aside {
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e6e6e6;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.content-main {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}

.content-main h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #11754b;
}

.profile-form,
.site-form {
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.admin-form {
  width: 100%;
  max-width: 800px;
}

.admin-form .el-form-item {
  margin-bottom: 20px;
}
</style> 