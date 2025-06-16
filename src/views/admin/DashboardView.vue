<script setup>
import { ref, onMounted, reactive, inject, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { logout, getUserInfo, getToken, setUserInfo } from '../../utils/auth.js';
import { ElMessage, ElMessageBox, ElDivider } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

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
  id: null, // 添加id字段，用于区分新增和编辑
  title: '',
  summary: '',
  content: '',
  category: '',
  tags: [],
  thumbnail: '',
  status: 0 // 默认为草稿状态
});
const isEdit = ref(false); // 添加标记，区分是新增还是编辑
const categoryOptions = ref([]);
const tagOptions = ref([]);
const formRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
};
const articleFormRef = ref(null);
const thumbnailRef = ref(null);
const uploadLoading = ref(false);

// 拾光管理相关
const complaintDialogVisible = ref(false);
const complaintForm = reactive({
  id: null,
  title: '',
  content: '',
  mood: '',
  images: [],
  status: 0 // 默认为草稿状态
});
const isEditComplaint = ref(false);
const complaintFormRef = ref(null);
const moodOptions = ref([]);
const complaintTableData = ref([]);
const complaintTotal = ref(0);
const complaintCurrentPage = ref(1);
const complaintPageSize = ref(10);
const complaintFormRules = {
  title: [{ required: true, message: '请输入拾光标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入拾光内容', trigger: 'blur' }],
  mood: [{ required: true, message: '请选择心情标签', trigger: 'change' }]
};
const fileList = ref([]);
const imageInputRef = ref(null); // 添加图片输入框引用
const imageUrl = ref(''); // 添加图片URL变量

// 菜单项
const menuItems = [
  { key: 'articles', label: '文章管理', icon: 'Document' },
  { key: 'moments', label: '拾光管理', icon: 'Picture' },
  { key: 'timeline', label: '时光轴管理', icon: 'Timer' },
  { key: 'profile', label: '个人信息管理', icon: 'User' },
  { key: 'site', label: '网站信息管理', icon: 'Setting' },
];

// 时间轴管理相关
const timelineDialogVisible = ref(false);
const timelineForm = reactive({
  id: null,
  title: '',
  content: '',
  date: '',
  category: '',
  icon: '',
  displayOrder: 0
});
const isEditTimeline = ref(false);
const timelineFormRef = ref(null);
const timelineTableData = ref([]);
const timelineTotal = ref(0);
const timelineCurrentPage = ref(1);
const timelinePageSize = ref(10);
const timelineFormRules = {
  title: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
  date: [{ required: true, message: '请选择事件日期', trigger: 'change' }]
};

// 表单数据
const formData = reactive({
  id: '',
  username: '',
  nickname: '',
  email: '',
  phone: '',
  bio: '',
  avatar: '',
  blogIntro: '',
  contactEmail: '',
  githubUrl: '',
  extraContacts: '',
  parsedExtraContacts: {},
  wechat: ''
});

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 密码修改对话框
const passwordDialogVisible = ref(false);
const passwordFormRef = ref(null);
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ]
};

