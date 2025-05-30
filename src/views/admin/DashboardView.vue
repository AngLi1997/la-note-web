<script setup>
import { ref, onMounted, reactive, inject } from 'vue';
import { useRouter } from 'vue-router';
import { logout, getUserInfo } from '../../utils/auth.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const api = inject('api');
const router = useRouter();
const userInfo = ref(null);
const activeMenu = ref('articles');
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 文章对话框相关
const articleDialogVisible = ref(false);
const articleForm = reactive({
  title: '',
  summary: '',
  content: '',
  category: '',
  tags: [],
  thumbnail: '',
  status: 0 // 默认为草稿状态
});
const categoryOptions = ref([]);
const tagOptions = ref([]);
const formRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
};
const articleFormRef = ref(null);

// 菜单项
const menuItems = [
  { key: 'articles', label: '文章管理', icon: 'Document' },
  { key: 'moments', label: '拾光管理', icon: 'Picture' },
  { key: 'timeline', label: '时光轴管理', icon: 'Timer' },
  { key: 'profile', label: '个人信息管理', icon: 'User' },
  { key: 'site', label: '网站信息管理', icon: 'Setting' },
];

// 表单数据模拟
const formData = ref({
  name: '管理员',
  email: 'admin@example.com',
  bio: '网站管理员简介'
});

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true;
  try {
    const response = await api.article.getArticlesList({
      page: currentPage.value,
      size: pageSize.value
    });
    
    if (response && response.code === 200) {
      tableData.value = response.data.list || [];
      total.value = response.data.total || 0;
    } else {
      ElMessage.error(response?.msg || '获取文章列表失败');
    }
  } catch (error) {
    console.error('获取文章列表失败:', error);
    ElMessage.error('获取文章列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取分类和标签
const fetchCategoriesAndTags = async () => {
  try {
    // 获取分类
    const categoriesResponse = await api.article.getCategories();
    if (categoriesResponse && categoriesResponse.code === 200) {
      categoryOptions.value = categoriesResponse.data || [];
    }
    
    // 获取标签
    const tagsResponse = await api.article.getTags();
    if (tagsResponse && tagsResponse.code === 200) {
      tagOptions.value = tagsResponse.data || [];
    }
  } catch (error) {
    console.error('获取分类或标签失败:', error);
  }
};

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchArticles();
};

// 每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchArticles();
};

// 处理新增文章
const handleAddArticle = () => {
  // 重置表单
  Object.keys(articleForm).forEach(key => {
    if (key === 'status') {
      articleForm[key] = 0; // 默认草稿
    } else if (key === 'tags') {
      articleForm[key] = [];
    } else {
      articleForm[key] = '';
    }
  });
  
  articleDialogVisible.value = true;
};

// 提交文章表单
const submitArticleForm = async () => {
  if (!articleFormRef.value) return;
  
  articleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        
        // 创建文章
        const response = await api.article.createArticle({
          ...articleForm,
          tags: articleForm.tags // 直接使用数组
        });
        
        if (response && response.code === 200) {
          ElMessage.success('文章创建成功');
          articleDialogVisible.value = false;
          fetchArticles(); // 刷新列表
        } else {
          ElMessage.error(response?.msg || '创建文章失败');
        }
      } catch (error) {
        console.error('创建文章失败:', error);
        ElMessage.error('创建文章失败');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 删除文章
const handleDeleteArticle = (row) => {
  ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true;
      const response = await api.article.deleteArticle(row.id);
      
      if (response && response.code === 200) {
        ElMessage.success('删除成功');
        fetchArticles(); // 刷新列表
      } else {
        ElMessage.error(response?.msg || '删除失败');
      }
    } catch (error) {
      console.error('删除文章失败:', error);
      ElMessage.error('删除文章失败');
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    // 取消删除，不做处理
  });
};

// 获取文章状态文字
const getStatusText = (status) => {
  return status === 1 ? '已发布' : '草稿';
};

onMounted(() => {
  // 获取用户信息
  userInfo.value = getUserInfo();
  if (!userInfo.value) {
    // 如果没有用户信息，重定向到登录页面
    router.push('/admin/login');
  }
  
  // 获取文章列表
  fetchArticles();
  
  // 获取分类和标签
  fetchCategoriesAndTags();
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
        <div class="logo">控制台</div>
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
            <div class="action-bar">
              <h2>文章管理</h2>
              <el-button type="primary" @click="handleAddArticle">新增文章</el-button>
            </div>
            
            <el-table
              v-loading="loading"
              :data="tableData"
              style="width: 100%"
              border
            >
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="标题" />
              <el-table-column label="发布日期" width="180">
                <template #default="scope">
                  {{ new Date(scope.row.createTime).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="handleDeleteArticle(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
            
            <!-- 新增/编辑文章对话框 -->
            <el-dialog
              v-model="articleDialogVisible"
              title="新增文章"
              width="70%"
              :close-on-click-modal="false"
            >
              <el-form
                ref="articleFormRef"
                :model="articleForm"
                :rules="formRules"
                label-width="100px"
              >
                <el-form-item label="标题" prop="title">
                  <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
                </el-form-item>
                
                <el-form-item label="摘要">
                  <el-input 
                    v-model="articleForm.summary" 
                    type="textarea" 
                    :rows="3" 
                    placeholder="请输入文章摘要" 
                  />
                </el-form-item>
                
                <el-form-item label="内容" prop="content">
                  <el-input 
                    v-model="articleForm.content" 
                    type="textarea" 
                    :rows="8" 
                    placeholder="请输入文章内容，支持 Markdown 格式" 
                  />
                </el-form-item>
                
                <el-form-item label="分类">
                  <el-select 
                    v-model="articleForm.category" 
                    placeholder="请选择分类"
                    clearable
                  >
                    <el-option 
                      v-for="category in categoryOptions" 
                      :key="category" 
                      :label="category" 
                      :value="category" 
                    />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="标签">
                  <el-select 
                    v-model="articleForm.tags" 
                    multiple 
                    placeholder="请选择标签"
                    clearable
                  >
                    <el-option 
                      v-for="tag in tagOptions" 
                      :key="tag" 
                      :label="tag" 
                      :value="tag" 
                    />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="缩略图">
                  <el-input v-model="articleForm.thumbnail" placeholder="请输入缩略图URL" />
                </el-form-item>
                
                <el-form-item label="状态">
                  <el-radio-group v-model="articleForm.status">
                    <el-radio :label="0">草稿</el-radio>
                    <el-radio :label="1">发布</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              
              <template #footer>
                <el-button @click="articleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitArticleForm" :loading="loading">
                  保存
                </el-button>
              </template>
            </el-dialog>
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 