// 头像上传相关
const avatarRef = ref(null);
const avatarUploadLoading = ref(false);

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true;
  try {
    const response = await api.article.getArticlesList({
      pageNum: currentPage.value,
      pageSize: pageSize.value
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
  
  isEdit.value = false;
  articleDialogVisible.value = true;
  
  // 确保DOM已更新后设置粘贴事件监听
  nextTick(() => {
    setupPasteListener();
  });
};

// 处理编辑文章
const handleEditArticle = async (row) => {
  try {
    loading.value = true;
    // 获取文章详情
    const response = await api.article.getArticleById(row.id);
    
    if (response && response.code === 200) {
      const articleData = response.data;
      
      // 填充表单数据
      articleForm.id = articleData.id;
      articleForm.title = articleData.title || '';
      articleForm.summary = articleData.summary || '';
      articleForm.content = articleData.content || '';
      articleForm.category = articleData.category || '';
      articleForm.thumbnail = articleData.thumbnail || '';
      articleForm.status = articleData.status || 0;
      
      // 处理标签，确保是数组格式
      if (articleData.tags) {
        if (typeof articleData.tags === 'string') {
          articleForm.tags = articleData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        } else if (Array.isArray(articleData.tags)) {
          articleForm.tags = [...articleData.tags];
        } else {
          articleForm.tags = [];
        }
      } else {
        articleForm.tags = [];
      }
      
      isEdit.value = true;
      articleDialogVisible.value = true;
      
      // 确保DOM已更新后设置粘贴事件监听
      nextTick(() => {
        setupPasteListener();
      });
    } else {
      ElMessage.error(response?.msg || '获取文章详情失败');
    }
  } catch (error) {
    console.error('获取文章详情失败:', error);
    ElMessage.error('获取文章详情失败');
  } finally {
    loading.value = false;
  }
};

// 提交文章表单
const submitArticleForm = async () => {
  if (!articleFormRef.value) return;
  
  articleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        
        // 准备文章数据
        const articleData = {
          ...articleForm,
          status: Number(articleForm.status), // 确保是数字类型
          tags: articleForm.tags // 直接使用数组
        };
        
        let response;
        
        if (isEdit.value) {
          // 编辑文章
          response = await api.article.updateArticle(articleForm.id, articleData);
          if (response && response.code === 200) {
            ElMessage.success('文章更新成功');
          } else {
            ElMessage.error(response?.msg || '更新文章失败');
          }
        } else {
          // 创建文章
          response = await api.article.createArticle(articleData);
          if (response && response.code === 200) {
            ElMessage.success(articleForm.status === 1 ? '文章已发布成功' : '文章已保存为草稿');
          } else {
            ElMessage.error(response?.msg || '创建文章失败');
          }
        }
        
        if (response && response.code === 200) {
          articleDialogVisible.value = false;
          fetchArticles(); // 刷新列表
        }
      } catch (error) {
        console.error(isEdit.value ? '更新文章失败:' : '创建文章失败:', error);
        ElMessage.error(isEdit.value ? '更新文章失败' : '创建文章失败');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 处理文章发布/撤回
const handlePublishArticle = async (row) => {
  const action = row.status === 1 ? '撤回' : '发布';
  const newStatus = row.status === 1 ? 0 : 1;
  
  ElMessageBox.confirm(`确定要${action}该文章吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true;
      
      // 更新文章状态
      const response = await api.article.updateArticle(row.id, {
        ...row,
        status: newStatus
      });
      
      if (response && response.code === 200) {
        ElMessage.success(`${action}成功`);
        fetchArticles(); // 刷新列表
      } else {
        ElMessage.error(response?.msg || `${action}失败`);
      }
    } catch (error) {
      console.error(`${action}文章失败:`, error);
      ElMessage.error(`${action}文章失败`);
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    // 取消操作，不做处理
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

// 处理文章图片粘贴
const handlePasteImage = async (event) => {
  // 确保焦点在缩略图输入框时才处理粘贴事件
  if (document.activeElement !== thumbnailRef.value.input) return;
  
  const items = event.clipboardData.items;
  let file = null;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      file = items[i].getAsFile();
      break;
    }
  }
  
  if (file) {
    event.preventDefault(); // 阻止默认粘贴行为
    
    try {
      uploadLoading.value = true;
      ElMessage.info('正在上传图片...');
      
      const response = await api.upload.uploadImage(file);
      
      if (response && response.code === 200 && response.data) {
        // 根据后端返回的数据结构获取URL
        let imageUrl = '';
        if (typeof response.data === 'string') {
          // 如果直接返回URL字符串
          imageUrl = response.data;
        } else if (response.data.url) {
          // 如果返回对象中包含url字段
          imageUrl = response.data.url;
        } else if (response.data.path) {
          // 如果返回对象中包含path字段
          imageUrl = response.data.path;
        } else if (response.data.fileUrl) {
          // 如果返回对象中包含fileUrl字段
          imageUrl = response.data.fileUrl;
        }
        
        if (imageUrl) {
          articleForm.thumbnail = imageUrl;
          ElMessage.success('图片上传成功');
        } else {
          ElMessage.error('无法获取上传的图片URL');
          console.error('上传响应中未找到图片URL:', response.data);
        }
      } else {
        ElMessage.error(response?.msg || '图片上传失败');
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      ElMessage.error('图片上传失败');
    } finally {
      uploadLoading.value = false;
    }
  }
};

// 设置文章粘贴事件监听
const setupPasteListener = () => {
  // 添加全局粘贴事件监听
  document.addEventListener('paste', handlePasteImage);
};

// 移除文章粘贴事件监听
const removePasteListener = () => {
  document.removeEventListener('paste', handlePasteImage);
};

// 处理文章对话框关闭
const handleDialogClose = () => {
  removePasteListener();
  articleDialogVisible.value = false;
};

// 创建新分类
const createCategory = (query) => {
  if (query && !categoryOptions.value.includes(query)) {
    categoryOptions.value.push(query);
    articleForm.category = query;
    ElMessage.success(`已创建新分类: ${query}`);
  }
};

// 创建新标签
const createTag = (query) => {
  if (query && !tagOptions.value.includes(query)) {
    tagOptions.value.push(query);
    if (!articleForm.tags.includes(query)) {
      articleForm.tags.push(query);
    }
    ElMessage.success(`已创建新标签: ${query}`);
  }
};

// 获取文章状态文字
const getStatusText = (status) => {
  return status === 1 ? '已发布' : '草稿';
};

// 获取拾光列表
const fetchComplaints = async () => {
  loading.value = true;
  try {
    const response = await api.complaint.getComplaintsList({
      pageNum: complaintCurrentPage.value,
      pageSize: complaintPageSize.value,
      mood: '',
      showAll: true // 管理页面需要查看所有状态的拾光，包括草稿
    });
    
    if (response && response.code === 200) {
      complaintTableData.value = response.data.list || [];
      complaintTotal.value = response.data.total || 0;
    } else {
      ElMessage.error(response?.msg || '获取拾光列表失败');
    }
  } catch (error) {
    console.error('获取拾光列表失败:', error);
    ElMessage.error('获取拾光列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取心情标签
const fetchMoods = async () => {
  try {
    // 先设置默认的心情标签列表
    const defaultMoods = ['开心', '难过', '平静', '兴奋', '疲惫', '感动', '思考', '发呆', '抓狂', '生气', '崩溃', '摆烂'];
    moodOptions.value = [...defaultMoods];
    
    // 尝试从后端获取心情标签
    const response = await api.complaint.getMoods();
    if (response && response.code === 200 && response.data && Array.isArray(response.data) && response.data.length > 0) {
      // 如果后端返回了标签，合并默认标签和后端标签，确保不重复
      const backendMoods = response.data;
      const allMoods = new Set([...defaultMoods, ...backendMoods]);
      moodOptions.value = Array.from(allMoods);
    }
    
    // 最后检查确保心情标签列表不为空
    if (!moodOptions.value || !Array.isArray(moodOptions.value) || moodOptions.value.length === 0) {
      moodOptions.value = [...defaultMoods];
    }
  } catch (error) {
    // 出错时确保有默认标签
    moodOptions.value = ['开心', '难过', '平静', '兴奋', '疲惫', '感动', '思考', '发呆', '抓狂', '生气', '崩溃', '摆烂'];
  }
};

// 拾光分页变化
const handleComplaintPageChange = (page) => {
  complaintCurrentPage.value = page;
  fetchComplaints();
};

// 拾光每页条数变化
const handleComplaintSizeChange = (size) => {
  complaintPageSize.value = size;
  complaintCurrentPage.value = 1;
  fetchComplaints();
};

// 处理新增拾光
const handleAddComplaint = () => {
  // 重置表单
  Object.keys(complaintForm).forEach(key => {
    if (key === 'status') {
      complaintForm[key] = 0; // 默认草稿
    } else if (key === 'images') {
      complaintForm[key] = [];
    } else {
      complaintForm[key] = '';
    }
  });
  
  // 重新获取心情标签列表
  fetchMoods();
  
  fileList.value = [];
  imageUrl.value = ''; // 重置图片URL
  isEditComplaint.value = false;
  complaintDialogVisible.value = true;
  
  // 确保DOM已更新后设置粘贴事件监听
  nextTick(() => {
    setupComplaintPasteListener();
  });
};

// 处理编辑拾光
const handleEditComplaint = async (row) => {
  try {
    loading.value = true;
    
    // 重新获取心情标签列表
    await fetchMoods();
    
    // 获取拾光详情
    const response = await api.complaint.getComplaintById(row.id);
    
    if (response && response.code === 200) {
      const complaintData = response.data;
      
      // 填充表单数据
      complaintForm.id = complaintData.id;
      complaintForm.title = complaintData.title || '';
      complaintForm.content = complaintData.content || '';
      complaintForm.mood = complaintData.mood || '';
      complaintForm.status = complaintData.status || 0;
      
      // 处理图片
      if (complaintData.images && complaintData.images.length > 0) {
        complaintForm.images = [...complaintData.images];
        
        // 设置文件列表，用于显示已上传的图片
        fileList.value = complaintData.images.map((url, index) => ({
          name: `图片${index + 1}`,
          url: url
        }));
      } else {
        complaintForm.images = [];
        fileList.value = [];
      }
      
      imageUrl.value = ''; // 重置图片URL
      isEditComplaint.value = true;
      complaintDialogVisible.value = true;
      
      // 确保DOM已更新后设置粘贴事件监听
      nextTick(() => {
        setupComplaintPasteListener();
      });
    } else {
      ElMessage.error(response?.msg || '获取拾光详情失败');
    }
  } catch (error) {
    console.error('获取拾光详情失败:', error);
    ElMessage.error('获取拾光详情失败');
  } finally {
    loading.value = false;
  }
};

// 提交拾光表单
const submitComplaintForm = async () => {
  if (!complaintFormRef.value) return;
  
  complaintFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        
        // 准备拾光数据
        const complaintData = {
          ...complaintForm,
          status: Number(complaintForm.status) // 确保是数字类型
        };
        
        // 只有当图片数组不为空时才添加images字段
        if (complaintForm.images && complaintForm.images.length > 0) {
          complaintData.images = complaintForm.images;
        } else {
          // 不设置images字段，或设置为null
          complaintData.images = null;
        }
        
        let response;
        
        if (isEditComplaint.value) {
          // 编辑拾光
          response = await api.complaint.updateComplaint(complaintForm.id, complaintData);
          if (response && response.code === 200) {
            ElMessage.success('拾光更新成功');
          } else {
            ElMessage.error(response?.msg || '更新拾光失败');
          }
        } else {
          // 创建拾光
          response = await api.complaint.createComplaint(complaintData);
          if (response && response.code === 200) {
            ElMessage.success(complaintForm.status === 1 ? '拾光已发布成功' : '拾光已保存为草稿');
          } else {
            ElMessage.error(response?.msg || '创建拾光失败');
          }
        }
        
        if (response && response.code === 200) {
          complaintDialogVisible.value = false;
          fetchComplaints(); // 刷新列表
        }
      } catch (error) {
        console.error(isEditComplaint.value ? '更新拾光失败:' : '创建拾光失败:', error);
        ElMessage.error(isEditComplaint.value ? '更新拾光失败' : '创建拾光失败');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 处理拾光发布/撤回
const handlePublishComplaint = async (row) => {
  const action = row.status === 1 ? '撤回' : '发布';
  const newStatus = row.status === 1 ? 0 : 1;
  
  ElMessageBox.confirm(`确定要${action}该拾光吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true;
      
      // 更新拾光状态
      const response = await api.complaint.updateComplaint(row.id, {
        ...row,
        status: newStatus
      });
      
      if (response && response.code === 200) {
        ElMessage.success(`${action}成功`);
        fetchComplaints(); // 刷新列表
      } else {
        ElMessage.error(response?.msg || `${action}失败`);
      }
    } catch (error) {
      console.error(`${action}拾光失败:`, error);
      ElMessage.error(`${action}拾光失败`);
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    // 取消操作，不做处理
  });
};

// 删除拾光
const handleDeleteComplaint = (row) => {
  ElMessageBox.confirm('确定要删除该拾光吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true;
      const response = await api.complaint.deleteComplaint(row.id);
      
      if (response && response.code === 200) {
        ElMessage.success('删除成功');
        fetchComplaints(); // 刷新列表
      } else {
        ElMessage.error(response?.msg || '删除失败');
      }
    } catch (error) {
      console.error('删除拾光失败:', error);
      ElMessage.error('删除拾光失败');
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    // 取消删除，不做处理
  });
};

// 图片上传成功处理
const handleUploadSuccess = (response, file) => {
  if (response && response.code === 200) {
    // 获取上传后的URL
    let imageUrl = '';
    if (typeof response.data === 'string') {
      imageUrl = response.data;
    } else if (response.data.url) {
      imageUrl = response.data.url;
    } else if (response.data.path) {
      imageUrl = response.data.path;
    } else if (response.data.fileUrl) {
      imageUrl = response.data.fileUrl;
    }
    
    if (imageUrl) {
      // 添加到图片列表
      complaintForm.images.push(imageUrl);
      ElMessage.success('图片上传成功');
    }
  } else {
    ElMessage.error(response?.msg || '图片上传失败');
  }
  uploadLoading.value = false;
};

// 图片上传前检查
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  
  uploadLoading.value = true;
  return true;
};

// 移除图片
const handleRemove = (file) => {
  const fileUrl = file.url;
  const index = complaintForm.images.indexOf(fileUrl);
  if (index !== -1) {
    complaintForm.images.splice(index, 1);
  }
};

// 处理拾光图片粘贴
const handleComplaintPasteImage = async (event) => {
  // 确保焦点在图片输入框时才处理粘贴事件
  if (!imageInputRef.value || document.activeElement !== imageInputRef.value.input) return;
  
  const items = event.clipboardData.items;
  let file = null;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      file = items[i].getAsFile();
      break;
    }
  }
  
  if (file) {
    event.preventDefault(); // 阻止默认粘贴行为
    
    try {
      uploadLoading.value = true;
      ElMessage.info('正在上传图片...');
      
      const response = await api.upload.uploadImage(file);
      
      if (response && response.code === 200 && response.data) {
        // 根据后端返回的数据结构获取URL
        let imageUrl = '';
        if (typeof response.data === 'string') {
          // 如果直接返回URL字符串
          imageUrl = response.data;
        } else if (response.data.url) {
          // 如果返回对象中包含url字段
          imageUrl = response.data.url;
        } else if (response.data.path) {
          // 如果返回对象中包含path字段
          imageUrl = response.data.path;
        } else if (response.data.fileUrl) {
          // 如果返回对象中包含fileUrl字段
          imageUrl = response.data.fileUrl;
        }
        
        if (imageUrl) {
          // 添加到图片列表
          complaintForm.images.push(imageUrl);
          
          // 添加到文件列表，用于显示
          fileList.value.push({
            name: `图片${complaintForm.images.length}`,
            url: imageUrl
          });
          
          ElMessage.success('图片上传成功');
        } else {
          ElMessage.error('无法获取上传的图片URL');
          console.error('上传响应中未找到图片URL:', response.data);
        }
      } else {
        ElMessage.error(response?.msg || '图片上传失败');
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      ElMessage.error('图片上传失败');
    } finally {
      uploadLoading.value = false;
    }
  }
};

// 设置拾光粘贴事件监听
const setupComplaintPasteListener = () => {
  // 添加全局粘贴事件监听
  document.addEventListener('paste', handleComplaintPasteImage);
};

// 移除拾光粘贴事件监听
const removeComplaintPasteListener = () => {
  document.removeEventListener('paste', handleComplaintPasteImage);
};

// 处理拾光对话框关闭
const handleComplaintDialogClose = () => {
  removeComplaintPasteListener();
  complaintDialogVisible.value = false;
};

// 添加图片URL到图片列表
const addImageUrl = () => {
  if (imageUrl.value.trim()) {
    // 添加到图片列表
    complaintForm.images.push(imageUrl.value);
    
    // 添加到文件列表，用于显示
    fileList.value.push({
      name: `图片${complaintForm.images.length}`,
      url: imageUrl.value
    });
    
    // 清空输入框
    imageUrl.value = '';
    ElMessage.success('图片URL已添加');
  }
};

// 获取时间轴事件列表
const fetchTimelineEvents = async () => {
  loading.value = true;
  try {
    const response = await api.timeline.listTimelineEvents({
      pageNum: timelineCurrentPage.value,
      pageSize: timelinePageSize.value
    });
    
    if (response && response.code === 200) {
      timelineTableData.value = response.data.list || [];
      timelineTotal.value = response.data.total || 0;
    } else {
      ElMessage.error(response?.msg || '获取时间轴事件列表失败');
    }
  } catch (error) {
    console.error('获取时间轴事件列表失败:', error);
    ElMessage.error('获取时间轴事件列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取时间轴分类
const fetchTimelineCategories = async () => {
  try {
    const response = await api.timeline.getTimelineCategories();
    if (response && response.code === 200) {
      categoryOptions.value = response.data || [];
    }
  } catch (error) {
    console.error('获取时间轴分类失败:', error);
  }
};

// 时间轴分页变化
const handleTimelinePageChange = (page) => {
  timelineCurrentPage.value = page;
  fetchTimelineEvents();
};

// 时间轴每页条数变化
const handleTimelineSizeChange = (size) => {
  timelinePageSize.value = size;
  timelineCurrentPage.value = 1;
  fetchTimelineEvents();
};

// 处理新增时间轴事件
const handleAddTimelineEvent = () => {
  // 重置表单
  Object.keys(timelineForm).forEach(key => {
    if (key === 'displayOrder') {
      timelineForm[key] = 0; // 默认顺序为0
    } else {
      timelineForm[key] = '';
    }
  });
  
  // 获取分类列表
  fetchTimelineCategories();
  
  isEditTimeline.value = false;
  timelineDialogVisible.value = true;
};

// 处理编辑时间轴事件
const handleEditTimelineEvent = async (row) => {
  try {
    loading.value = true;
    
    // 获取分类列表
    await fetchTimelineCategories();
    
    // 获取事件详情
    const response = await api.timeline.getTimelineEventById(row.id);
    
    if (response && response.code === 200) {
      const eventData = response.data;
      
      // 填充表单数据
      timelineForm.id = eventData.id;
      timelineForm.title = eventData.title || '';
      timelineForm.content = eventData.content || '';
      timelineForm.date = eventData.date || '';
      timelineForm.category = eventData.category || '';
      timelineForm.icon = eventData.icon || '';
      timelineForm.displayOrder = eventData.displayOrder || 0;
      
      isEditTimeline.value = true;
      timelineDialogVisible.value = true;
    } else {
      ElMessage.error(response?.msg || '获取事件详情失败');
    }
  } catch (error) {
    console.error('获取事件详情失败:', error);
    ElMessage.error('获取事件详情失败');
  } finally {
    loading.value = false;
  }
};

// 提交时间轴事件表单
const submitTimelineForm = async () => {
  if (!timelineFormRef.value) return;
  
  timelineFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        
        // 准备事件数据
        const eventData = { ...timelineForm };
        
        let response;
        
        if (isEditTimeline.value) {
          // 编辑事件
          response = await api.timeline.updateTimelineEvent(timelineForm.id, eventData);
          if (response && response.code === 200) {
            ElMessage.success('事件更新成功');
          } else {
            ElMessage.error(response?.msg || '更新事件失败');
          }
        } else {
          // 创建事件
          response = await api.timeline.createTimelineEvent(eventData);
          if (response && response.code === 200) {
            ElMessage.success('事件创建成功');
          } else {
            ElMessage.error(response?.msg || '创建事件失败');
          }
        }
        
        if (response && response.code === 200) {
          timelineDialogVisible.value = false;
          fetchTimelineEvents(); // 刷新列表
        }
      } catch (error) {
        console.error(isEditTimeline.value ? '更新事件失败:' : '创建事件失败:', error);
        ElMessage.error(isEditTimeline.value ? '更新事件失败' : '创建事件失败');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 删除时间轴事件
const handleDeleteTimelineEvent = (row) => {
  ElMessageBox.confirm('确定要删除该事件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true;
      const response = await api.timeline.deleteTimelineEvent(row.id);
      
      if (response && response.code === 200) {
        ElMessage.success('删除成功');
        fetchTimelineEvents(); // 刷新列表
      } else {
        ElMessage.error(response?.msg || '删除失败');
      }
    } catch (error) {
      console.error('删除事件失败:', error);
      ElMessage.error('删除事件失败');
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    // 取消删除，不做处理
  });
};

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true;
  try {
    // 先从本地存储获取
    const localUserInfo = getUserInfo();
    console.log('本地用户信息:', localUserInfo);
    
    if (localUserInfo) {
      formData.id = localUserInfo.id || '';
      formData.username = localUserInfo.username || '';
      formData.nickname = localUserInfo.nickname || '';
      formData.email = localUserInfo.email || '';
      formData.phone = localUserInfo.phone || '';
      formData.avatar = localUserInfo.avatar || '';
    }
    
    // 如果有用户设置API，可以获取更多信息
    if (formData.id) {
      try {
        console.log('正在获取用户设置信息，用户ID:', formData.id);
        const response = await api.user.getUserSetting(formData.id);
        console.log('获取用户设置响应:', response);
        
        if (response && response.code === 200 && response.data) {
          // 确保所有字段都有值
          formData.bio = response.data.bio || '';
          formData.blogIntro = response.data.blogIntro || '';
          formData.contactEmail = response.data.contactEmail || '';
          formData.githubUrl = response.data.githubUrl || '';
          formData.extraContacts = response.data.extraContacts || '';
          
          console.log('设置表单数据:', {
            bio: formData.bio,
            blogIntro: formData.blogIntro,
            contactEmail: formData.contactEmail,
            githubUrl: formData.githubUrl,
            extraContacts: formData.extraContacts
          });
          
          // 解析额外联系方式
          try {
            if (formData.extraContacts) {
              formData.parsedExtraContacts = JSON.parse(formData.extraContacts);
              console.log('解析后的额外联系方式:', formData.parsedExtraContacts);
              
              // 提取微信号
              if (formData.parsedExtraContacts.wechat) {
                formData.wechat = formData.parsedExtraContacts.wechat;
                console.log('设置微信号:', formData.wechat);
              }
            } else {
              formData.parsedExtraContacts = {};
              formData.wechat = '';
            }
          } catch (e) {
            console.error('解析额外联系方式失败:', e);
            formData.parsedExtraContacts = {};
            formData.wechat = '';
          }
          
          // 如果有联系方式，也可以设置
          if (response.data.contactEmail) {
            formData.email = response.data.contactEmail;
          }
        }
      } catch (error) {
        console.error('获取用户设置失败:', error);
      }
    }
    
    // 强制更新表单数据
    nextTick(() => {
      console.log('表单数据更新完成:', {
        bio: formData.bio,
        blogIntro: formData.blogIntro,
        contactEmail: formData.contactEmail,
        githubUrl: formData.githubUrl,
        wechat: formData.wechat
      });
    });
    
  } catch (error) {
    console.error('获取用户信息失败:', error);
  } finally {
    loading.value = false;
  }
};

// 保存用户信息
const saveUserInfo = async () => {
  try {
    loading.value = true;
    
    // 处理额外联系方式
    const extraContactsObj = {
      ...formData.parsedExtraContacts
    };
    
    // 如果有微信，添加到额外联系方式
    if (formData.wechat) {
      extraContactsObj.wechat = formData.wechat;
    }
    
    // 准备用户设置数据
    const settingData = {
      userId: formData.id,
      bio: formData.bio || '',
      blogIntro: formData.blogIntro || '',
      contactEmail: formData.contactEmail || formData.email || '',
      githubUrl: formData.githubUrl || '',
      extraContacts: Object.keys(extraContactsObj).length > 0 ? JSON.stringify(extraContactsObj) : ''
    };
    
    // 更新用户设置
    const settingResponse = await api.user.updateUserSetting(formData.id, settingData);
    
    // 更新本地存储的用户信息
    const currentUserInfo = getUserInfo();
    if (currentUserInfo) {
      currentUserInfo.nickname = formData.nickname;
      currentUserInfo.email = formData.email;
      currentUserInfo.phone = formData.phone;
      currentUserInfo.avatar = formData.avatar;
      setUserInfo(currentUserInfo);
    }
    
    ElMessage.success('个人信息保存成功');
  } catch (error) {
    console.error('保存用户信息失败:', error);
    ElMessage.error('保存失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 处理头像粘贴上传
const handleAvatarPaste = async (event) => {
  // 确保焦点在头像输入框时才处理粘贴事件
  if (document.activeElement !== avatarRef.value.input) return;
  
  const items = event.clipboardData.items;
  let file = null;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      file = items[i].getAsFile();
      break;
    }
  }
  
  if (file) {
    event.preventDefault(); // 阻止默认粘贴行为
    await uploadAvatar(file);
  }
};

// 上传头像
const uploadAvatar = async (file) => {
  try {
    avatarUploadLoading.value = true;
    ElMessage.info('正在上传头像...');
    
    const response = await api.upload.uploadImage(file);
    
    if (response && response.code === 200 && response.data) {
      // 根据后端返回的数据结构获取URL
      let imageUrl = '';
      if (typeof response.data === 'string') {
        imageUrl = response.data;
      } else if (response.data.url) {
        imageUrl = response.data.url;
      } else if (response.data.path) {
        imageUrl = response.data.path;
      } else if (response.data.fileUrl) {
        imageUrl = response.data.fileUrl;
      }
      
      if (imageUrl) {
        formData.avatar = imageUrl;
        
        // 更新本地存储的用户信息
        const currentUserInfo = getUserInfo();
        if (currentUserInfo) {
          currentUserInfo.avatar = imageUrl;
          setUserInfo(currentUserInfo);
        }
        
        ElMessage.success('头像上传成功');
      } else {
        ElMessage.error('无法获取上传的图片URL');
      }
    } else {
      ElMessage.error(response?.msg || '头像上传失败');
    }
  } catch (error) {
    console.error('头像上传失败:', error);
    ElMessage.error('头像上传失败');
  } finally {
    avatarUploadLoading.value = false;
  }
};

// 设置头像粘贴事件监听
const setupAvatarPasteListener = () => {
  document.addEventListener('paste', handleAvatarPaste);
};

// 移除头像粘贴事件监听
const removeAvatarPasteListener = () => {
  document.removeEventListener('paste', handleAvatarPaste);
};

// 打开修改密码对话框
const openPasswordDialog = () => {
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordDialogVisible.value = true;
};

// 提交修改密码
const submitPasswordForm = async () => {
  if (!passwordFormRef.value) return;
  
  passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        
        // 这里需要调用后端API修改密码
        // 假设有一个修改密码的API
        const response = await api.auth.updatePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        });
        
        if (response && response.code === 200) {
          ElMessage.success('密码修改成功，请重新登录');
          passwordDialogVisible.value = false;
          
          // 退出登录，重定向到登录页
          setTimeout(() => {
            logout();
            router.push('/login');
          }, 1500);
        } else {
          ElMessage.error(response?.msg || '密码修改失败');
        }
      } catch (error) {
        console.error('密码修改失败:', error);
        ElMessage.error('密码修改失败，请检查当前密码是否正确');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 头像上传前检查
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  
  avatarUploadLoading.value = true;
  return true;
};

// 头像上传成功处理
const handleAvatarSuccess = (response, file) => {
  if (response && response.code === 200) {
    // 获取上传后的URL
    let imageUrl = '';
    if (typeof response.data === 'string') {
      imageUrl = response.data;
    } else if (response.data.url) {
      imageUrl = response.data.url;
    } else if (response.data.path) {
      imageUrl = response.data.path;
    } else if (response.data.fileUrl) {
      imageUrl = response.data.fileUrl;
    }
    
    if (imageUrl) {
      formData.avatar = imageUrl;
      
      // 更新本地存储的用户信息
      const currentUserInfo = getUserInfo();
      if (currentUserInfo) {
        currentUserInfo.avatar = imageUrl;
        setUserInfo(currentUserInfo);
      }
      
      ElMessage.success('头像上传成功');
    }
  } else {
    ElMessage.error(response?.msg || '头像上传失败');
  }
  avatarUploadLoading.value = false;
};

onMounted(() => {
  // 获取用户信息
  userInfo.value = getUserInfo();
  if (!userInfo.value) {
    // 如果没有用户信息，重定向到登录页面
    router.push('/login');
    return;
  }
});

// 监听菜单变化
watch(activeMenu, (newMenu, oldMenu) => {
  console.log('菜单变化:', oldMenu, '->', newMenu);
  if (newMenu === 'articles') {
    fetchArticles();
    fetchCategoriesAndTags();
  } else if (newMenu === 'moments') {
    fetchComplaints();
    fetchMoods();
  } else if (newMenu === 'timeline') {
    fetchTimelineEvents();
    fetchTimelineCategories();
  } else if (newMenu === 'profile') {
    console.log('切换到个人信息管理页面');
    // 获取最新的用户信息
    fetchUserInfo();
    // 设置头像粘贴事件监听
    setupAvatarPasteListener();
  } else {
    // 移除头像粘贴事件监听
    removeAvatarPasteListener();
  }
}, { immediate: true });

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
              <el-table-column prop="title" label="标题" width="150" />
              <el-table-column prop="content" label="内容摘要" min-width="60%">
                <template #default="scope">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="scope.row.content || '暂无内容'"
                    placement="top-start"
                  >
                    <div class="summary-text">{{ scope.row.content ? scope.row.content.substring(0, 100) + (scope.row.content.length > 100 ? '...' : '') : '暂无内容' }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="发布日期" width="180">
                <template #default="scope">
                  {{ new Date(scope.row.createTime).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="handleEditArticle(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :type="scope.row.status === 1 ? 'warning' : 'success'"
                    @click="handlePublishArticle(scope.row)"
                  >
                    {{ scope.row.status === 1 ? '撤回' : '发布' }}
                  </el-button>
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
              :title="isEdit ? '编辑文章' : '新增文章'"
              width="70%"
              :close-on-click-modal="false"
              @closed="handleDialogClose"
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
                    filterable
                    allow-create
                    default-first-option
                    @visible-change="val => !val && createCategory(articleForm.category)"
                  >
                    <el-option 
                      v-for="category in categoryOptions" 
                      :key="category" 
                      :label="category" 
                      :value="category" 
                    />
                  </el-select>
                  <span class="form-tip">可手动输入新分类</span>
                </el-form-item>
                
                <el-form-item label="标签">
                  <el-select 
                    v-model="articleForm.tags" 
                    multiple 
                    placeholder="请选择标签"
                    clearable
                    filterable
                    allow-create
                    default-first-option
                    @visible-change="val => !val && articleForm.tags.forEach(tag => createTag(tag))"
                  >
                    <el-option 
                      v-for="tag in tagOptions" 
                      :key="tag" 
                      :label="tag" 
                      :value="tag" 
                    />
                  </el-select>
                  <span class="form-tip">可手动输入新标签</span>
                </el-form-item>
                
                <el-form-item label="缩略图">
                  <el-input 
                    ref="thumbnailRef"
                    v-model="articleForm.thumbnail" 
                    placeholder="请输入缩略图URL或直接粘贴图片" 
                    :loading="uploadLoading"
                  >
                    <template #append>
                      <el-tooltip content="支持直接粘贴图片" placement="top">
                        <span>粘贴</span>
                      </el-tooltip>
                    </template>
                  </el-input>
                  <span class="form-tip">支持直接粘贴图片，自动上传</span>
                  
                  <div v-if="articleForm.thumbnail" class="thumbnail-preview">
                    <img :src="articleForm.thumbnail" alt="缩略图预览" />
                  </div>
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
            <div class="action-bar">
              <h2>拾光管理</h2>
              <el-button type="primary" @click="handleAddComplaint">新增拾光</el-button>
            </div>
            
            <el-table
              v-loading="loading"
              :data="complaintTableData"
              style="width: 100%"
              border
            >
              <el-table-column prop="title" label="标题" width="150" />
              <el-table-column prop="content" label="内容摘要" min-width="50%">
                <template #default="scope">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="scope.row.content || '暂无内容'"
                    placement="top-start"
                  >
                    <div class="summary-text">{{ scope.row.content ? scope.row.content.substring(0, 100) + (scope.row.content.length > 100 ? '...' : '') : '暂无内容' }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="mood" label="心情" width="100" />
              <el-table-column label="发布日期" width="180">
                <template #default="scope">
                  {{ new Date(scope.row.createTime).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="handleEditComplaint(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    :type="scope.row.status === 1 ? 'warning' : 'success'"
                    @click="handlePublishComplaint(scope.row)"
                  >
                    {{ scope.row.status === 1 ? '撤回' : '发布' }}
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="handleDeleteComplaint(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="complaintCurrentPage"
                v-model:page-size="complaintPageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="complaintTotal"
                @size-change="handleComplaintSizeChange"
                @current-change="handleComplaintPageChange"
              />
            </div>
            
            <!-- 新增/编辑拾光对话框 -->
            <el-dialog
              v-model="complaintDialogVisible"
              :title="isEditComplaint ? '编辑拾光' : '新增拾光'"
              width="70%"
              :close-on-click-modal="false"
              @closed="handleComplaintDialogClose"
            >
              <el-form
                ref="complaintFormRef"
                :model="complaintForm"
                :rules="complaintFormRules"
                label-width="100px"
              >
                <el-form-item label="标题" prop="title">
                  <el-input v-model="complaintForm.title" placeholder="请输入拾光标题" />
                </el-form-item>
                
                <el-form-item label="内容" prop="content">
                  <el-input 
                    v-model="complaintForm.content" 
                    type="textarea" 
                    :rows="5" 
                    placeholder="请输入拾光内容" 
                  />
                </el-form-item>
                
                <el-form-item label="心情标签" prop="mood">
                  <el-select 
                    v-model="complaintForm.mood" 
                    placeholder="请选择心情标签"
                    filterable
                    :allow-create="false"
                    style="width: 100%"
                    popper-class="mood-select-dropdown"
                  >
                    <el-option 
                      v-for="mood in moodOptions" 
                      :key="mood" 
                      :label="mood" 
                      :value="mood" 
                    />
                  </el-select>
                  <span class="form-tip">请从列表中选择心情标签，可用选项: {{ moodOptions.join(', ') }}</span>
                </el-form-item>
                
                <el-form-item label="图片URL">
                  <el-input 
                    ref="imageInputRef"
                    v-model="imageUrl"
                    placeholder="请输入图片URL或直接粘贴图片" 
                    :loading="uploadLoading"
                    @keyup.enter="addImageUrl"
                  >
                    <template #append>
                      <el-button @click="addImageUrl">添加</el-button>
                    </template>
                  </el-input>
                  <span class="form-tip">支持直接粘贴图片，自动上传，或输入URL后按回车/点击添加</span>
                </el-form-item>
                
                <el-form-item label="图片">
                  <el-upload
                    action="/api/file/upload"
                    :headers="{ 'Authorization': 'Bearer ' + getToken() }"
                    list-type="picture-card"
                    :file-list="fileList"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeUpload"
                    :on-remove="handleRemove"
                    multiple
                    :limit="9"
                  >
                    <el-icon><Plus /></el-icon>
                    <template #tip>
                      <div class="form-tip">支持多张图片上传，单张图片不超过2MB</div>
                    </template>
                  </el-upload>
                </el-form-item>
                
                <el-form-item label="状态">
                  <el-radio-group v-model="complaintForm.status">
                    <el-radio :label="0">草稿</el-radio>
                    <el-radio :label="1">发布</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              
              <template #footer>
                <el-button @click="complaintDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitComplaintForm" :loading="loading">
                  保存
                </el-button>
              </template>
            </el-dialog>
          </div>
          
          <!-- 时光轴管理 -->
          <div v-if="activeMenu === 'timeline'">
            <div class="action-bar">
              <h2>时光轴管理</h2>
              <el-button type="primary" @click="handleAddTimelineEvent">新增事件</el-button>
            </div>
            
            <el-table
              v-loading="loading"
              :data="timelineTableData"
              style="width: 100%"
              border
            >
              <el-table-column prop="title" label="标题" width="180" />
              <el-table-column prop="content" label="内容摘要" min-width="30%">
                <template #default="scope">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="scope.row.content || '暂无内容'"
                    placement="top-start"
                  >
                    <div class="summary-text">{{ scope.row.content ? scope.row.content.substring(0, 100) + (scope.row.content.length > 100 ? '...' : '') : '暂无内容' }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="日期" width="120" />
              <el-table-column prop="category" label="分类" width="100" />
              <el-table-column prop="icon" label="图标" width="80">
                <template #default="scope">
                  {{ scope.row.icon || '无' }}
                </template>
              </el-table-column>
              <el-table-column prop="displayOrder" label="排序" width="80" />
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="handleEditTimelineEvent(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDeleteTimelineEvent(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="timelineCurrentPage"
                v-model:page-size="timelinePageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="timelineTotal"
                @size-change="handleTimelineSizeChange"
                @current-change="handleTimelinePageChange"
              />
            </div>
            
            <!-- 新增/编辑时间轴事件对话框 -->
            <el-dialog
              v-model="timelineDialogVisible"
              :title="isEditTimeline ? '编辑事件' : '新增事件'"
              width="70%"
              :close-on-click-modal="false"
            >
              <el-form
                ref="timelineFormRef"
                :model="timelineForm"
                :rules="timelineFormRules"
                label-width="100px"
              >
                <el-form-item label="标题" prop="title">
                  <el-input v-model="timelineForm.title" placeholder="请输入事件标题" />
                </el-form-item>
                
                <el-form-item label="内容" prop="content">
                  <el-input 
                    v-model="timelineForm.content" 
                    type="textarea" 
                    :rows="5" 
                    placeholder="请输入事件内容" 
                  />
                </el-form-item>
                
                <el-form-item label="日期" prop="date">
                  <el-date-picker
                    v-model="timelineForm.date"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
                
                <el-form-item label="分类" prop="category">
                  <el-select 
                    v-model="timelineForm.category" 
                    placeholder="请选择分类"
                    filterable
                    allow-create
                    default-first-option
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="category in categoryOptions" 
                      :key="category" 
                      :label="category" 
                      :value="category" 
                    />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="图标" prop="icon">
                  <el-input v-model="timelineForm.icon" placeholder="请输入图标Emoji，如: 🚀" />
                </el-form-item>
                
                <el-form-item label="排序" prop="displayOrder">
                  <el-input-number v-model="timelineForm.displayOrder" :min="0" :max="999" />
                  <span class="form-tip">数字越小排序越靠前，同一天内的事件按此排序</span>
                </el-form-item>
              </el-form>
              
              <template #footer>
                <el-button @click="timelineDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitTimelineForm" :loading="loading">
                  保存
                </el-button>
              </template>
            </el-dialog>
          </div>
          
          <!-- 个人信息管理 -->
          <div v-if="activeMenu === 'profile'" class="form-container">
            <h2>个人信息管理</h2>
            <el-form v-loading="loading" :model="formData" label-width="120px" class="admin-form">
              <el-form-item label="头像">
                <div class="avatar-container">
                  <el-avatar :size="100" :src="formData.avatar" v-if="formData.avatar">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                  </el-avatar>
                  <el-avatar :size="100" icon="el-icon-user-solid" v-else></el-avatar>
                  
                  <div class="avatar-upload">
                    <el-upload
                      action="/api/file/upload"
                      :headers="{ 'Authorization': 'Bearer ' + getToken() }"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <el-button size="small" type="primary">上传头像</el-button>
                    </el-upload>
                    
                    <div class="avatar-input">
                      <el-input 
                        ref="avatarRef"
                        v-model="formData.avatar" 
                        placeholder="请输入头像URL或直接粘贴图片" 
                        :loading="avatarUploadLoading"
                      >
                        <template #append>
                          <el-tooltip content="支持直接粘贴图片" placement="top">
                            <span>粘贴</span>
                          </el-tooltip>
                        </template>
                      </el-input>
                      <span class="form-tip">支持直接粘贴图片，自动上传</span>
                    </div>
                  </div>
                </div>
              </el-form-item>
              
              <el-form-item label="用户名">
                <el-input v-model="formData.username" disabled />
                <span class="form-tip">用户名不可修改</span>
              </el-form-item>
              
              <el-form-item label="昵称">
                <el-input v-model="formData.nickname" />
              </el-form-item>
              
              <el-form-item label="邮箱">
                <el-input v-model="formData.email" />
              </el-form-item>
              
              <el-form-item label="手机号">
                <el-input v-model="formData.phone" />
              </el-form-item>
              
              <el-form-item label="个人简介">
                <el-input v-model="formData.bio" type="textarea" :rows="4" placeholder="请输入个人简介，显示在关于页面" />
              </el-form-item>
              
              <el-form-item label="博客介绍">
                <el-input v-model="formData.blogIntro" type="textarea" :rows="4" placeholder="请输入博客介绍，显示在关于页面" />
              </el-form-item>
              
              <el-divider content-position="center">联系方式设置</el-divider>
              
              <el-form-item label="联系邮箱">
                <el-input v-model="formData.contactEmail" placeholder="请输入联系邮箱，显示在关于页面" />
              </el-form-item>
              
              <el-form-item label="GitHub链接">
                <el-input v-model="formData.githubUrl" placeholder="请输入GitHub链接，显示在关于页面" />
              </el-form-item>
              
              <el-form-item label="微信号">
                <el-input v-model="formData.wechat" placeholder="请输入微信号，显示在关于页面" />
              </el-form-item>
              
              <el-form-item v-if="false">
                <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo" :loading="loading">保存修改</el-button>
                <el-button type="warning" @click="openPasswordDialog">修改密码</el-button>
              </el-form-item>
            </el-form>
            
            <!-- 修改密码对话框 -->
            <el-dialog
              v-model="passwordDialogVisible"
              title="修改密码"
              width="500px"
            >
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="100px"
              >
                <el-form-item label="当前密码" prop="oldPassword">
                  <el-input 
                    v-model="passwordForm.oldPassword" 
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="新密码" prop="newPassword">
                  <el-input 
                    v-model="passwordForm.newPassword" 
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input 
                    v-model="passwordForm.confirmPassword" 
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                  />
                </el-form-item>
              </el-form>
              
              <template #footer>
                <el-button @click="passwordDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitPasswordForm" :loading="loading">
                  确认修改
                </el-button>
              </template>
            </el-dialog>
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
  min-height: 100vh;
  background-color: #f5f5f5;
}

.dashboard-layout {
  height: 100vh;
}

.dashboard-header {
  background-color: #11754b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-aside {
  background-color: white;
  border-right: 1px solid #e6e6e6;
}

.content-main {
  padding: 20px;
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
  justify-content: center;
}

.summary-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #888;
}

.thumbnail-preview {
  margin-top: 10px;
  max-width: 200px;
  max-height: 150px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.thumbnail-preview img {
  width: 100%;
  height: auto;
  display: block;
}

/* 心情选择下拉菜单样式 */
:deep(.mood-select-dropdown) {
  max-height: 300px !important;
}

.avatar-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.avatar-input {
  width: 300px;
}
</style> 